import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Forbidden = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          {t("rbac.forbiddenTitle", "Access denied")}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t("rbac.forbiddenMessage", "You do not have permission to view this page.")}
        </p>
      </div>
    </div>
  );
};

export const PermissionLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="mt-3 text-sm text-gray-500">
          {t("common.loading", "Loading...")}
        </p>
      </div>
    </div>
  );
};
