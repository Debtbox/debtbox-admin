import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { SalesUserSelect } from "./SalesUserSelect";
import { useCreateSalesAssignmentMutation } from "../api/sales";

interface CreateSalesAssignmentModalProps {
  onClose: () => void;
}

export const CreateSalesAssignmentModal = ({ onClose }: CreateSalesAssignmentModalProps) => {
  const { t } = useTranslation();
  const [salesUserId, setSalesUserId] = useState("");
  const [entityType, setEntityType] = useState<"MERCHANT" | "CUSTOMER">("MERCHANT");
  const [entityId, setEntityId] = useState("");
  const mutation = useCreateSalesAssignmentMutation({
    onSuccess: () => {
      toast.success(t("salesAssignments.createSuccess", "Sales assignment created"));
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? t("salesAssignments.createError", "Failed to create assignment"));
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{t("salesAssignments.createTitle", "Create Assignment")}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <SalesUserSelect value={salesUserId} onChange={setSalesUserId} />
          <Select
            label={t("salesAssignments.entityType", "Entity Type")}
            value={entityType}
            onChange={(event) => setEntityType(event.target.value as "MERCHANT" | "CUSTOMER")}
            options={[
              { value: "MERCHANT", label: t("salesLeads.leadTypes.MERCHANT", "Merchant") },
              { value: "CUSTOMER", label: t("salesLeads.leadTypes.CUSTOMER", "Customer") },
            ]}
          />
          <Input label={t("salesAssignments.entityId", "Entity ID")} value={entityId} onChange={(event) => setEntityId(event.target.value)} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>{t("common.cancel", "Cancel")}</Button>
            <Button
              type="button"
              loading={mutation.isPending}
              disabled={!salesUserId || !entityId}
              onClick={() => mutation.mutate({ salesUserId: Number(salesUserId), entityType, entityId })}
            >
              {t("common.save", "Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
