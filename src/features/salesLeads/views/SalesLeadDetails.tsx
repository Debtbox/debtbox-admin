import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, User, Info, StickyNote, GitMerge, Edit2, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/utils/cn";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useUserStore } from "@/stores/UserStore";
import type { SalesLead } from "@/types/SalesLeadDTO";
import { useSalesLead } from "../api/sales";
import { AssignLeadModal, ConvertLeadModal, CreateSalesLeadModal, SalesLeadStatusBadge } from "../components";
import {
  formatSalesDateTime,
  getLeadTypeColor,
  getSalesUserDisplay,
  isSalesAdminRole,
} from "../utils";

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <div className="text-sm text-gray-900">{value || <span className="text-gray-400">—</span>}</div>
  </div>
);

const SectionCard = ({
  icon,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className ?? ""}`}>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const SalesLeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAllSales = isSalesAdminRole(user?.role?.slug);
  const canUpdate = useCan(PERMISSIONS.SALES_LEAD_UPDATE);
  const canAssign = useCan(PERMISSIONS.SALES_LEAD_ASSIGN);
  const [editingLead, setEditingLead] = useState<SalesLead | null>(null);
  const [assigningLead, setAssigningLead] = useState<SalesLead | null>(null);
  const [convertingLead, setConvertingLead] = useState<SalesLead | null>(null);

  const { data, isLoading, isError } = useSalesLead(id ?? "");
  const lead = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>{t("salesLeads.details.notFound", "Sales lead not found.")}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          {t("common.goBack", "Go Back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ms-2">
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.fullName}</h1>
            <p className="text-sm text-gray-500 font-mono mt-0.5">{lead.id}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {canUpdate && (
              <Button variant="outline" size="sm" onClick={() => setEditingLead(lead)}>
                <Edit2 className="w-4 h-4 me-1" />
                {t("common.edit", "Edit")}
              </Button>
            )}
            {canAssign && (
              <Button variant="outline" size="sm" onClick={() => setAssigningLead(lead)}>
                <UserPlus className="w-4 h-4 me-1" />
                {t("salesLeads.actions.assign", "Assign")}
              </Button>
            )}
            {canUpdate && lead.status !== "CONVERTED" && (
              <Button size="sm" onClick={() => setConvertingLead(lead)}>
                <CheckCircle className="w-4 h-4 me-1" />
                {t("salesLeads.actions.convert", "Convert")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard icon={<User className="w-5 h-5" />} title={t("salesLeads.details.leadInfo", "Lead Information")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t("salesLeads.fields.fullName", "Full Name")} value={lead.fullName} />
              <Field label={t("salesLeads.fields.phone", "Phone")} value={lead.phone} />
              <Field label={t("salesLeads.fields.email", "Email")} value={lead.email} />
              <Field label={t("salesLeads.fields.crNumber", "CR Number")} value={lead.crNumber} />
              <Field
                label={t("salesLeads.fields.assignedTo", "Assigned Sales User")}
                value={getSalesUserDisplay(lead.assignedSalesUser, lead.assignedSalesUserId)}
              />
              <Field label={t("salesLeads.columns.createdAt", "Created At")} value={formatSalesDateTime(lead.created_at)} />
              <Field label={t("salesLeads.details.updatedAt", "Updated At")} value={formatSalesDateTime(lead.updated_at)} />
            </div>
          </SectionCard>

          {lead.notes && (
            <SectionCard icon={<StickyNote className="w-5 h-5" />} title={t("salesLeads.fields.notes", "Notes")}>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </SectionCard>
          )}

          {lead.convertedEntityId && (
            <SectionCard icon={<GitMerge className="w-5 h-5" />} title={t("salesLeads.details.conversionInfo", "Conversion Info")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("salesLeads.details.convertedEntityType", "Entity Type")} value={lead.convertedEntityType} />
                <Field label={t("salesLeads.details.convertedEntityId", "Entity ID")} value={lead.convertedEntityId} />
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard icon={<Info className="w-5 h-5" />} title={t("salesLeads.details.quickInfo", "Quick Info")}>
            <div className="space-y-4">
              <Field label={t("salesLeads.columns.status", "Status")} value={<SalesLeadStatusBadge status={lead.status} />} />
              <Field
                label={t("salesLeads.columns.leadType", "Lead Type")}
                value={
                  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", getLeadTypeColor(lead.leadType))}>
                    {t(`salesLeads.leadTypes.${lead.leadType}`, lead.leadType)}
                  </span>
                }
              />
              <Field label={t("salesLeads.columns.source", "Source")} value={t(`salesLeads.sources.${lead.source}`, lead.source)} />
            </div>
          </SectionCard>
        </div>
      </div>

      {canUpdate && editingLead && (
        <CreateSalesLeadModal lead={editingLead} onClose={() => setEditingLead(null)} onSuccess={() => setEditingLead(null)} />
      )}
      {canAssign && assigningLead && (
        <AssignLeadModal lead={assigningLead} canUnassign={canManageAllSales} onClose={() => setAssigningLead(null)} />
      )}
      {canUpdate && convertingLead && (
        <ConvertLeadModal lead={convertingLead} onClose={() => setConvertingLead(null)} />
      )}
    </div>
  );
};

export default SalesLeadDetails;
