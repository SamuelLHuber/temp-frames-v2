import { Link, Form, useLocation } from "@remix-run/react";
import { FarcasterUser } from "~/lib/auth.server";
import { useState, useRef, useEffect } from "react";
import { LoginButton } from "./LoginButton";

interface NavbarProps {
  user: FarcasterUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // uncomment this if you want to highlight the current page in the navbar if /second-page
  // also uncomment the <Link> component below
  // make sure the /second-page route matches pages you have setup in your routes
  // const isSecondPage = location.pathname === "/second-page";
  const isIndex = location.pathname === "/";

  console.log("Navbar user", user);
  return (
    // don't render navbar when we are on the landing page
    // isIndex && !user ? null : ( wrap this around the full section below)
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/30 dark:border-gray-700/30 bg-background-light dark:bg-background-dark">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <img src="/icon.png" alt="dtech.vision" className="h-8 w-8 mr-2" />
        </Link>

        <nav className="flex items-center gap-3 overflow-x-auto">
          {/* <Link
            to="/second-page"
            className={`rounded-full px-4 py-2 transition-colors ${
              isSecondPage
                ? "bg-button-primary text-white border-transparent"
                : "text-text-light-secondary dark:text-text-dark-secondary border border-gray-200 hover:bg-button-primary hover:text-white hover:border-transparent dark:border-gray-700"
            }`}
          >
            Second Page
          </Link> */}
        </nav>
      </div>

      <div className="flex items-center">
        {user ? (
          <div className="flex items-center space-x-4" ref={dropdownRef}>
            <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary hidden sm:block">
              {user.username}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="block focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-button-primary flex items-center justify-center">
                  {user.pfpUrl ? (
                    <img
                      src={user.pfpUrl}
                      alt={user.username || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-light dark:bg-messagebox-dark ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary border-b border-gray-200 dark:border-gray-700">
                      Signed in as
                      <br />
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-messagebox-light dark:hover:bg-button-secondary-dark transition-colors"
                      >
                        Sign out
                      </button>
                    </Form>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoginButton user={null} error={null} />
        )}
      </div>
    </div>
  );
}
