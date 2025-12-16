import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { useUserStore } from "@/stores/UserStore";
import { clearCookie } from "@/utils/storage";
import { queryClient } from "@/lib/queryClient";

const UserDropdown = () => {
  const { t } = useTranslation();
  const { user, clearUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearCookie("access_token");
    clearUser();
    queryClient.clear();
    localStorage.clear();
    window.location.replace("/auth/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
          {user?.full_name_en?.charAt(0) || "A"}
        </div>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user?.full_name_en || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "admin@debtbox.sa"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("common.buttons.logout", "Logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
