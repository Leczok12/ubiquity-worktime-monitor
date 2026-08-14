export type CredentialStatus = 'active' | 'deactivate';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'DEACTIVATED';
export type EmailStatus = string;
export type ResourceType = 'door' | 'door_group';
export type BundleStatus = 'ACTIVE' | 'SUSPENDED';
export type BundleSource = 'google' | 'apple';
export type TouchPassStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE' | 'EXPIRED';
export type TouchPassUserStatus = 'ACTIVE' | 'PENDING' | 'UNLINK';

export type NfcCard = {
    id: string;
    token: string;
};

export type LicensePlate = {
    id: string;
    credential: string;
    credential_type: 'license';
    credential_status: CredentialStatus;
};

export type PinCode = {
    token: string;
};

export type AccessPolicy = {
    id: string;
    name: string;
    resources: Array<{
        type: ResourceType;
        id: string;
    }>;
    schedule_id: string;
};

export type TouchPassBundle = {
    bundle_id: string;
    bundle_status: BundleStatus;
    device_id: string;
    device_name: string;
    device_type: number;
    source: BundleSource;
};

export type TouchPass = {
    activated_at: string;
    card_id: string;
    card_name: string;
    expired_at: string;
    id: string;
    last_activity: string;
    status: TouchPassStatus;
    user_avatar: string;
    user_email: string;
    user_id: string;
    user_name: string;
    user_status: TouchPassUserStatus;
    bundles: TouchPassBundle[];
};

export type UbiquitiAccessUser = {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    alias: string;
    user_email: string;
    email_status: EmailStatus;
    phone: string;
    employee_number: string;
    onboard_time: number;
    nfc_cards: NfcCard[];
    license_plates: LicensePlate[];
    pin_code: PinCode;
    access_policy_ids: string[];
    access_policies: AccessPolicy[];
    status: UserStatus;
    touch_pass: TouchPass[];
};
