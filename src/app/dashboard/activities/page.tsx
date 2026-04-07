import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Train,
  TreeDeciduous,
  UploadCloud,
} from "lucide-react";
import ActivityCard from "@/component/dashboard/ActivityCard";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
        <div className="dashboard-surface rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.25)] md:p-8">
          <div className="flex h-full flex-col">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="dashboard-text-secondary flex items-center gap-2 text-sm text-gray-500">
                  <Sparkles size={14} className="text-[#465FFF]" />
                  Activity Studio
                </div>
                <h1 className="dashboard-text-primary mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-[3.05rem] sm:leading-[1.06]">
                  Choose your next green action.
                </h1>
                <p className="dashboard-text-secondary mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                  Submit verified activities, follow the approval steps, and turn everyday sustainable choices into Eco Credit rewards.
                </p>
              </div>

              <a
                href="#activity-cards"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#465FFF] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#3649d9]"
              >
                Explore activities
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Capture</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Use a sharp ticket or proof image when required.
                </p>
              </div>
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Verify</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Location and activity type are checked in the flow.
                </p>
              </div>
              <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#465FFF]">Earn</p>
                <p className="dashboard-text-primary mt-3 text-sm leading-7 text-gray-700">
                  Approved actions return credits back to your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-surface-alt rounded-2xl border border-gray-200 bg-gray-100 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]">
          <div className="dashboard-surface rounded-2xl bg-white px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#465FFF]">
              Verification Steps
            </p>
            <h2 className="dashboard-text-primary mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              How to keep approvals smooth
            </h2>
            <p className="dashboard-text-secondary mt-2 text-sm leading-6 text-slate-500">
              Keep the proof, location, and submission flow tidy so approvals stay fast and consistent.
            </p>
          </div>

          <div className="mt-5 space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="dashboard-surface flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <UploadCloud size={18} />
              </div>
              <div>
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">1. Add proof when needed</p>
                <p className="dashboard-text-secondary mt-1 text-sm leading-6 text-slate-500">
                  Metro rides work best with a clear ticket photo.
                </p>
              </div>
            </div>
            <div className="dashboard-surface flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">2. Confirm your live context</p>
                <p className="dashboard-text-secondary mt-1 text-sm leading-6 text-slate-500">
                  Location permission helps the verifier confirm the activity is genuine.
                </p>
              </div>
            </div>
            <div className="dashboard-surface flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
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
