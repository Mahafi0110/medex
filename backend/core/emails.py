"""Contact-form notification emails.

Kept out of the view so a mail failure can never turn a valid submission into an
error response: everything here is caught, logged and reported as a bool.

Configuration is entirely through environment variables (see .env.example):

    EMAIL_HOST / EMAIL_PORT / EMAIL_HOST_USER / EMAIL_HOST_PASSWORD
    EMAIL_USE_TLS or EMAIL_USE_SSL      -> switches Django to the SMTP backend
    DEFAULT_FROM_EMAIL                  -> the "from" address
    CONTACT_NOTIFY_EMAILS               -> comma-separated recipients, falling
                                           back to Site Settings -> email

With no SMTP host configured, Django's console backend prints the message to the
log stream instead of sending it, so a submission is never silently dropped.
"""
import logging
import os

from django.conf import settings
from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)

# Don't try to attach an enormous resume to an email; mention it instead. The
# file is always available in Django Admin -> Contact messages regardless.
MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024


def notification_recipients():
    """Who gets Contact-form notifications: env first, then Site Settings."""
    recipients = list(getattr(settings, "CONTACT_NOTIFY_EMAILS", None) or [])
    if not recipients:
        try:
            from .models import SiteSettings

            site_email = SiteSettings.load().email
        except Exception:  # noqa: BLE001 — notification must never break a request
            site_email = ""
        if site_email:
            recipients.append(site_email)
    return recipients


def _body(submission, resume_attached):
    lines = [
        "New enquiry submitted through the MedEX website.",
        "",
        f"Name:          {submission.name}",
        f"Email:         {submission.email}",
        f"Phone:         {submission.phone or '-'}",
        f"Organization:  {submission.organization or '-'}",
        f"Subject:       {submission.subject or '-'}",
        f"Interested in: {submission.interested_in or '-'}",
        f"Received:      {submission.created_at:%Y-%m-%d %H:%M %Z}",
        "",
        "Message:",
        submission.message or "(none)",
    ]
    if submission.additional_info:
        lines += ["", "Additional details:", submission.additional_info]
    if submission.resume:
        if resume_attached:
            lines += ["", f"Resume attached: {os.path.basename(submission.resume.name)}"]
        else:
            lines += [
                "",
                f"A resume was uploaded ({submission.resume.name}) but it is larger than "
                f"{MAX_ATTACHMENT_BYTES // (1024 * 1024)} MB, so it is not attached - download "
                "it from Django Admin -> Contact messages.",
            ]
    lines += [
        "",
        "-----------------------------",
        "Reply directly to this email to answer the sender, or find the record under "
        "Django Admin -> Contact messages.",
    ]
    return "\n".join(lines)


def send_contact_notification(submission):
    """Email the site's team about a new Contact-form submission.

    Returns True when the message was handed to the mail backend. Never raises.
    """
    recipients = notification_recipients()
    if not recipients:
        logger.warning(
            "Contact submission #%s stored, but no notification recipients are configured. "
            "Set CONTACT_NOTIFY_EMAILS, or fill in Site Settings -> email.",
            submission.pk,
        )
        return False

    resume_attached = False
    attachment = None
    if submission.resume:
        try:
            if submission.resume.size <= MAX_ATTACHMENT_BYTES:
                with submission.resume.open("rb") as handle:
                    attachment = handle.read()
                resume_attached = True
        except Exception:  # noqa: BLE001
            logger.exception("Could not read the resume for submission #%s", submission.pk)

    subject_line = submission.subject or f"Website enquiry from {submission.name}"
    try:
        email = EmailMessage(
            subject=f"[MedEX website] {subject_line}",
            body=_body(submission, resume_attached),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
            reply_to=[submission.email] if submission.email else None,
        )
        if attachment:
            email.attach(
                os.path.basename(submission.resume.name), attachment, "application/octet-stream"
            )
        email.send(fail_silently=False)
    except Exception:  # noqa: BLE001
        logger.exception(
            "Failed to send the Contact-form notification for submission #%s using %s. "
            "The submission is still stored and visible in Django Admin.",
            submission.pk,
            getattr(settings, "EMAIL_BACKEND", "?"),
        )
        return False

    logger.info(
        "Contact-form notification for submission #%s sent to %s", submission.pk, recipients
    )
    return True
