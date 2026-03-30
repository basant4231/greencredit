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
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2" aria-label="EcoCredit Home">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <LeafyGreen className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-emerald-900 tracking-tight">
              Eco<span className="text-emerald-600">Credit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* CONDITIONAL AUTH SECTION */}
            {status !== "loading" && (
              <>
                {session ? (
                  /* 1. PROFILE BUTTON (Logged In) */
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full border border-emerald-100 hover:bg-emerald-50 transition-all"
                      aria-label="Open user menu"
                      aria-haspopup="true"
                      aria-expanded={isProfileOpen}
                    >
                     <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white overflow-hidden relative">
  {session.user?.image ? (
    <Image 
      src={session.user.image} 
      alt="Profile" 
      fill // 2. Fill the parent container
      className="object-cover"
      referrerPolicy="no-referrer" // 3. Required for Google profile images
    />
  ) : (
    <UserIcon size={18} />
  )}
</div>
                      <span className="text-sm font-semibold text-emerald-900">
                        {session.user?.name?.split(' ')[0] || "User"}
                      </span>
                    </button>

                    {/* Simple Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-emerald-50 py-2 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                           <p className="text-xs text-slate-400 font-medium">Account</p>
                           <p className="text-sm font-bold text-slate-900 truncate">{session.user?.email}</p>
                        </div>
                        <button 
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 2. GET STARTED BUTTON (Logged Out & Not on Signin/Signup) */
                  !isEntryPage && (
                    <Link href="/signup">
                      <button className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-md">
                        Get Started
                      </button>
                    </Link>
                  )
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-900"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-emerald-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-2">
            {session && (
             <div className="flex items-center gap-3 pb-4 mb-2 border-b border-emerald-50">
  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white overflow-hidden relative">
    {session.user?.image ? (
      <Image 
        src={session.user.image} 
        alt={session.user.name || "User"} 
        fill 
        className="rounded-full object-cover"
        referrerPolicy="no-referrer" 
      />
    ) : (
      <UserIcon />
    )}
  </div>
  <div>
    <p className="font-bold text-emerald-900">{session.user?.name}</p>
    <p className="text-xs text-slate-500">{session.user?.email}</p>
  </div>
</div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-slate-700 hover:bg-emerald-50 rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-red-600 font-bold">Sign Out</button>
            ) : (
              !isEntryPage && (
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full mt-2 bg-emerald-600 text-white py-3 rounded-xl font-bold">Sign Up</button>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
