import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button, Table } from "@/components/shared";
import { useApproveCustomerRegistration } from "../api/approveCustomerRegistration";
import { useRejectCustomerRegistration } from "../api/rejectCustomerRegistration";
import type { CustomerDTO } from "@/types/CustomerDTO";

interface CustomerApprovalsTableProps {
  data: CustomerDTO[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export const CustomerApprovalsTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
}: CustomerApprovalsTableProps) => {
  const { t } = useTranslation();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const approveMutation = useApproveCustomerRegistration({
    config: {
      onSuccess: () => {
        setShowApproveModal(false);
        setSelectedCustomer(null);
        setReviewNote("");
        onRefresh();
      },
    },
  });

  const rejectMutation = useRejectCustomerRegistration({
    config: {
      onSuccess: () => {
        setShowRejectModal(false);
        setSelectedCustomer(null);
        setReviewNote("");
        onRefresh();
      },
    },
  });

  const confirmApprove = () => {
    if (selectedCustomer) {
      approveMutation.mutate({ id: selectedCustomer.id, data: { reviewNote: reviewNote || undefined } });
    }
  };

  const confirmReject = () => {
    if (selectedCustomer) {
      rejectMutation.mutate({ id: selectedCustomer.id, data: { reviewNote } });
    }
  };

  const columns = [
    {
      key: "name",
      title: t("customers.name", "Name"),
      dataIndex: "full_name_en",
      render: (_value: unknown, record: CustomerDTO) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.full_name_en || record.full_name_ar}
          </div>
          <div className="text-sm text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      key: "email",
      title: t("customers.email", "Email"),
      dataIndex: "email",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900">{value as string}</div>
      ),
    },
    {
      key: "registrationMethod",
      title: t("customers.registrationMethodLabel", "Registration Method"),
      dataIndex: "registration_method",
      render: (value: unknown) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {String(t(`customers.registrationMethod.${value as string}`, value as string))}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: t("customers.createdAt", "Created"),
      dataIndex: "created_at",
      render: (value: unknown) => (
        <div className="text-sm text-gray-500">
          {new Date(value as string).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const actions = (record: CustomerDTO) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => { setSelectedCustomer(record); setShowApproveModal(true); }}
        className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
      >
        <CheckCircle className="w-4 h-4" />
        {t("customers.approve", "Approve")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => { setSelectedCustomer(record); setShowRejectModal(true); }}
        className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
      >
        <XCircle className="w-4 h-4" />
        {t("customers.reject", "Reject")}
      </Button>
    </div>
  );

  return (
    <>
      <Table
        columns={columns}
        data={data}
        loading={isLoading}
        emptyText={t("customers.noPendingApprovals", "No pending approvals")}
        showActions={true}
        actions={actions}
        pagination={{
          current: pagination.page + 1,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page) => onPageChange(page - 1),
        }}
      />

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("customers.approveCustomer", "Approve Customer")}
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t("customers.approveConfirmation", "Are you sure you want to approve this customer registration?")}
              </p>
              {selectedCustomer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    {selectedCustomer.full_name_en || selectedCustomer.full_name_ar}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("customers.reviewNote", "Review Note (Optional)")}
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("customers.reviewNotePlaceholder", "Add a note about this approval...")}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmApprove}
                  loading={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t("customers.approve", "Approve")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("customers.rejectCustomer", "Reject Customer")}
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t("customers.rejectConfirmation", "Are you sure you want to reject this customer registration?")}
              </p>
              {selectedCustomer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    {selectedCustomer.full_name_en || selectedCustomer.full_name_ar}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("customers.reviewNote", "Review Note")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("customers.rejectNotePlaceholder", "Please provide a reason for rejection...")}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  variant="outline"
                  onClick={confirmReject}
                  loading={rejectMutation.isPending}
                  disabled={!reviewNote.trim()}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {t("customers.reject", "Reject")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
