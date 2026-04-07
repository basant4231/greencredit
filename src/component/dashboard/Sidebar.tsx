"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, LayoutDashboard, Leaf, LogOut, MoreHorizontal, TreePine, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  mobileOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Activity Studio",
    href: "/dashboard/activities",
    icon: FilePlus2,
  },
  {
    name: "Buy Tree",
    href: "/dashboard/buy-tree",
    icon: TreePine,
  },
];

export default function Sidebar({ mobileOpen, isCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname();
  const showExpanded = mobileOpen || !isCollapsed;

  return (
    <aside
      className={`dashboard-sidebar-surface fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white px-5 transition-all duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${showExpanded ? "w-[290px]" : "w-[90px]"} lg:translate-x-0`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className={`flex items-center py-8 ${showExpanded ? "justify-between" : "justify-center"}`}>
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#465FFF] text-white">
              <Leaf size={20} />
            </span>

            {showExpanded && (
              <span>
                <span className="dashboard-text-primary block text-lg font-semibold tracking-tight text-gray-900">Eco Credit</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.26em] text-[#465FFF]">
                  Impact Dashboard
                </span>
              </span>
            )}
          </Link>

          {mobileOpen && (
            <button
              type="button"
              onClick={onClose}
              className="dashboard-outline-btn flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <nav className="space-y-6">
            <div>
              <div
                className={`mb-4 flex text-xs font-medium uppercase tracking-[0.18em] text-gray-400 ${
                  showExpanded ? "justify-start" : "justify-center"
                }`}
              >
                {showExpanded ? <span className="dashboard-text-secondary">Menu</span> : <MoreHorizontal size={16} className="dashboard-text-secondary" />}
              </div>

              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#ECF3FF] text-[#465FFF]"
                          : "dashboard-nav-item text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      } ${showExpanded ? "justify-start" : "justify-center"}`}
                    >
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-xl ${
                          isActive
                            ? "bg-[#DCE7FF] text-[#465FFF]"
                            : "dashboard-nav-icon bg-gray-100 text-gray-500 group-hover:text-gray-700"
                        }`}
                      >
                        <item.icon size={18} />
                      </span>

                      {showExpanded && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        <div className="dashboard-divider border-t border-gray-200 py-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`dashboard-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 ${
              showExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <span className="dashboard-nav-icon grid h-10 w-10 place-items-center rounded-xl bg-gray-100 text-gray-500">
              <LogOut size={18} />
            </span>
            {showExpanded && "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
