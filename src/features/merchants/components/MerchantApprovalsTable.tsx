import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { Button, Table } from "@/components/shared";
import { useApproveManualRegistration } from "../api/approveManualRegisteration";
import { useRejectManualRegistration } from "../api/rejectManualRegisteration";
import type { MerchantPendingApprovalsDTO } from "@/types/MerchantDTO";

interface MerchantApprovalsTableProps {
  data: MerchantPendingApprovalsDTO[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export const MerchantApprovalsTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
}: MerchantApprovalsTableProps) => {
  const { t } = useTranslation();
  const [selectedMerchant, setSelectedMerchant] =
    useState<MerchantPendingApprovalsDTO | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const approveMutation = useApproveManualRegistration({
    config: {
      onSuccess: () => {
        setShowApproveModal(false);
        setSelectedMerchant(null);
        setReviewNote("");
        onRefresh();
      },
    },
  });

  const rejectMutation = useRejectManualRegistration({
    config: {
      onSuccess: () => {
        setShowRejectModal(false);
        setSelectedMerchant(null);
        setReviewNote("");
        onRefresh();
      },
    },
  });

  const handleApprove = (merchant: MerchantPendingApprovalsDTO) => {
    setSelectedMerchant(merchant);
    setShowApproveModal(true);
  };

  const handleReject = (merchant: MerchantPendingApprovalsDTO) => {
    setSelectedMerchant(merchant);
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedMerchant) {
      approveMutation.mutate({
        id: selectedMerchant.id,
        data: { reviewNote: reviewNote || undefined },
      });
    }
  };

  const confirmReject = () => {
    if (selectedMerchant) {
      rejectMutation.mutate({
        id: selectedMerchant.id,
        data: { reviewNote },
      });
    }
  };

  const columns = [
    {
      key: "name",
      title: t("merchants.name", "Name"),
      dataIndex: "full_name_en",
      render: (_value: any, record: any) => (
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
      title: t("merchants.email", "Email"),
      dataIndex: "email",
      render: (_value: any) => (
        <div className="text-sm text-gray-900">{_value}</div>
      ),
    },
    {
      key: "registrationMethod",
      title: "Registration Method",
      dataIndex: "registration_method",
      render: (value: any) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {String(t(`merchants.registrationMethod.${value}`, value))}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: t("merchants.createdAt", "Created"),
      dataIndex: "created_at",
      render: (value: any) => (
        <div className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "idCard",
      title: t("merchants.idCard", "ID Card"),
      dataIndex: "id_card_attachment_key",
      render: (value: any, record: any) =>
        value ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(record.id_card_attachment_url, "_blank")}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {t("merchants.viewIdCard", "View ID Card")}
          </Button>
        ) : null,
    },
  ];

  const actions = (record: any) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleApprove(record)}
        className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
      >
        <CheckCircle className="w-4 h-4" />
        {t("merchants.approve", "Approve")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReject(record)}
        className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
      >
        <XCircle className="w-4 h-4" />
        {t("merchants.reject", "Reject")}
      </Button>
    </div>
  );

  return (
    <>
      <Table
        columns={columns}
        data={data}
        loading={isLoading}
        emptyText={t("merchants.noPendingApprovals", "No pending approvals")}
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
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("merchants.approveMerchant", "Approve Merchant")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {t(
                    "merchants.approveConfirmation",
                    "Are you sure you want to approve this merchant registration?",
                  )}
                </p>
                {selectedMerchant && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      {selectedMerchant.full_name_en ||
                        selectedMerchant.full_name_ar}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedMerchant.email}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("merchants.reviewNote", "Review Note (Optional)")}
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t(
                      "merchants.reviewNotePlaceholder",
                      "Add a note about this approval...",
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowApproveModal(false)}
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={confirmApprove}
                    loading={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t("merchants.approve", "Approve")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("merchants.rejectMerchant", "Reject Merchant")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {t(
                    "merchants.rejectConfirmation",
                    "Are you sure you want to reject this merchant registration?",
                  )}
                </p>
                {selectedMerchant && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      {selectedMerchant.full_name_en ||
                        selectedMerchant.full_name_ar}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedMerchant.email}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("merchants.reviewNote", "Review Note")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t(
                      "merchants.reviewNotePlaceholder",
                      "Please provide a reason for rejection...",
                    )}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={confirmReject}
                    loading={rejectMutation.isPending}
                    disabled={!reviewNote.trim()}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {t("merchants.reject", "Reject")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
