import { ArrowRight, CheckCircle2, ShieldCheck, Train, TreeDeciduous, UploadCloud } from "lucide-react";
import ActivityCard from "@/component/dashboard/ActivityCard";
import { robotoSlab } from "@/lib/fonts";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
        <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#0f172a_0%,#104936_42%,#0f9f67_100%)] p-8 text-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.82)]">
          <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-200">
              Activity Studio
            </p>
            <h1 className={`${robotoSlab.className} mt-4 text-4xl leading-tight md:text-[2.8rem]`}>
              Choose your next green action.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/82">
              This page now follows the same admin-template direction as your main dashboard, while keeping the GreenCredit verification flow simple and focused.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#activity-cards"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
              >
                Explore activities
                <ArrowRight size={16} />
              </a>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-emerald-50/85">
                Submit clear proof to speed up approval.
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Capture</p>
                <p className="mt-2 text-sm text-white/85">Use a sharp ticket or proof image when required.</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Verify</p>
                <p className="mt-2 text-sm text-white/85">Location and activity type are checked in the flow.</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Earn</p>
                <p className="mt-2 text-sm text-white/85">Approved actions return credits back to your dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-surface rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.42)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-600">
            Verification Steps
          </p>
          <h2 className="dashboard-text-primary mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            How to keep approvals smooth
          </h2>

          <div className="mt-6 space-y-4">
            <div className="dashboard-surface-alt flex items-start gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                <UploadCloud size={18} />
              </div>
              <div>
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">1. Add proof when needed</p>
                <p className="dashboard-text-secondary mt-1 text-sm leading-6 text-slate-500">
                  Metro rides work best with a clear ticket photo.
                </p>
              </div>
            </div>
            <div className="dashboard-surface-alt flex items-start gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">2. Confirm your live context</p>
                <p className="dashboard-text-secondary mt-1 text-sm leading-6 text-slate-500">
                  Location permission helps the verifier confirm the activity is genuine.
                </p>
              </div>
            </div>
            <div className="dashboard-surface-alt flex items-start gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">3. Track it on the dashboard</p>
                <p className="dashboard-text-secondary mt-1 text-sm leading-6 text-slate-500">
                  Once approved, your stats and recent activity cards update automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="activity-cards" className="space-y-6">
        <ActivityCard
          type="Metro"
          title="Taking the Metro"
          icon={<Train size={24} />}
          description="From the first tracks laid in Delhi's expanding suburbs to the bustling, tech-powered networks now weaving over 20 Indian cities, the metro is a symbol of urban awakening. Choosing the metro reduces city congestion and reshapes our skylines into cleaner environments."
          image="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&q=80&w=800"
          accentColor="bg-rose-50"
          borderColor="border-rose-100"
          buttonColor="bg-rose-500 hover:bg-rose-600"
        />

        <ActivityCard
          type="Planting"
          title="Home Plantation"
          icon={<TreeDeciduous size={24} />}
          description="Transform your living space into a micro-oxygen hub. Maintaining a small plantation area helps in natural air purification and significantly increases local biodiversity. It's a lifeline pulsing through the heart of your home, contributing daily to the global ecosystem."
          image="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800"
          accentColor="bg-emerald-50"
          borderColor="border-emerald-100"
          buttonColor="bg-emerald-600 hover:bg-emerald-700"
        />
      </div>
    </div>
  );
}
