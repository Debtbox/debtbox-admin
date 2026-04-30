import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import type { SalesLead } from "@/types/SalesLeadDTO";
import { useAssignSalesLeadMutation } from "../api/sales";
import { SalesUserSelect } from "./SalesUserSelect";

interface AssignLeadModalProps {
  lead: SalesLead;
  canUnassign: boolean;
  onClose: () => void;
}

export const AssignLeadModal = ({ lead, canUnassign, onClose }: AssignLeadModalProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(
    lead.assignedSalesUserId ? String(lead.assignedSalesUserId) : "",
  );
  const mutation = useAssignSalesLeadMutation({
    onSuccess: () => {
      toast.success(t("salesLeads.modals.assign.success", "Lead assignment updated"));
      onClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ??
          t("salesLeads.modals.assign.error", "Failed to update assignment"),
      );
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("salesLeads.modals.assign.title", "Assign Lead")}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <SalesUserSelect
            value={value}
            onChange={setValue}
            allowUnassigned={canUnassign}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              loading={mutation.isPending}
              onClick={() =>
                mutation.mutate({
                  id: lead.id,
                  assignedSalesUserId: value ? Number(value) : null,
                })
              }
            >
              {t("common.save", "Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
