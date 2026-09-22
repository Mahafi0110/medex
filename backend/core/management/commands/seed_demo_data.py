from django.core.management.base import BaseCommand
from core.models import (
    ProductCategory,
    Product,
    Service,
    HomeHero,
    HomeTrustPoint,
    ServicePage,
    ServiceFeatureItem,
    ServiceProcessStep,
    ServiceEquipmentItem,
    ServiceValueItem,
    AboutSection,
    EcosystemPillar,
    OperatingPillar,
    VisionMission,
    VisionHighlight,
    VisionStatusRow,
    MissionPillar,
    CompanyStat,
    TeamMember,
    SiteSettings,
    PageIntro,
    AboutPageContent,
    WhyChooseUsItem,
    OfficeLocation,
    ContactPageContent,
    ContactHighlight,
)

# Subset used only to detect "this database already has content" (see the safety
# guard in handle()). Contact-form submissions are deliberately excluded.
CONTENT_MODELS = (
    ProductCategory,
    Product,
    Service,
    ServicePage,
    HomeHero,
    PageIntro,
    TeamMember,
    CompanyStat,
    EcosystemPillar,
    OperatingPillar,
    VisionMission,
    AboutSection,
    AboutPageContent,
    ContactPageContent,
    SiteSettings,
)


class Command(BaseCommand):
    help = "Populates the database with sample MedEX content so the site and admin aren't empty."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Run even when the database already has content. NOTE: this rewrites the "
                 "singleton content (hero, page intros, site settings...) and will destroy "
                 "anything entered through Django Admin.",
        )

    def handle(self, *args, **options):
        # Safety guard: this command overwrites the site's singleton content.
        # Running it against a database that already has content would wipe
        # whatever the client typed in Django Admin, so it refuses by default
        # and simply does nothing (instead of failing a deploy that still calls
        # it). Use --force for a deliberate re-seed.
        if not options["force"]:
            existing = [model.__name__ for model in CONTENT_MODELS if model.objects.exists()]
            if existing:
                self.stdout.write(
                    self.style.WARNING(
                        "Existing content found ({}). seed_demo_data does nothing to protect "
                        "your admin edits - pass --force to overwrite it anyway.".format(
                            ", ".join(existing)
                        )
                    )
                )
                return

        home_hero = HomeHero.load()
        home_hero.eyebrow = "Biomedical Engineering · Digital Health · Better Care"
        home_hero.title_main = "Keeping Healthcare Technology Running "
        home_hero.title_highlight = "When It Matters Most."
        home_hero.subtitle = (
            "Expert biomedical engineering, seamless equipment support and connected "
            "digital health solutions for hospitals, diagnostic centers and clinics."
        )
        home_hero.primary_button_label = "Explore Our Services"
        home_hero.primary_button_url = "/services"
        home_hero.secondary_button_label = "Get a Quote"
        home_hero.secondary_button_url = "/contact"
        home_hero.save()

        if not home_hero.trust_points.exists():
            trust_points = [
                ("shield", "Reliable Equipment"),
                ("check", "Clinical Safety"),
                ("clock", "Faster Response"),
                ("users", "Trusted Partnership"),
            ]
            for i, (icon, label) in enumerate(trust_points):
                HomeTrustPoint.objects.create(home_hero=home_hero, icon=icon, label=label, order=i)

        categories = {
            "Mobile Applications": "Patient and clinician apps for connected care.",
            "Web Applications": "Browser-based platforms for hospitals and diagnostic centers.",
            "Desktop Software": "On-site tools for biomedical engineering teams.",
            "Healthcare Tools": "Devices and utilities supporting clinical workflows.",
        }
        cat_objs = {}
        for i, (name, desc) in enumerate(categories.items()):
            cat, _ = ProductCategory.objects.get_or_create(
                name=name, defaults={"description": desc, "order": i}
            )
            cat_objs[name] = cat

        products = [
            dict(
                name="AV TeleMed – For Patients",
                category=cat_objs["Mobile Applications"],
                product_type="mobile",
                tagline="Your Health. Always Connected.",
                summary="A user-friendly mobile app that helps patients track vitals, manage appointments, and access medical history.",
                description=(
                    "AV TeleMed for Patients empowers individuals and their families with easy access to "
                    "quality healthcare through a secure and intuitive mobile app. It connects you with your "
                    "doctors, enables virtual consultations, helps you monitor your health and keeps all your "
                    "important medical information in one place. With AV TeleMed, you can manage your health "
                    "conveniently, stay informed, and make better healthcare decisions — anytime, anywhere."
                ),
                key_features=(
                    "Book appointments with your doctor\n"
                    "Join secure video consultations\n"
                    "Track and monitor your vital signs\n"
                    "Access medical history and reports\n"
                    "Manage medications and get reminders\n"
                    "Connect with your healthcare providers\n"
                    "Emergency SOS support\n"
                    "Easy to use, anytime, anywhere"
                ),
                specifications=(
                    "Platform: iOS & Android (Mobile App)\n"
                    "User Type: Patients & Family Members\n"
                    "Account Creation: Email / Mobile OTP\n"
                    "Appointment Booking: Yes\n"
                    "Video Consultation: Yes\n"
                    "Vital Signs Tracking: Yes (with compatible devices)\n"
                    "Medication Reminders: Yes\n"
                    "Medical History Access: Yes\n"
                    "Reports & Test Results: Yes\n"
                    "Emergency SOS: Yes\n"
                    "Supported Devices: Bluetooth-enabled devices (Glucose, BP, SpO2, etc.)\n"
                    "Data Sync: Real-time\n"
                    "Data Security: Encrypted & Secure (HIPAA Compliant)\n"
                    "Notifications: Push Notifications\n"
                    "Multi-user Support: Yes (Family Members)\n"
                    "Languages: Multiple (English & Regional)\n"
                    "Internet Requirement: Wi-Fi / Mobile Data (3G/4G)\n"
                    "App Size: ~80 MB (varies by platform)\n"
                    "Compatibility: Android 8.0+ / iOS 13.0+\n"
                    "Support: In-App Support / Email / Phone"
                ),
                hero_layout="circular_image",
                hero_eyebrow="Our Products",
                hero_title="Digital Healthcare Solutions for a Healthier Tomorrow",
                hero_subtitle="Connected Care. Empowered Patients.",
                hero_badge_1="Trusted Platform",
                hero_badge_2="Patient-Centric",
                hero_badge_3="Better Health Outcomes",
                hero_tagline="Your Health. In Your Hands. Anytime Anywhere",
                is_featured=True,
                highlight_features="Manage Vitals\nBook Appointments\nAccess Medical History",
                highlight_link_label="Care Closer to You",
                website_url="https://www.avtelemed.com",
                download_url="https://www.avtelemed.com/download",
            ),
            dict(
                name="AV TeleMed – For Doctors",
                category=cat_objs["Mobile Applications"],
                product_type="mobile",
                tagline="Consult. Connect. Care.",
                summary="A companion app for clinicians to manage patients, consultations, and records remotely.",
                description=(
                    "AV TeleMed for Doctors empowers healthcare professionals with a secure and easy-to-use "
                    "platform to conduct virtual consultations, manage patients, access medical history, and "
                    "collaborate with care teams. It enhances clinical efficiency, improves patient outcomes, "
                    "and makes quality healthcare more accessible across locations."
                ),
                key_features=(
                    "Secure video consultations\n"
                    "Patient management and medical history access\n"
                    "E-prescriptions and clinical notes\n"
                    "Real-time monitoring and alerts\n"
                    "Seamless communication with patients\n"
                    "Accessible anytime, anywhere"
                ),
                specifications=(
                    "Platform: iOS & Android (Mobile App)\n"
                    "User Type: Licensed Healthcare Professionals\n"
                    "Account Creation: Verified Credential Onboarding\n"
                    "Consultation Scheduling: Yes\n"
                    "Video Consultation: Yes\n"
                    "E-Prescriptions: Yes\n"
                    "Clinical Notes: Yes\n"
                    "Patient Records Access: Yes\n"
                    "Real-time Alerts: Yes\n"
                    "Supported Devices: Smartphones & Tablets\n"
                    "Data Sync: Real-time\n"
                    "Data Security: Encrypted & Secure (HIPAA Compliant)\n"
                    "Notifications: Push Notifications\n"
                    "Multi-facility Support: Yes\n"
                    "Languages: Multiple (English & Regional)\n"
                    "Internet Requirement: Wi-Fi / Mobile Data (3G/4G)\n"
                    "App Size: ~85 MB (varies by platform)\n"
                    "Compatibility: Android 8.0+ / iOS 13.0+\n"
                    "Support: In-App Support / Email / Phone"
                ),
                hero_layout="dashboard_mockup",
                hero_eyebrow="Our Products",
                hero_title="Digital Healthcare Solutions for a Smarter Tomorrow",
                hero_subtitle="Connected. Efficient. Patient-Centric.",
                hero_badge_1="Innovative Solutions",
                hero_badge_2="Trusted Technology",
                hero_badge_3="Better Healthcare",
                hero_tagline="Technology That Connects Care Beyond Boundaries",
                is_featured=True,
                highlight_features="Remote Consultations\nSpecialist Access\nConnected Care Records",
                highlight_link_label="Healthcare Without Boundaries",
                website_url="https://www.avtelemed.com",
                download_url="https://www.avtelemed.com/download",
            ),
            dict(
                name="TehoMed – For Patients",
                category=cat_objs["Mobile Applications"],
                product_type="mobile",
                tagline="Your Health. In Your Hands.",
                summary="A simple and secure mobile app that lets patients manage their healthcare journey with ease.",
                description=(
                    "TehoMed for Patients empowers individuals and families to manage their healthcare journey "
                    "with ease. It connects you with your trusted healthcare providers, allows you to book "
                    "appointments, access medical records, receive medication reminders and stay updated on "
                    "your health — anytime, anywhere. With TehoMed, quality healthcare is just a tap away."
                ),
                key_features=(
                    "Book appointments with healthcare providers\n"
                    "Access your medical history and reports\n"
                    "Get medication reminders\n"
                    "Track your health indicators\n"
                    "Secure and easy-to-use mobile app\n"
                    "Stay connected with your care team\n"
                    "Receive notifications and health tips\n"
                    "Access anytime, anywhere"
                ),
                specifications=(
                    "Platform: iOS & Android (Mobile App)\n"
                    "User Type: Patients & Family Members\n"
                    "Account Creation: Email / Mobile OTP\n"
                    "Appointment Booking: Yes\n"
                    "Medical Records Access: Yes\n"
                    "Medication Reminders: Yes\n"
                    "Health Indicator Tracking: Yes\n"
                    "Care Team Messaging: Yes\n"
                    "Supported Devices: Smartphones\n"
                    "Data Sync: Real-time\n"
                    "Data Security: Encrypted & Secure\n"
                    "Notifications: Push Notifications\n"
                    "Languages: Multiple (English & Regional)\n"
                    "Internet Requirement: Wi-Fi / Mobile Data (3G/4G)\n"
                    "App Size: ~60 MB (varies by platform)\n"
                    "Compatibility: Android 8.0+ / iOS 13.0+\n"
                    "Support: In-App Support / Email / Phone"
                ),
                hero_layout="photo_card",
                hero_eyebrow="Our Products",
                hero_title="Digital Healthcare Solutions for a Healthier Tomorrow",
                hero_subtitle="Connected Care. Empowered Patients.",
                hero_badge_1="Trusted Platform",
                hero_badge_2="Patient-Centric",
                hero_badge_3="Better Health Outcomes",
                hero_tagline="Better Care Closer to You With TehoMed",
                is_featured=True,
                highlight_features="Wide Product Range\nVerified Suppliers\nReliable Procurement",
                highlight_link_label="Right Parts. Reliable Care.",
                website_url="https://www.tehomed.com",
                download_url="https://www.tehomed.com/download",
            ),
            dict(
                name="Thermocheck",
                category=cat_objs["Healthcare Tools"],
                product_type="device",
                tagline="Reliable temperature monitoring for clinical environments.",
                summary="A connected thermometry tool for monitoring cold-chain storage and patient temperature logs.",
                description="Thermocheck pairs a compact hardware sensor with a companion app to keep vaccine and sample storage within safe temperature ranges, with automated alerts.",
                hero_layout="badge_heavy",
                hero_eyebrow="Our Products",
                hero_title="Connected Temperature Monitoring for Critical Storage",
                hero_subtitle="Automated alerts. Continuous logging. Peace of mind for cold-chain compliance.",
                hero_badge_1="Rapid Deployment",
                hero_badge_2="Cold-Chain Ready",
                hero_badge_3="Automated Alerts",
                hero_badge_4="Compact Hardware",
                sidebar_note_title="Need Deployment Guidance?",
                sidebar_note_text="Talk to our team about sensor placement, monitoring coverage, and rollout for your facility.",
                sidebar_note_cta_label="Request a Consultation",
            ),
        ]
        for p in products:
            Product.objects.get_or_create(name=p["name"], defaults=p)

        services = [
            dict(name="Preventive Maintenance", icon="wrench", summary="Scheduled health checks and testing to prevent equipment failure before it happens."),
            dict(name="Corrective Maintenance", icon="wrench", summary="Rapid breakdown response to restore equipment to service quickly."),
            dict(name="Calibration & Safety Testing", icon="check", summary="Electrical safety verifications and precision calibration for clinical equipment."),
            dict(name="Equipment Repairs", icon="monitor", summary="Board and module-level repair for diagnostic and monitoring devices."),
            dict(name="AMC & CMC", icon="file", summary="Long-term maintenance contracts tailored to your facility's equipment fleet."),
            dict(name="Technical Support", icon="clock", summary="24/7 on-call technical support for critical care equipment."),
        ]
        for i, s in enumerate(services):
            Service.objects.get_or_create(name=s["name"], defaults={**s, "order": i, "is_featured": i < 4})

        # -----------------------------------------------------------------
        # Services page tabs (Equipment Installation & Support, AMC &
        # Maintenance, Training, Career) — each a full page with its own
        # hero, feature grid, process timeline, and enquiry form.
        # -----------------------------------------------------------------
        equipment_common = [
            ("heart", "Patient Monitors"),
            ("monitor", "Ventilators"),
            ("chart", "Imaging Systems"),
            ("building", "ICU Equipment"),
            ("bolt", "OT Equipment"),
            ("flask", "Lab Analyzers"),
            ("shield", "Other Medical Devices"),
        ]

        service_pages = [
            dict(
                nav_label="Equipment Installation & Support",
                nav_icon="wrench",
                order=0,
                hero_eyebrow="Our Services",
                hero_title_main="Equipment ",
                hero_title_highlight="Installation & Support",
                hero_subtitle="Seamless setup. Expert support. For uninterrupted healthcare.",
                hero_badge_1_icon="wrench", hero_badge_1_text="Professional Installation",
                hero_badge_2_icon="shield", hero_badge_2_text="Reliable Support",
                hero_badge_3_icon="users", hero_badge_3_text="Experienced Service Team",
                hero_tagline="Your Equipment\nOur Expertise\nA Healthier Tomorrow",
                overview_title="Service Overview",
                overview_subtitle="End-to-end installation and support to keep your medical equipment performing at its best.",
                overview_description=(
                    "We provide professional installation, configuration and ongoing support for a "
                    "wide range of medical equipment. Our expert biomedical engineers ensure smooth "
                    "integration, proper setup and quick issue resolution."
                ),
                process_title="Our Installation Process",
                process_subtitle="A structured approach to ensure safe and efficient installation.",
                equipment_title="Equipment We Support",
                equipment_subtitle="We install and support a wide range of medical equipment, including:",
                cta_icon="headset", cta_title="Need Support?",
                cta_subtitle="Our team is just a call or message away. We're here to help you at every step.",
                form_title="Support & Demo Request",
                form_description="Fill in your details and our team will get back to you shortly.",
                form_type="support_demo",
                features=[
                    ("shield", "Site Assessment & Planning"),
                    ("wrench", "Professional Installation"),
                    ("chart", "Configuration & Testing"),
                    ("heart", "User Guidance & Training"),
                    ("monitor", "On-site Support"),
                    ("users", "Expert Service Team"),
                    ("file", "Service Records & Documentation"),
                    ("headset", "Ongoing Technical Support"),
                ],
                steps=[
                    ("Site Visit", "Assess requirements and site readiness"),
                    ("Planning", "Customize installation plan"),
                    ("Installation", "Professional setup and configuration"),
                    ("Testing", "Verify performance and safety"),
                    ("Handover", "User training and support documentation"),
                ],
                equipment=equipment_common,
            ),
            dict(
                nav_label="AMC & Maintenance",
                nav_icon="file",
                order=1,
                hero_eyebrow="Our Services",
                hero_title_main="AMC & ",
                hero_title_highlight="Maintenance",
                hero_subtitle="Reliable care for your critical equipment. Maximum uptime. Better patient care.",
                hero_badge_1_icon="wrench", hero_badge_1_text="Preventive Maintenance",
                hero_badge_2_icon="clock", hero_badge_2_text="Reduced Downtime",
                hero_badge_3_icon="users", hero_badge_3_text="Expert Service Team",
                overview_title="Why Choose Our AMC?",
                overview_subtitle="Comprehensive maintenance solutions to ensure uninterrupted healthcare operations.",
                overview_description=(
                    "Our AMC services help extend the life of your medical equipment, reduce "
                    "unexpected breakdowns and ensure optimal performance. With our expert engineers "
                    "and proactive maintenance approach, you can focus on what matters most — patient care."
                ),
                process_title="Our AMC Process",
                process_subtitle="A proactive approach to keep your equipment in optimal condition.",
                equipment_title="Equipment We Maintain",
                equipment_subtitle="Comprehensive AMC for a wide range of medical equipment, including:",
                cta_icon="headset", cta_title="Need Assistance?",
                cta_subtitle="Our team is just a call or message away. We're here to help you at every step.",
                form_title="Support & Demo Request",
                form_description="Fill in your details and our team will get back to you shortly.",
                form_type="support_demo",
                features=[
                    ("wrench", "Preventive Maintenance"),
                    ("shield", "Reliable Performance"),
                    ("chart", "Cost Efficiency"),
                    ("headset", "Expert Support"),
                    ("clock", "Minimal Downtime"),
                    ("file", "Genuine Spare Parts"),
                    ("users", "On-site & Remote Support"),
                    ("monitor", "Service Reports"),
                ],
                steps=[
                    ("Agreement", "Tailored AMC plan as per your needs"),
                    ("Preventive Maintenance", "Scheduled servicing and inspections"),
                    ("Issue Resolution", "Quick and efficient support"),
                    ("Performance Check", "Calibration and safety verification"),
                    ("Continuous Support", "Ongoing assistance and reporting"),
                ],
                equipment=equipment_common,
            ),
            dict(
                nav_label="Training",
                nav_icon="users",
                order=2,
                hero_eyebrow="Professional Biomedical Training",
                hero_title_main="Biomedical Equipment ",
                hero_title_highlight="Training",
                hero_subtitle=(
                    "Build practical knowledge and confidence in operating, maintaining, and "
                    "understanding biomedical equipment with structured training from experienced professionals."
                ),
                hero_badge_1_icon="users", hero_badge_1_text="Learn from Experts",
                hero_badge_2_icon="wrench", hero_badge_2_text="Hands-on Training",
                hero_badge_3_icon="users", hero_badge_3_text="Build Skills for a Healthier Tomorrow",
                hero_cta_label="Request Training",
                hero_tagline="Knowledge Today.\nBetter Healthcare Tomorrow.",
                overview_title="Training Programs",
                overview_subtitle="Practical, focused training designed for healthcare teams, biomedical engineers, technicians, and learners.",
                process_title="How Training Works",
                process_subtitle="A simple and structured approach to deliver effective learning.",
                cta_title="Ready to strengthen your biomedical knowledge?",
                cta_subtitle="Partner with MedEx for expert-led training and hands-on learning that makes a real difference in healthcare.",
                cta_button_label="Request Training",
                form_title="Training Enquiry",
                form_description="Fill in your details and our team will get back to you shortly.",
                form_type="training_enquiry",
                features=[
                    ("wrench", "Equipment Operation"),
                    ("shield", "Preventive Maintenance"),
                    ("check", "Calibration & Safety"),
                    ("chart", "Troubleshooting Basics"),
                    ("file", "Biomedical Engineering Fundamentals"),
                    ("users", "Hands-on Learning"),
                ],
                steps=[
                    ("Requirement Discussion", "Understand your team and learning needs."),
                    ("Training Plan", "Define the right topics and approach."),
                    ("Training Delivery", "Conduct structured practical/theory sessions."),
                    ("Practical Learning", "Reinforce understanding through guided learning."),
                    ("Completion & Support", "Share guidance and continue support as needed."),
                ],
                equipment=[],
            ),
            dict(
                nav_label="Career",
                nav_icon="building",
                order=3,
                hero_eyebrow="Our Services",
                hero_title_main="Build Your Career with Med",
                hero_title_highlight="Ex",
                hero_subtitle="Grow your skills. Make a difference. Be a part of a healthier tomorrow.",
                hero_badge_1_icon="chart", hero_badge_1_text="Learn & Grow",
                hero_badge_2_icon="users", hero_badge_2_text="Work with Experts",
                hero_badge_3_icon="heart", hero_badge_3_text="Real Impact in Healthcare",
                hero_badge_4_icon="bolt", hero_badge_4_text="Better Tomorrow",
                overview_eyebrow="Opportunities at MedEx Biomed",
                overview_title="Key Roles & Candidate Requirements",
                overview_subtitle=(
                    "Explore active profiles, typical focus areas, and target qualifications across "
                    "our clinical engineering, tech, and healthcare commercial teams."
                ),
                process_title="How to Apply",
                process_subtitle="A simple process to join our team.",
                secondary_eyebrow="",
                secondary_title="Why Work With Us?",
                secondary_subtitle="At MedEx Biomed, we empower people to grow, learn and contribute to better healthcare.",
                gallery_title="Life at MedEx",
                gallery_subtitle="A workplace where your skills make a real difference.",
                cta_icon="headset", cta_title="Need Assistance?",
                cta_subtitle="Our team is just a call or message away. We're here to help you at every step.",
                form_title="Apply for a Career Opportunity",
                form_description="Fill in your details and our team will get back to you shortly.",
                form_type="career_application",
                features=[
                    dict(
                        icon="wrench", title="Sales & Service Engineer",
                        tag_label="Engineering & Field Ops",
                        focus_text="On-site installation, device calibration, emergency repairs, and technical maintenance at hospitals.",
                        background_text="Degree/Diploma in Biomedical or Electronics Engineering.",
                    ),
                    dict(
                        icon="monitor", title="Android / Software Developer",
                        tag_label="Software & Digital Health",
                        focus_text="Application development for health-tech or tele-medicine platforms.",
                        background_text="Qualification in CS, IT, or Software Engineering.",
                    ),
                    dict(
                        icon="users", title="Healthcare Sales Executive / Manager",
                        tag_label="Business & Commercial",
                        focus_text="Client acquisition, managing hospital procurement relationships, and product demonstrations.",
                        background_text="Healthcare sales experience or business background.",
                    ),
                    dict(
                        icon="users", title="Biomedical Instrumentation Trainer",
                        tag_label="Training & Development",
                        focus_text="Conducting hands-on training for engineers and hospital technicians through the Medex Training Institute.",
                        background_text="Senior experience in medical instrumentation and calibration.",
                    ),
                ],
                steps=[
                    ("Apply", "Send us your resume and area of interest."),
                    ("Screening", "Initial conversation with our team."),
                    ("Interview", "Meet the engineering and leadership team."),
                    ("Offer", "We extend an offer and discuss onboarding."),
                    ("Onboarding", "Start your journey with MedEx."),
                ],
                equipment=[],
                values=[
                    ("users", "Professional Growth", "Continuous learning & career development"),
                    ("wrench", "Work on Advanced Technology", "Exposure to latest medical equipment"),
                    ("heart", "Supportive Work Culture", "Collaborative and inclusive environment"),
                    ("bolt", "Create Real Impact", "Be part of a healthier tomorrow"),
                ],
            ),
        ]

        for sp in service_pages:
            features = sp.pop("features")
            steps = sp.pop("steps")
            equipment = sp.pop("equipment")
            values = sp.pop("values", [])
            page, _ = ServicePage.objects.get_or_create(nav_label=sp["nav_label"], defaults=sp)
            if not page.feature_items.exists():
                for i, f in enumerate(features):
                    if isinstance(f, dict):
                        ServiceFeatureItem.objects.create(service_page=page, order=i, **f)
                    else:
                        icon, title = f
                        ServiceFeatureItem.objects.create(service_page=page, icon=icon, title=title, order=i)
            if not page.process_steps.exists():
                for i, (title, desc) in enumerate(steps):
                    ServiceProcessStep.objects.create(service_page=page, title=title, description=desc, order=i)
            if not page.equipment_items.exists():
                for i, (icon, title) in enumerate(equipment):
                    ServiceEquipmentItem.objects.create(service_page=page, icon=icon, title=title, order=i)
            if not page.value_items.exists():
                for i, (icon, title, desc) in enumerate(values):
                    ServiceValueItem.objects.create(service_page=page, icon=icon, title=title, description=desc, order=i)

        stats = [
            ("Healthcare Facilities Supported", "500+", "building"),
            ("Years of Specialized Experience", "10+", "clock"),
            ("Customer Satisfaction", "99%", "chart"),
            ("Key Hubs (Chennai & Madurai)", "2", "link"),
        ]
        for i, (label, value, icon) in enumerate(stats):
            CompanyStat.objects.get_or_create(
                label=label, defaults={"value": value, "icon": icon, "order": i}
            )

        about = AboutSection.load()
        about.eyebrow = "About MedEx"
        about.title = "Who We Are"
        about.paragraph_1 = (
            "Modern healthcare demands absolute equipment dependability and fluid "
            "digital continuity. MedEx Biomed was built to solve the most critical "
            "challenges facing hospitals, diagnostic centers, and clinics: "
            "<strong>prolonged equipment downtime</strong>, fragmented maintenance, "
            "and <strong>barriers to specialist care</strong>."
        )
        about.paragraph_2 = (
            "We combine hands-on biomedical field expertise with connected digital "
            "health technologies to protect patient safety, ensure regulatory "
            "compliance, and extend equipment operational lifespan."
        )
        about.badge_icon = "shield"
        about.badge_title = "NABH & ISO Compliant"
        about.badge_subtitle = "Audited calibration precision"
        about.save()

        ecosystem_pillars = [
            dict(
                icon="wrench",
                title="Core Biomedical Field Engineering",
                bullets="Preventive & Corrective Maintenance\nBoard-level Repairs\nAMC & CMC Contract Support",
                link_label="Field Verified",
            ),
            dict(
                icon="video",
                title="AV Telemed Remote Care",
                bullets="Specialist Doctor Direct Access\nEncrypted Audio-Video Suite\nDiagnostic Data Real-time Streaming",
                link_label="Connected Telehealth",
            ),
            dict(
                icon="chart",
                title="Hepalpha Diagnostic Innovation",
                bullets="Rapid, Non-invasive Screening\nLiver Health Assessment\nMetabolic Profiling Algorithms",
                link_label="Next-Gen Analytics",
            ),
            dict(
                icon="package",
                title="Tehomed Equipment & Spares",
                bullets="Verified Multi-vendor Access\nReplacement Boards & Modules\nCables, Sensors & Transducers",
                link_label="OEM Grade Spares",
            ),
        ]
        for i, p in enumerate(ecosystem_pillars):
            EcosystemPillar.objects.get_or_create(title=p["title"], defaults={**p, "order": i})

        operating_pillars = [
            dict(
                icon="link",
                title="Ecosystem Synergy",
                description="A single, trusted single-point partner for service, spare supply chain, telehealth infrastructure, and diagnostics.",
            ),
            dict(
                icon="file",
                title="Regulatory Traceability",
                description="Complete digital documentation and verifiable calibration certification prepared for NABH, NABL, and ISO audits.",
            ),
            dict(
                icon="bolt",
                title="Rapid Response SLA",
                description="Fast-track stages and expedited on-site deployment to restore critical equipment and minimize critical downtime.",
            ),
            dict(
                icon="shield",
                title="Clinical Safety",
                description="Rigorous electrical safety checks and performance verifications aligned with international clinical standards.",
            ),
        ]
        for i, p in enumerate(operating_pillars):
            OperatingPillar.objects.get_or_create(title=p["title"], defaults={**p, "order": i})

        vm = VisionMission.load()
        vm.vision_title = "To Be the Premier Clinical Technology & Biomedical Partner"
        vm.vision_text = (
            "To be the premier clinical technology and biomedical engineering partner across "
            "the healthcare continuum—building a future where medical equipment never fails at "
            "critical moments. Ensuring every hospital, physician, and patient experiences total "
            "confidence in the technology that sustains them."
        )
        vm.mission_title = "Fortifying Healthcare Infrastructure & Protecting Patient Lives"
        vm.mission_text = (
            "To fortify healthcare infrastructure, optimize clinical outcomes, and protect "
            "patient lives through a unified ecosystem of precision engineering, transparent "
            "procurement, and decentralized care delivery. We achieve this by:"
        )
        vm.network_panel_title = "Live Asset Network Status"
        vm.network_panel_status_label = "99.98% Active"
        vm.network_panel_quote = "Building a healthcare future where life-support medical technology never fails at critical moments."
        vm.network_benchmark_title = "Zero Equipment Downtime"
        vm.network_benchmark_subtitle = "Guaranteed uptime SLAs for critical care modalities"
        vm.network_benchmark_tag = "Benchmark"
        vm.ecosystem_eyebrow = "Unified Operational Framework"
        vm.ecosystem_title = "The MedEx Biomed Ecosystem"
        vm.ecosystem_subtitle = "Integrated solutions for an uninterrupted continuum"
        vm.ecosystem_core_label = "Central Foundation"
        vm.ecosystem_core_title = "MedEx Biomed Core"
        vm.ecosystem_core_subtitle = "Precision Biomedical Engineering & AMC/CMC Contracts"
        vm.ecosystem_footer_badge_1 = "NABL & NABH Traceable"
        vm.ecosystem_footer_badge_2 = "ISO Standards Aligned"
        vm.save()

        if not vm.highlights.exists():
            vision_highlights = [
                ("Zero-Downtime Guarantee for Critical Care Units", "Rapid triage protocols keeping ICU, OT, and diagnostics active 24/7/365."),
                ("Seamless Supply Chain Eliminating Procurement Bottlenecks", "Transparent access to OEM-verified component boards, transducers, and sensors."),
                ("Decentralized Diagnostics Reaching Peripheral Clinics", "Empowering satellite clinics with teleconsultation and rapid point-of-care liver testing."),
            ]
            for i, (title, desc) in enumerate(vision_highlights):
                VisionHighlight.objects.create(vision_mission=vm, title=title, description=desc, order=i)

        if not vm.status_rows.exists():
            status_rows = [
                ("Intensive Care Ventilators (ICU)", "100% Calibrated"),
                ("Multiparameter Patient Monitors", "Zero Faults"),
                ("Point-of-Care Diagnostic Units", "Connected Telemed"),
            ]
            for i, (label, value) in enumerate(status_rows):
                VisionStatusRow.objects.create(vision_mission=vm, label=label, value=value, order=i)

        if not vm.mission_pillars.exists():
            mission_pillars = [
                ("Securing Clinical Uptime", "Delivering rapid-response biomedical field engineering, rigorous electrical safety testing, and lifecycle AMC/CMC asset management that maximize equipment longevity, satisfy accreditation benchmarks, and ensure life-support devices perform flawlessly when needed most."),
                ("Transforming Healthcare Supply Chains", "Leveraging Tehomed to dismantle procurement delays, giving healthcare institutions verified, transparent access to certified medical equipment, genuine component-level spare parts, and specialized biomedical accessories without compromise."),
                ("Bridging the Clinical Distance", "Deploying AV Telemed virtual care networks that integrate real-time diagnostic telemetry with high-definition audio-visual consultation, empowering primary clinics and rural centers to access tertiary specialist care."),
                ("Elevating Frontline Diagnostics", "Driving early disease interception through the Hepalpha diagnostic framework, equipping practitioners with non-invasive, rapid screening technologies that detect metabolic and organ risks early enough to alter clinical trajectories."),
                ("Championing Ethical Engineering", "Upholding uncompromising standards of transparency, metrological integrity, and technical stewardship, ensuring every hospital, physician, and patient experiences total confidence in the technology that sustains them."),
            ]
            for i, (title, desc) in enumerate(mission_pillars):
                MissionPillar.objects.create(vision_mission=vm, title=title, description=desc, order=i)

        leader, _ = TeamMember.objects.get_or_create(
            name="Veeramano Murugan",
            defaults=dict(
                role="Founder & Managing Director, Medex Biomed",
                title="D.ECE., B.E.",
                quote=(
                    "A medical device in an ICU or clinic is directly tied to patient survival. Our "
                    "commitment is to eliminate downtime, make high-quality parts accessible, and "
                    "connect frontline doctors with the diagnostic tools and specialist expertise they need."
                ),
                quote_label="Leadership Philosophy",
                badge_text="Technical Leader",
                years_text="10+ Years Biomedical Leadership",
                prior_leadership="Regional Manager, Colmed (8 yrs)",
                domain_expertise="Critical Care & Device Governance",
                operational_base="Chennai & South India Networks",
                bio=(
                    "Veeramano Murugan is a biomedical technology specialist, engineering leader, and "
                    "healthcare entrepreneur with over a decade of hands-on expertise across medical "
                    "instrumentation, hospital asset reliability, and clinical operations. He holds a "
                    "Bachelor of Engineering (B.E.) in Biomedical Engineering backed by a foundational "
                    "Diploma in Electronics and Communication Engineering (D.ECE)—a technical pedigree "
                    "that bridges board-level electronics troubleshooting with rigorous medical device "
                    "lifecycle governance.\n\n"
                    "Prior to establishing Medex Biomed, Veeramano accumulated over ten years of industry "
                    "leadership, notably serving for nearly eight years as Regional Sales and Service "
                    "Manager at Collateral Medical (Colmed). In this capacity, he directed regional "
                    "engineering teams, oversaw critical care and diagnostic installations, and led "
                    "clinical service delivery across healthcare networks in South India. His extensive "
                    "front-line experience in operation theaters, intensive care units, and diagnostic "
                    "laboratories provided direct insight into the systemic challenges hospitals face: "
                    "frequent equipment downtime, delayed technical support, and opaque spare-part "
                    "procurement.\n\n"
                    "Establishment of Medex Biomed (Est. 2026): Drawing on ten-plus years of specialized "
                    "field and managerial experience, Veeramano founded Medex Biomed in 2026 to build an "
                    "integrated, zero-downtime clinical service infrastructure. Under his leadership, the "
                    "organization has expanded beyond conventional maintenance into a comprehensive "
                    "healthcare technology ecosystem."
                ),
                is_leadership=True,
                order=0,
            ),
        )

        settings_obj = SiteSettings.load()
        settings_obj.site_name = "MedEx"
        settings_obj.footer_tagline = (
            "Precision biomedical engineering. Connected healthcare. Better tomorrows."
        )
        settings_obj.address = "Chennai | Madurai | Others"
        settings_obj.phone = "+91 93037 06371"
        settings_obj.whatsapp_number = "919303706371"
        settings_obj.email = "support@medexbiomed.com"
        settings_obj.business_hours = "Mon–Sat, 9:00am – 7:00pm"
        settings_obj.save()

        page_intros = [
            dict(
                page="about",
                eyebrow="About Us",
                title="People Behind ",
                title_highlight="Reliable Healthcare",
                description=(
                    "At MedEx Biomed, we are committed to keeping healthcare technology running "
                    "— so that healthcare providers can focus on what matters most: patient care."
                ),
            ),
            dict(
                page="services",
                eyebrow="Services",
                title="Support built around your equipment and software",
                description=(
                    "From preventive maintenance to custom digital health platforms, MedEx covers "
                    "the full lifecycle of clinical technology."
                ),
                cta_title="Need a service not listed here?",
                cta_text="Tell us what your facility needs and we'll scope it together.",
            ),
            dict(
                page="contact",
                eyebrow="Contact Us",
                title="Let's Keep Healthcare Technology Running",
                description=(
                    "Tell us what you need serviced, calibrated or installed — our expert "
                    "biomedical team will get back to you fast."
                ),
            ),
        ]
        for p in page_intros:
            PageIntro.objects.get_or_create(page=p["page"], defaults=p)

        about_page = AboutPageContent.load()
        about_page.hero_badge_title = "Technology In Safe Hands"
        about_page.hero_highlight_value = "10y+"
        about_page.hero_highlight_label = "Operational Precision Standards"
        about_page.hero_status_text = "Emergency Clinical Support Available"
        about_page.story_eyebrow = "Our Story"
        about_page.story_title = "A Stronger Tomorrow Through Better Healthcare"
        about_page.story_paragraph_1 = (
            "Modern healthcare demands absolute equipment dependability and fluid digital "
            "continuity. Medex Biomed was built to solve the most critical challenges facing "
            "hospitals, diagnostic centers, and clinics: prolonged equipment downtime, "
            "fragmented maintenance, and barriers to specialist care."
        )
        about_page.story_paragraph_2 = (
            "We combine hands-on biomedical field expertise with connected digital health "
            "technologies. Whether maintaining critical life-support assets in an ICU or "
            "deploying remote diagnostic screening in satellite clinics, our integrated "
            "approach protects patient safety, ensures regulatory compliance, and extends "
            "equipment operational lifespan."
        )
        about_page.story_quote = (
            "With years of experience in biomedical engineering, our team is driven by a "
            "passion for quality, safety, and long-term partnerships with healthcare institutions."
        )
        about_page.story_image_badge = "Medex Biomed Headquarters"
        about_page.story_caption_eyebrow = "Proven Excellence"
        about_page.story_caption_text = "Trusted by Healthcare Providers Across the Region"
        about_page.leadership_eyebrow = "About Director & Founder"
        about_page.leadership_title = "Leadership Driving Medical Excellence"
        about_page.why_choose_eyebrow = "Why Choose Us"
        about_page.why_choose_title_main = "More Than Service, "
        about_page.why_choose_title_highlight = "A Long-Term Partnership"
        about_page.why_choose_description = (
            "We don't just service equipment — we build lasting relationships. Our team of "
            "skilled professionals ensures that your medical equipment performs at its best, always."
        )
        about_page.save()

        if not about_page.why_choose_items.exists():
            why_choose_items = [
                ("wrench", "Expert Engineers", "Board-level diagnostics & multi-modality training."),
                ("clock", "Reliable Support", "Fast-track response for critical ventilators & ICUs."),
                ("users", "Customer Centric", "Flexible AMC / CMC contracts tailored to budgets."),
                ("link", "Multi-Brand Field", "Independent servicing of all leading global OEMs."),
                ("file", "Compliant & Quality", "NABH, NABL audit certificates provided digitally."),
                ("chart", "Better Outcomes", "Zero downtime directly improving patient survival."),
            ]
            for i, (icon, title, desc) in enumerate(why_choose_items):
                WhyChooseUsItem.objects.create(about_page_content=about_page, icon=icon, title=title, description=desc, order=i)

        locations = [
            dict(
                name="Head Office — Chennai",
                address=(
                    "No.134/2 C, Gandhi Road, Srinivasa Nagar Post, Alapakkam, "
                    "near Perungalathur, Chennai - 600 063"
                ),
            ),
            dict(
                name="Branch — Madurai",
                address="Vadipatti, Madurai, Tamil Nadu, India",
            ),
        ]
        for i, loc in enumerate(locations):
            OfficeLocation.objects.get_or_create(name=loc["name"], defaults={**loc, "order": i})

        contact_page = ContactPageContent.load()
        contact_page.form_title = "Send Us an Enquiry"
        contact_page.form_description = "Fill in the details and our team will get back to you shortly."
        contact_page.details_eyebrow = "Support & Reach"
        contact_page.details_title = "Our Contact Details"
        contact_page.details_subtitle = "Reach out to us."
        contact_page.highlights_intro = "We're always here to support your healthcare technology needs."
        contact_page.map_eyebrow = "Location"
        contact_page.map_title = "Find Us on Map"
        contact_page.map_description = "Get directions to our Head Office in Chennai or our Branch in Madurai."
        contact_page.save()

        if not contact_page.highlights.exists():
            for i, text in enumerate(["Quick Response", "Expert Support", "Reliable Partnership"]):
                ContactHighlight.objects.create(contact_page_content=contact_page, text=text, order=i)

        self.stdout.write(self.style.SUCCESS("Seeded demo data for MedEX."))