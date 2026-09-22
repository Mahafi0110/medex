import type { VisionMission, TeamMember } from "@/types";
import Icon from "@/components/Icon";

interface Props {
  visionMission: VisionMission | null;
  leader: TeamMember | null;
}

export default function PhilosophyLeadershipSection({ visionMission, leader }: Props) {
  if (!visionMission && !leader) return null;

  return (
    <section className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Vision & Mission (Text & Cards Only) */}
        {visionMission && (
          <div>
            <p className="section-eyebrow mb-3">— Core Philosophy</p>
            <h2 className="text-2xl font-bold text-blue-dark md:text-3xl">Vision & Mission</h2>

            <div className="mt-6 space-y-4">
              {/* Vision Card */}
              <div className="card border border-pink-accent/30 bg-pink-light p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-red">
                    <Icon name="eye" className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-blue-dark">{visionMission.vision_title || "Our Vision"}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{visionMission.vision_text}</p>
              </div>

              {/* Mission Card */}
              <div className="card bg-blue-light p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-blue">
                    <Icon name="bolt" className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-blue-dark">{visionMission.mission_title || "Our Mission"}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">{visionMission.mission_text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Executive Guidance / Our Leadership (With Profile Image Card) */}
        {leader && (
          <div>
            <p className="section-eyebrow mb-3">— Executive Guidance</p>
            <h2 className="text-2xl font-bold text-blue-dark md:text-3xl">Our Leadership</h2>

            <div className="card mt-6 p-6 bg-white shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-4">
                {/* Rounded Square Profile Picture Container */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200">
                  <img 
                    src={leader.photo || "/images/leadership/leader-portrait.png"} 
                    alt={leader.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-blue-dark text-lg">{leader.name}</h3>
                  {leader.title && <p className="text-xs text-red font-medium mt-0.5">{leader.title}</p>}
                  <p className="text-xs text-slate-500 mt-0.5">{leader.role}</p>
                </div>
              </div>

              {leader.quote && (
                <blockquote className="mt-6 rounded-xl bg-slate-50 border-l-2 border-red p-4 text-sm italic text-slate-700">
                  "{leader.quote}"
                  <footer className="mt-1.5 text-xs not-italic text-slate-400 font-medium">— MedEx Biomed</footer>
                </blockquote>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                {leader.years_text && <span className="text-slate-500">{leader.years_text}</span>}
                {leader.badge_text && <span className="text-red">{leader.badge_text}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}