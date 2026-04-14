import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Building2, User, CreditCard } from "lucide-react";
import { Button, Input, Select } from "@/components/shared";

interface EditMerchantModalProps {
  merchant: any;
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
}

export const EditMerchantModal = ({ merchant, onClose, onSave, isLoading }: EditMerchantModalProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      status: merchant.status,
      payout_method: merchant.payout_method || '',
    }
  });

  const statusOptions = [
    { value: 'active', label: t('merchants.status.active', 'Active') },
    { value: 'inactive', label: t('merchants.status.inactive', 'Inactive') },
    { value: 'pending', label: t('merchants.status.pending', 'Pending') },
    { value: 'banned', label: t('merchants.status.banned', 'Banned') },
  ];

  const payoutMethodOptions = [
    { value: 'bank_transfer', label: t('merchants.payoutMethods.bankTransfer', 'Bank Transfer') },
    { value: 'wallet', label: t('merchants.payoutMethods.wallet', 'Wallet') },
    { value: 'cash', label: t('merchants.payoutMethods.cash', 'Cash') },
  ];

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('merchants.editMerchant', 'Edit Merchant')}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  {t('merchants.personalInformation', 'Personal Information')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('merchants.fullNameEn', 'Full Name (English)')}
                  value={merchant.full_name_en || ''}
                  disabled
                />
                <Input
                  label={t('merchants.fullNameAr', 'Full Name (Arabic)')}
                  value={merchant.full_name_ar || ''}
                  disabled
                />
                <Input
                  label={t('merchants.email', 'Email')}
                  value={merchant.email}
                  disabled
                />
                <Input
                  label={t('merchants.phone', 'Phone')}
                  value={merchant.phone || ''}
                  disabled
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  {t('merchants.businessInformation', 'Business Information')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('merchants.businessNameEn', 'Business Name (English)')}
                  value={merchant.business_name_en || ''}
                  disabled
                />
                <Input
                  label={t('merchants.businessNameAr', 'Business Name (Arabic)')}
                  value={merchant.business_name_ar || ''}
                  disabled
                />
                <Input
                  label={t('merchants.commercialRegistration', 'Commercial Registration')}
                  value={merchant.commercial_registration || ''}
                  disabled
                />
                <Input
                  label={t('merchants.taxNumber', 'Tax Number')}
                  value={merchant.tax_number || ''}
                  disabled
                />
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  {t('merchants.accountSettings', 'Account Settings')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('merchants.status', 'Status')}
                  options={statusOptions}
                  {...register('status')}
                  error={errors.status}
                />
                <Select
                  label={t('merchants.payoutMethod', 'Payout Method')}
                  options={payoutMethodOptions}
                  {...register('payout_method')}
                  error={errors.payout_method}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t('common.save', 'Save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};