import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, User, ShoppingBag } from "lucide-react";
import { useGetCustomer } from "../api/getCustomer";
import { useUpdateCustomer } from "../api/updateCustomer";
import { Button } from "@/components/shared";
import { EditCustomerModal } from "../components/EditCustomerModal";
import { formatDate } from "@/utils/formatDate";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";

export const CustomerDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const canUpdate = useCan(PERMISSIONS.CUSTOMER_UPDATE);

  const { data: response, isLoading, error, refetch } = useGetCustomer({ id: id! });
  const customer = response?.data;
  const updateMutation = useUpdateCustomer();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":   return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending":  return "bg-yellow-100 text-yellow-800";
      case "banned":   return "bg-red-100 text-red-800";
      default:         return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "approved":                   return "bg-green-100 text-green-800";
      case "rejected":                   return "bg-red-100 text-red-800";
      case "pending_nafath":             return "bg-yellow-100 text-yellow-800";
      case "pending_email_verification": return "bg-blue-100 text-blue-800";
      case "pending_admin_approval":     return "bg-orange-100 text-orange-800";
      default:                           return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {t("customers.errorLoadingCustomer", "Error loading customer details")}
        </p>
        <Button onClick={() => navigate("/customers")} className="mt-4">
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
          <Button variant="outline" size="sm" onClick={() => navigate("/customers")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back", "Back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.full_name_en || customer.full_name_ar}
            </h1>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        </div>
        {canUpdate && (
          <Button onClick={() => setShowEditModal(true)} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            {t("common.edit", "Edit")}
          </Button>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
          {t(`customers.statusLabel.${customer.status}`, customer.status)}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(customer.verification_status)}`}>
          {t(`customers.verificationStatus.${customer.verification_status}`, customer.verification_status)}
        </span>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("customers.personalInformation", "Personal Information")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label={t("customers.fullNameEn", "Full Name (English)")} value={customer.full_name_en} />
          <Field label={t("customers.fullNameAr", "Full Name (Arabic)")} value={customer.full_name_ar} />
          <Field label={t("customers.email", "Email")} value={customer.email} />
          <Field label={t("customers.nationalId", "National ID")} value={customer.national_id} />
          <Field label={t("customers.iqamaId", "Iqama ID")} value={customer.iqama_id} />
          <Field
            label={t("customers.registrationMethodLabel", "Registration Method")}
            value={customer.registration_method
              ? t(`customers.registrationMethod.${customer.registration_method}`, customer.registration_method)
              : undefined}
          />
          <Field label={t("customers.nationality", "Nationality")} value={customer.nationality} />
          <Field label={t("customers.dob", "Date of Birth")} value={customer.dob} />
          <Field
            label={t("customers.gender", "Gender")}
            value={customer.gender ? t(`common.gender.${customer.gender}`, customer.gender) : undefined}
          />
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("customers.activity", "Activity")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label={t("customers.purchasesCount", "Total Purchases")} value={customer.purchasesCount} />
          <StatCard label={t("customers.merchantsBoughtFromCount", "Merchants Bought From")} value={customer.merchantsBoughtFromCount} />
          <StatCard label={t("customers.businessesBoughtFromCount", "Businesses Bought From")} value={customer.businessesBoughtFromCount} />
        </div>
      </div>

      {/* Verification */}
      {(customer.verification_reviewed_at || customer.verification_review_note) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("customers.verificationReview", "Verification Review")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customer.verification_reviewed_at && (
              <Field
                label={t("customers.reviewedAt", "Reviewed At")}
                value={formatDate(i18n.language, customer.verification_reviewed_at, {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              />
            )}
            {customer.verification_review_note && (
              <Field label={t("customers.reviewNote", "Review Note")} value={customer.verification_review_note} />
            )}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label={t("customers.createdAt", "Created At")}
            value={formatDate(i18n.language, customer.created_at, {
              year: "numeric", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          />
          <Field
            label={t("customers.updatedAt", "Updated At")}
            value={formatDate(i18n.language, customer.updated_at, {
              year: "numeric", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {canUpdate && showEditModal && (
        <EditCustomerModal
          customer={customer}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            updateMutation.mutate(
              { id: customer.id, data },
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

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-gray-900">{value || "—"}</p>
  </div>
);

const StatCard = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <p className="text-2xl font-bold text-gray-900">{value || "0"}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

export default CustomerDetails;
