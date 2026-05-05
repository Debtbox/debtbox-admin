import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from '@/lib/toast';
import { X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import type { SalesLead } from "@/types/SalesLeadDTO";
import { useConvertSalesLeadMutation } from "../api/sales";

interface ConvertLeadModalProps {
  lead: SalesLead;
  onClose: () => void;
}

export const ConvertLeadModal = ({ lead, onClose }: ConvertLeadModalProps) => {
  const { t } = useTranslation();
  const [convertedEntityType, setConvertedEntityType] = useState<"MERCHANT" | "CUSTOMER">(
    lead.leadType,
  );
  const [convertedEntityId, setConvertedEntityId] = useState("");
  const mutation = useConvertSalesLeadMutation({
    onSuccess: () => {
      toast.success(t("salesLeads.modals.convert.success", "Lead converted successfully"));
      onClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ??
          t("salesLeads.modals.convert.error", "Failed to convert lead"),
      );
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("salesLeads.modals.convert.title", "Convert Lead")}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Select
            label={t("salesLeads.details.convertedEntityType", "Entity Type")}
            value={convertedEntityType}
            onChange={(event) =>
              setConvertedEntityType(event.target.value as "MERCHANT" | "CUSTOMER")
            }
            options={[
              { value: "MERCHANT", label: t("salesLeads.leadTypes.MERCHANT", "Merchant") },
              { value: "CUSTOMER", label: t("salesLeads.leadTypes.CUSTOMER", "Customer") },
            ]}
          />
          <Input
            label={t("salesLeads.details.convertedEntityId", "Entity ID")}
            value={convertedEntityId}
            onChange={(event) => setConvertedEntityId(event.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              loading={mutation.isPending}
              disabled={!convertedEntityId}
              onClick={() =>
                mutation.mutate({
                  id: lead.id,
                  payload: { convertedEntityType, convertedEntityId },
                })
              }
            >
              {t("salesLeads.actions.convert", "Convert")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
