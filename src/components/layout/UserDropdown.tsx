import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

function formatLastLogin(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}
import { useUserStore } from "@/stores/UserStore";
import { clearAuthTokens } from "@/utils/storage";
import { queryClient } from "@/lib/queryClient";
import { useLogout } from "@/features/auth/api/logout";
import { toast } from '@/lib/toast';

const UserDropdown = () => {
  const { t } = useTranslation();
  const { user, clearUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const basename = import.meta.env.VITE_BASE_PATH || '/debtbox-admin/';

  const { mutate: logoutMutation, isPending } = useLogout({
    onError: () => {
      toast.error(t('login.logoutError', 'Failed to sign out. You have been signed out locally.'));
    },
  });

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
    logoutMutation(undefined, {
      onSettled: () => {
        clearAuthTokens();
        clearUser();
        queryClient.clear();
        localStorage.clear();
        window.location.replace(`${basename}auth/login`);
      },
    });
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
        <div className="absolute end-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              {user?.full_name_en || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.email || "—"}
            </p>
            {user?.role && (
              <p className="text-xs text-primary font-medium mt-1">
                {user.role.name}
              </p>
            )}
            {user?.phone && (
              <p className="text-xs text-gray-500 mt-0.5">
                {user.phone}
              </p>
            )}
            {user?.last_login_at && (
              <p className="text-xs text-gray-400 mt-1">
                {t("user.lastLogin", "Last login")}: {formatLastLogin(user.last_login_at)}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{isPending ? t("login.signingOut", "Signing out...") : t("common.buttons.logout", "Logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
