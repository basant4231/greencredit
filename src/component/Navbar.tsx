"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { oswald } from "@/lib/fonts";
import { marketingNavLinks } from "@/lib/siteNavigation";
import styles from "@/styles/marketing/Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === "/";
  const isEntryPage = pathname === "/signup" || pathname === "/login";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const authHref = session ? "/dashboard" : "/signup";
  const authLabel = session ? "Dashboard" : "Get Started";
  const getSectionHref = (sectionId: string) => (isHomePage ? `#${sectionId}` : `/#${sectionId}`);

  return (
    <nav className={`z-50 w-full ${styles.homeNav} ${isScrolled ? styles.homeNavScrolled : ""}`}>
      <div className={styles.homeInner}>
        <Link href="/" className={`${oswald.className} ${styles.homeBrand}`}>
          <span className={styles.brandText}>
            Eco <span className={styles.brandTextAccent}>Credit</span>
          </span>
        </Link>

        <div className={styles.homeDesktop}>
          <ul className={styles.homeLinks}>
            {marketingNavLinks.map((link, index) => (
              <li key={link.sectionId}>
                <Link
                  href={getSectionHref(link.sectionId)}
                  className={`${oswald.className} ${styles.homeLink} ${
                    isHomePage && index === 0 ? styles.homeLinkActive : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {!isEntryPage && status !== "loading" && (
            <>
              {session ? (
                <div ref={profileRef} className={styles.homeProfileWrap}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((current) => !current)}
                    className={styles.homeProfileButton}
                    aria-expanded={isProfileOpen}
                    aria-label="Open account menu"
                  >
                    <div className={styles.homeAvatar}>
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>
                    <span className={styles.homeProfileName}>
                      {session.user?.name?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className={styles.homeDropdown}>
                      <div className={styles.homeDropdownHeader}>
                        <p className={styles.homeDropdownLabel}>Account</p>
                        <p className={styles.homeDropdownEmail}>{session.user?.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={styles.homeDropdownAction}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href={authHref} className={`${oswald.className} ${styles.homeButton}`}>
                  {authLabel}
                </Link>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className={styles.homeMenuButton}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.homeMobilePanel}>
          <div className={styles.homeMobileInner}>
            {session && (
              <div className={styles.homeMobileSession}>
                <div className={styles.homeAvatar}>
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
                  <p className={styles.homeMobileName}>{session.user?.name}</p>
                  <p className={styles.homeMobileEmail}>{session.user?.email}</p>
                </div>
              </div>
            )}

            <div className={styles.homeMobileLinks}>
              {marketingNavLinks.map((link) => (
                <Link
                  key={link.sectionId}
                  href={getSectionHref(link.sectionId)}
                  className={`${oswald.className} ${styles.homeMobileLink}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {session ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`${oswald.className} ${styles.homeMobileLogout}`}
              >
                Sign Out
              </button>
            ) : (
              !isEntryPage && (
                <Link
                  href={authHref}
                  onClick={() => setIsOpen(false)}
                  className={`${oswald.className} ${styles.homeButton} ${styles.homeMobileButton}`}
                >
                  {authLabel}
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
