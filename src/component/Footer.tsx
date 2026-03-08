import React from 'react';
import Link from 'next/link';
import { Leaf, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Eco<span className="text-emerald-500">Credit</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering individuals to monetize their environmental impact through verified green credits and transparent carbon trading.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/my-credits" className="hover:text-emerald-400 transition-colors">My Credits</Link></li>
              <li><Link href="/analytics" className="hover:text-emerald-400 transition-colors">Impact Analytics</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-emerald-500" />
                <span>support@ecocredit.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-emerald-500" />
                <span>Jewar, Uttar Pradesh</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-600 transition-all">
                <Github size={20} className="text-white" />
              </Link>
              <Link href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-600 transition-all">
                <Linkedin size={20} className="text-white" />
              </Link>
              <Link href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-600 transition-all">
                <Twitter size={20} className="text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 EcoCredit Management System. All rights reserved.</p>
          <p>
            Designed & Developed by <span className="text-emerald-500 font-bold">Basant Sharma</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;