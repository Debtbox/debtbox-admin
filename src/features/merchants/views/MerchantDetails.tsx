import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Building2, User, CreditCard } from "lucide-react";
import { useGetMerchant } from "../api/getMerchant";
import { useUpdateMerchant } from "../api/updateMerchant";
import { Button } from "@/components/shared";
import { EditMerchantModal } from "../components/EditMerchantModal";
import { formatDate } from "@/utils/formatDate";

export const MerchantDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: response, isLoading, error, refetch } = useGetMerchant({ id: id! });
  const merchant = response?.data;
  const updateMutation = useUpdateMerchant();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending_nafath":
        return "bg-yellow-100 text-yellow-800";
      case "pending_email_verification":
        return "bg-blue-100 text-blue-800";
      case "pending_admin_approval":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {t(
            "merchants.errorLoadingMerchant",
            "Error loading merchant details",
          )}
        </p>
        <Button onClick={() => navigate("/merchants")} className="mt-4">
          {t("common.back", "Back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/merchants")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back", "Back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {merchant.full_name_en || merchant.full_name_ar}
            </h1>
            <p className="text-gray-600">{merchant.email}</p>
          </div>
        </div>
        <Button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {t("common.edit", "Edit")}
        </Button>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(merchant.status)}`}
        >
          {t(`merchants.statusLabel.${merchant.status}`, merchant.status)}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(merchant.verification_status)}`}
        >
          {t(
            `merchants.verificationStatus.${merchant.verification_status}`,
            merchant.verification_status,
          )}
        </span>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("merchants.personalInformation", "Personal Information")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.fullNameEn", "Full Name (English)")}
            </label>
            <p className="text-gray-900">{merchant.full_name_en || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.fullNameAr", "Full Name (Arabic)")}
            </label>
            <p className="text-gray-900">{merchant.full_name_ar || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.email", "Email")}
            </label>
            <p className="text-gray-900">{merchant.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.nationalId", "National ID")}
            </label>
            <p className="text-gray-900">{merchant.national_id || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.iqamaId", "Iqama ID")}
            </label>
            <p className="text-gray-900">{merchant.iqama_id || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.registrationMethodLabel", "Registration Method")}
            </label>
            <p className="text-gray-900">
              {merchant.registration_method
                ? t(
                    `merchants.registrationMethod.${merchant.registration_method}`,
                    merchant.registration_method,
                  )
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("merchants.businessInformation", "Business Information")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t(
                "merchants.commercialRegisterNumber",
                "Commercial Register Number",
              )}
            </label>
            <p className="text-gray-900">
              {merchant.commercial_register_number || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.businessesCount", "Businesses Count")}
            </label>
            <p className="text-gray-900">{merchant.businessesCount || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.customersCount", "Customers Count")}
            </label>
            <p className="text-gray-900">
              {merchant.customersCountDistinct || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.debtsCount", "Debts Count")}
            </label>
            <p className="text-gray-900">{merchant.debtsCount || "-"}</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("merchants.accountInformation", "Account Information")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.payoutMethod", "Payout Method")}
            </label>
            <p className="text-gray-900">{merchant.payout_method || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.ibanVerified", "IBAN Verified")}
            </label>
            <p className="text-gray-900">
              {merchant.iban_verified
                ? t("common.yes", "Yes")
                : t("common.no", "No")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.createdAt", "Created At")}
            </label>
            <p className="text-gray-900">
              {formatDate(i18n.language, merchant.created_at, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("merchants.updatedAt", "Updated At")}
            </label>
            <p className="text-gray-900">
              {formatDate(i18n.language, merchant.updated_at, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditMerchantModal
          merchant={merchant}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            updateMutation.mutate(
              { id: merchant.id, data },
              {
                onSuccess: () => {
                  setShowEditModal(false);
                  refetch();
                },
              },
            );
          }}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default MerchantDetails;
