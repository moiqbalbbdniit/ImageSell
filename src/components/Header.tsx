"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-1">
          <Link
            href="/"
            className="group flex items-center gap-2 w-fit transition-opacity hover:opacity-80"
            prefetch={true}
            onClick={() => showNotification("Welcome to ImageKit Shop", "info")}
          >
            <div className="bg-zinc-900 text-white p-2 rounded-xl shadow-lg shadow-zinc-900/20 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">
              Iqbal Shop
            </span>
          </Link>
        </div>

        {/* Right Actions Section */}
        <div className="flex-none gap-4">
          {!session ? (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95"
              onClick={() =>
                showNotification("Please sign in to continue", "info")
              }
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-600">
                  <User className="w-5 h-5" />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white rounded-xl w-64 border border-zinc-100 ring-1 ring-black/5"
              >
                {/* User Header */}
                <li className="px-3 py-2 pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Signed in as
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 truncate block -mt-1">
                    {session.user?.email}
                  </span>
                </li>

                <div className="h-px bg-zinc-100 my-2 mx-2"></div>

                {/* Admin Link */}
                {session.user?.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 rounded-md hover:bg-zinc-50 hover:text-zinc-900"
                      onClick={() => showNotification("Welcome Admin", "info")}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {/* User Links */}
                <li>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 rounded-md hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    <Package className="w-4 h-4 text-emerald-600" />
                    My Orders
                  </Link>
                </li>

                <div className="h-px bg-zinc-100 my-2 mx-2"></div>

                {/* Sign Out */}
                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}