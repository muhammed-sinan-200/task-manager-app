import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const THEME_STORAGE_KEY = "theme";

const getStoredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    applyThemeClass(stored);
    return stored;
  });

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";
  const avatarLetter =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/95">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between overflow-visible px-4 sm:h-16">
        <p className="text-base font-semibold tracking-tight text-[#4D7C0F] sm:text-lg">
          Task Manager
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-stone-100 px-2.5 shadow-sm transition duration-200 hover:bg-stone-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 focus-visible:ring-offset-2 dark:bg-stone-800 dark:hover:bg-stone-700 dark:focus-visible:ring-offset-stone-900"
          >
            <FiSun
              size={15}
              aria-hidden="true"
              className="shrink-0 text-amber-400 transition duration-300"
            />
            <span
              aria-hidden="true"
              className="relative h-5 w-10 shrink-0 rounded-full bg-stone-300 transition duration-300 dark:bg-stone-600"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${isDark ? "translate-x-5" : "translate-x-0"
                  }`}
              />
            </span>
            <FiMoon
              size={15}
              aria-hidden="true"
              className="shrink-0 text-stone-400 transition duration-300 dark:text-stone-300"
            />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close profile menu" : "Open profile menu"}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="profile-menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4D7C0F] text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
            >
              <span aria-hidden="true">{avatarLetter}</span>
            </button>

            {menuOpen && (
              <div
                id="profile-menu"
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 z-50 mt-2 w-[min(16.5rem,calc(100vw-2rem))] origin-top-right rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg dark:border-stone-600 dark:bg-stone-800 dark:shadow-black/40"
              >
                <div className="border-b border-stone-100 px-3 py-2.5 dark:border-stone-700">
                  <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {user?.name || "User"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
                    {user?.email || ""}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-700 transition duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:bg-red-50 dark:text-stone-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:focus-visible:bg-red-950/50"
                >
                  <FiLogOut size={16} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
