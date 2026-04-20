import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, X } from "lucide-react";
import { Button, Input, Select } from "@/components/shared";
import type { CustomerDetailsDTO } from "@/types/CustomerDTO";
import type { UpdateCustomerRequest } from "../api/updateCustomer";

const schema = z.object({
  full_name_en: z.string().optional().or(z.literal("")),
  full_name_ar: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface EditCustomerModalProps {
  customer: CustomerDetailsDTO;
  onClose: () => void;
  onSave: (data: UpdateCustomerRequest) => void;
  isLoading: boolean;
}

export const EditCustomerModal = ({ customer, onClose, onSave, isLoading }: EditCustomerModalProps) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name_en: customer.full_name_en || "",
      full_name_ar: customer.full_name_ar || "",
      nationality: customer.nationality || "",
      dob: customer.dob || "",
      gender: customer.gender || "",
    },
  });

  const genderOptions = [
    { value: "", label: t("common.selectOption", "Select...") },
    { value: "male", label: t("common.gender.male", "Male") },
    { value: "female", label: t("common.gender.female", "Female") },
  ];

  const onSubmit = (values: FormValues) => {
    const payload: UpdateCustomerRequest = {};
    if (values.full_name_en) payload.full_name_en = values.full_name_en;
    if (values.full_name_ar) payload.full_name_ar = values.full_name_ar;
    if (values.nationality) payload.nationality = values.nationality;
    if (values.dob) payload.dob = values.dob;
    if (values.gender) payload.gender = values.gender;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("customers.editCustomer", "Edit Customer")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t("customers.fullNameEn", "Full Name (English)")}
                placeholder="John Doe"
                error={errors.full_name_en}
                {...register("full_name_en")}
              />
              <Input
                label={t("customers.fullNameAr", "Full Name (Arabic)")}
                placeholder="محمد علي"
                dir="rtl"
                error={errors.full_name_ar}
                {...register("full_name_ar")}
              />
            </div>
            <Input
              label={t("customers.nationality", "Nationality")}
              placeholder={t("customers.nationalityPlaceholder", "e.g. Saudi")}
              error={errors.nationality}
              {...register("nationality")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label={t("customers.dob", "Date of Birth")}
                error={errors.dob}
                {...register("dob")}
              />
              <Select
                label={t("customers.gender", "Gender")}
                options={genderOptions}
                error={errors.gender}
                {...register("gender")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isLoading}>
              {t("common.saveChanges", "Save Changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
