"use client";
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useSession, signOut } from "next-auth/react"; // Added signOut for the profile menu
import { Menu, X, LeafyGreen, User as UserIcon, LogOut } from 'lucide-react';
import Image from 'next/image'; // 1. Add this import at the top of Navbar.tsx
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to toggle profile dropdown
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const isEntryPage = pathname === '/signup' || pathname === '/login';

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'My Credits', href: '/my-credits' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 transition-colors duration-500">
              <LeafyGreen className="text-emerald-500 group-hover:text-black w-6 h-6 transition-colors duration-500" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Eco<span className="text-emerald-500">Credit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                  pathname === link.href ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* CONDITIONAL AUTH SECTION */}
            {status !== "loading" && (
              <div className="flex items-center gap-6 border-l border-zinc-800 pl-10">
                {session ? (
                  /* 1. PROFILE BUTTON (Logged In) */
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300"
                    >
                     <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black overflow-hidden relative">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                      <span className="text-sm font-bold text-white">
                        {session.user?.name?.split(' ')[0] || "User"}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-2 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-zinc-800 mb-2">
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Account</p>
                           <p className="text-sm font-bold text-white truncate">{session.user?.email}</p>
                        </div>
                        <button 
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 2. GET STARTED BUTTON (Logged Out & Not on Signin/Signup) */
                  !isEntryPage && (
                    <Link href="/signup">
                      <button className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
                        Get Started
                      </button>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-zinc-900 rounded-xl border border-zinc-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-900 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-6">
            {session && (
             <div className="flex items-center gap-4 pb-6 mb-6 border-b border-zinc-900">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black overflow-hidden relative">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon size={24} />
                )}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{session.user?.name}</p>
                <p className="text-xs font-medium text-zinc-500">{session.user?.email}</p>
              </div>
            </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-lg font-bold text-zinc-400 hover:text-emerald-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-zinc-900">
              {session ? (
                <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-400 rounded-2xl font-bold transition-colors">
                  <LogOut size={20} /> Sign Out
                </button>
              ) : (
                !isEntryPage && (
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/10">Sign Up</button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
