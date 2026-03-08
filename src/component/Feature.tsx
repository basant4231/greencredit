import React from 'react';
import { UserPlus, ClipboardCheck, Wallet, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Register Impact",
    description: "Create your profile and log sustainable activities like solar installation, tree planting, or waste reduction.",
    icon: <UserPlus className="w-10 h-10 text-emerald-400" />,
    color: "bg-emerald-900/30 text-emerald-400"
  },
  {
    id: "02",
    title: "Expert Verification",
    description: "Our system uses IoT data and expert review to verify your environmental impact against global standards.",
    icon: <ClipboardCheck className="w-10 h-10 text-lime-400" />,
    color: "bg-lime-900/30 text-lime-400"
  },
  {
    id: "03",
    title: "Receive Credits",
    description: "Once verified, certified Green Credits are issued to your digital wallet, ready to be traded or held.",
    icon: <Wallet className="w-10 h-10 text-cyan-400" />,
    color: "bg-cyan-900/30 text-cyan-400"
  }
];

const Features = () => {
  return (
    // Changed background to dark slate
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-3">
              Process Flow
            </h2>
            <h3 className="text-4xl font-extrabold text-white leading-tight">
              A Transparent Path to <br />
              <span className="text-emerald-400">Environmental Value</span>
            </h3>
          </div>
          <p className="text-slate-400 max-w-sm text-lg">
            We bridge the gap between individual green actions and the global carbon market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative connecting lines - made darker and more subtle */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-700 -z-0" />

          {steps.map((step) => (
            <div 
              key={step.id} 
              // Dark card background, lighter border, dark-themed shadow on hover
              className="relative z-10 p-10 bg-slate-800 border border-slate-700 rounded-3xl hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`${step.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                  {step.icon}
                </div>
                {/* Number is now dark grey, turning lighter on hover */}
                <span className="text-5xl font-black text-slate-700 group-hover:text-slate-600 transition-colors select-none">
                  {step.id}
                </span>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-4">
                {step.title}
              </h4>
              <p className="text-slate-300 leading-relaxed mb-6">
                {step.description}
              </p>

              <button className="flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA for Section - Made slightly lighter to pop from the background */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
           <div className="text-white text-center md:text-left">
              <p className="text-xl font-bold mb-1">Ready to start your first project?</p>
              <p className="text-emerald-200/70">Join 5,000+ eco-enthusiasts making a difference.</p>
           </div>
           <button className="bg-lime-400 hover:bg-lime-500 text-black px-8 py-4 rounded-xl font-black transition-colors whitespace-nowrap shadow-lg shadow-lime-900/20">
              Create Account
           </button>
        </div>
      </div>
    </section>
  );
};

export default Features;