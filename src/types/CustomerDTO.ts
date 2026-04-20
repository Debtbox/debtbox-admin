export interface CustomerDTO {
  id: number;
  full_name_ar: string;
  full_name_en: string;
  national_id: string;
  iqama_id: string;
  email: string;
  status: "active" | "inactive" | "pending" | "banned";
  registration_method: "email" | "nafath";
  verification_status:
    | "pending_nafath"
    | "pending_email_verification"
    | "pending_admin_approval"
    | "approved"
    | "rejected";
  created_at: string;
}

export interface CustomerDetailsDTO extends CustomerDTO {
  nationality: string;
  dob: string;
  gender: string;
  id_card_attachment_key: string | null;
  id_card_attachment_name: string | null;
  id_card_attachment_mime_type: string | null;
  id_card_attachment_size: number | null;
  verification_reviewed_at: string | null;
  verification_reviewed_by_user_id: number | null;
  verification_review_note: string | null;
  updated_at: string;
  businessesBoughtFromCount: string;
  merchantsBoughtFromCount: string;
  purchasesCount: string;
}

