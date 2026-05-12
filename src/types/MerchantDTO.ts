export interface MerchantDTO {
    id: number;
    full_name_ar: string;
    full_name_en: string;
    national_id: string;
    iqama_id: string;
    commercial_register_number: string;
    status: 'active' | 'inactive' | 'pending' | 'banned';
    email: string;
    registration_method: 'email' | 'nafath';
    verification_status: 'pending_nafath' | 'pending_email_verification' | 'pending_admin_approval' | 'approved' | 'rejected';
    payout_method: 'weekly' | 'monthly' | 'instant';
    iban_verified: boolean;
    created_at: string;
    updated_at: string;
    debtsCount: string;
    customersCountDistinct: string;
    businessesCount: string;
    outstandingReceivablesHalala?: number | null;
    outstandingReceivablesDebtsCount?: number | null;
}

export interface MerchantDetailsDTO extends MerchantDTO {
    nationality: string
    dob: string
    gender: string
    id_card_attachment_key: string
    id_card_attachment_name: string
    id_card_attachment_mime_type: string
    id_card_attachment_size: string
    verification_reviewed_at: string
    verification_reviewed_by_user_id: string
    verification_review_note: string
    updated_at: string
    businessesCount: string
    customersCountDistinct: string
    debtsCount: string
}

export interface MerchantPendingApprovalsDTO extends MerchantDTO {
    id_card_attachment_key: string;
    id_card_attachment_url: string;
}