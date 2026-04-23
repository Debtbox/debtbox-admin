import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, User, Info, StickyNote, GitMerge } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/utils/cn";
import { useGetSalesLead } from "../api/getSalesLead";
import { SalesLeadStatusBadge } from "../components/SalesLeadStatusBadge";
import { getLeadTypeColor } from "../utils";

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="text-sm text-gray-900">
      {value ?? <span className="text-gray-400">—</span>}
    </div>
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
  <div
    className={`bg-white rounded-lg border border-gray-200 p-6 ${className ?? ""}`}
  >
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SalesLeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useGetSalesLead({ id: id! });
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ms-2"
        >
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>

        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.fullName}
            </h1>
            <p className="text-sm text-gray-500 font-mono mt-0.5">{lead.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            icon={<User className="w-5 h-5" />}
            title={t("salesLeads.details.leadInfo", "Lead Information")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("salesLeads.fields.fullName", "Full Name")}
                value={lead.fullName}
              />
              <Field
                label={t("salesLeads.fields.phone", "Phone")}
                value={lead.phone ?? null}
              />
              <Field
                label={t("salesLeads.fields.email", "Email")}
                value={lead.email ?? null}
              />
              <Field
                label={t(
                  "salesLeads.fields.assignedTo",
                  "Assigned Sales User ID",
                )}
                value={lead.assignedSalesUserId ?? null}
              />
              <Field
                label={t("salesLeads.columns.createdAt", "Created At")}
                value={formatDate(lead.created_at)}
              />
              <Field
                label={t("salesLeads.details.updatedAt", "Updated At")}
                value={formatDate(lead.updated_at)}
              />
            </div>
          </SectionCard>

          {lead.notes && (
            <SectionCard
              icon={<StickyNote className="w-5 h-5" />}
              title={t("salesLeads.fields.notes", "Notes")}
            >
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {lead.notes}
              </p>
            </SectionCard>
          )}

          {lead.convertedEntityId && (
            <SectionCard
              icon={<GitMerge className="w-5 h-5" />}
              title={t("salesLeads.details.conversionInfo", "Conversion Info")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t(
                    "salesLeads.details.convertedEntityType",
                    "Entity Type",
                  )}
                  value={lead.convertedEntityType}
                />
                <Field
                  label={t("salesLeads.details.convertedEntityId", "Entity ID")}
                  value={lead.convertedEntityId}
                />
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard
            icon={<Info className="w-5 h-5" />}
            title={t("salesLeads.details.quickInfo", "Quick Info")}
          >
            <div className="space-y-4">
              <Field
                label={t("salesLeads.columns.status", "Status")}
                value={<SalesLeadStatusBadge status={lead.status} />}
              />
              <Field
                label={t("salesLeads.columns.leadType", "Lead Type")}
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getLeadTypeColor(lead.leadType),
                    )}
                  >
                    {t(`salesLeads.leadTypes.${lead.leadType}`, lead.leadType)}
                  </span>
                }
              />
              <Field
                label={t("salesLeads.columns.source", "Source")}
                value={t(`salesLeads.sources.${lead.source}`, lead.source)}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default SalesLeadDetails;
