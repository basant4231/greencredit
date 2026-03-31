import Link from "next/link";
import { Leaf, Mail, MapPin } from "lucide-react";
import { footerQuickLinks, marketingNavLinks } from "@/lib/siteNavigation";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-slate-900 bg-slate-950 pb-8 pt-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-[1.35fr_1fr_1fr]">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-600 p-1.5">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Eco<span className="text-emerald-500">Credit</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Empowering individuals to monetize their environmental impact through verified green credits and transparent carbon trading.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Navigate</h4>
            <ul className="space-y-4 text-sm">
              {marketingNavLinks.map((link) => (
                <li key={link.sectionId}>
                  <Link href={`/#${link.sectionId}`} className="transition-colors hover:text-emerald-400">
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-emerald-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Contact</h4>
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
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs font-medium text-slate-500 md:flex-row">
          <p>&copy; 2026 EcoCredit Management System. All rights reserved.</p>
          <p>
            Designed & Developed by <span className="font-bold text-emerald-500">Basant Sharma</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
