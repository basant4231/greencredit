import React from 'react';
import Link from 'next/link';
import { Leaf, Mail, MapPin, Github, Linkedin, Twitter, Globe, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400 pt-24 pb-12 border-t border-zinc-900 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 transition-colors duration-500">
                <Leaf className="text-emerald-500 group-hover:text-black w-6 h-6 transition-colors duration-500" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">
                Eco<span className="text-emerald-500">Credit</span>
              </span>
            </Link>
            <p className="text-base leading-relaxed text-zinc-500 max-w-sm mb-8">
              Empowering individuals and organizations to monetize their environmental impact through verified green credits and transparent carbon trading.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                  <Icon size={20} className="text-zinc-500 group-hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Marketplace', href: '/marketplace' },
                { name: 'My Credits', href: '/my-credits' },
                { name: 'Analytics', href: '/analytics' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-1 hover:text-emerald-400 transition-colors">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Documentation', 'Whitepaper', 'API Status', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Contact</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 bg-zinc-900 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                  <Mail size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Email us at</p>
                  <span className="text-zinc-300 font-medium">support@ecocredit.com</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 bg-zinc-900 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                  <MapPin size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Global HQ</p>
                  <span className="text-zinc-300 font-medium leading-relaxed">Jewar, Uttar Pradesh,<br />India 203209</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-zinc-600">
          <div className="flex items-center gap-4">
            <p>&copy; 2026 EcoCredit Management. All rights reserved.</p>
            <span className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="flex items-center gap-1">
              <Globe size={12} />
              <span>English (US)</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800">
            Developed by <span className="text-emerald-500 px-1 font-bold italic">Basant Sharma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
