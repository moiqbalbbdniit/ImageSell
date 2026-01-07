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
  ChevronDown 
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
    <header className="sticky top-0 z-50 w-full border-b border-base-200 bg-base-100/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="navbar min-h-[4rem] px-0">
          
          {/* Logo Section */}
          <div className="flex-1">
            <Link
              href="/"
              className="btn btn-ghost text-xl font-black tracking-tighter gap-2 px-2 hover:bg-transparent hover:text-primary transition-colors"
              prefetch={true}
              onClick={() => showNotification("Welcome to ImageKit Shop", "info")}
            >
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Home className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
                Iqbal Shop
              </span>
            </Link>
          </div>

          {/* Right Actions Section */}
          <div className="flex-none gap-2">
            {!session ? (
              // Not Logged In: Show visible Login button
              <Link
                href="/login"
                className="btn btn-primary btn-sm px-6 rounded-full font-medium"
                onClick={() => showNotification("Please sign in to continue", "info")}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
            ) : (
              // Logged In: Show User Dropdown
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border border-base-200 hover:bg-base-200 transition-all"
                >
                  <div className="w-10 rounded-full flex items-center justify-center bg-base-200 text-base-content/70">
                    {/* Placeholder for User Image - or use session.user.image if available */}
                    <User className="w-6 h-6" />
                  </div>
                </div>
                
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-2xl w-64 border border-base-200"
                >
                  {/* User Email Header */}
                  <li className="menu-title px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Signed in as
                    </span>
                    <span className="text-sm font-bold text-base-content truncate block">
                      {session.user?.email}
                    </span>
                  </li>
                  
                  <div className="divider my-0"></div>

                  {/* Admin Link */}
                  {session.user?.role === "admin" && (
                    <li>
                      <Link
                        href="/admin"
                        className="py-3 font-medium text-primary"
                        onClick={() => showNotification("Welcome Admin", "info")}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </li>
                  )}

                  {/* User Links */}
                  <li>
                    <Link href="/orders" className="py-3 font-medium text-green-800">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </li>

                  <div className="divider my-0"></div>

                  {/* Sign Out */}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="py-3 text-error hover:bg-error/10 hover:text-error font-medium"
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
      </div>
    </header>
  );
}