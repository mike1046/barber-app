// @flow
/** Defines the data model used by Clypr app */

/** Stores repeated information about an appointment to improve database performance. */
export type UserAppointment = {
  id: string;
  date: number; // Date as UNIX time (on UTC timezone, seconds only, no miliseconds)
  clientId?: string; // Used to know which clients a barber has
};

/** Represents a public user profile. */
export type UserProfile = {
  name: string;
  avatarUrl: string;
};

/** Represents a profile specific for a barber's client. */
export interface BarberClient extends UserProfile {
  id?: string;
  isFavorite: boolean;
};

/** Custom data associated with a user account, separated from Firebase login information. */
export type UserRole = 'barber' | 'client';
export type User = {
  id: string;
  role: UserRole;

  profile: {
    // Only the information below is public to all users
    name: string;
    avatarUrl: string;
  };

  mediaGallery?: {
    type: 'photo';
    url: string;
    madeByBarberId?: string;
    fromAppointmentId?: string;
  }[];

  // A client can have favorite barbers. A barber can mark clients as preferred.
  favoriteIds?: { [id: string]: boolean };

  pushTokens?: {
    type: string;
    token: string;
  }[];

  appointments: UserAppointment[];

  authorization?: StripeAuthorization;
};

/** A payment method associated with a user. */
export type PaymentMethod = {
  id: string;
  userId: string;
  type: string;
  info: any; // Depends on type
  status: 'active' | 'failed' | 'deleted';
};

/** A payment operation started by a user to a barber. */
export type Payment = {
  id: string;
  fromUserId: string;
  toBarberId: string;
  amount: number;
  currency: string;
  status: 'processing' | 'failed' | 'cancelled' | 'completed' | 'refunded';
  createdAt: string; // Date as UTC ISO string
  completedAt: string; // Date as UTC ISO string

  details?: {
    appointmentId?: string;
    note?: string;
  },

  paymentSource: StripeCard;
  receiptDetails: any; // Depends on payment method and processor
};

/** An address with detailed information. */
export type EncodedAddress = {
  shopName: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zipcode: string;
  timezone?: string; // Moment.js timezone name
};

/** Shop's hours per weekday. */
export type WeekDays = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type ShopHours = {
  [weekday: WeekDays]: {
    from: string; // Hour in 23:59 format
    to: string; // Hour in 23:59 format
    restricted?: boolean; // True if hour interval is only for preferred clients
  }[];
};

/** A service offered by a barber. */
export type BarberService = {
  id: string;
  label: string;
  desc: string;
  durationInMinutes: number;
  price: number;
};

export type Media = {
  type: 'photo';
  url: string;
};

/** Ratings used inside a review. */
export type BarberReviewRatings = {
  haircutQuality: number;
  customerServiceQuality: number;
  barberPunctuality: number;
};

/** A review made by a client after an appointment is completed. */
export type BarberReview = {
  id: string;
  authorId: string;
  barberId: string;
  fromAppointmentId: string;
  createdAt: string; // Date as UTC ISO string

  ratings: BarberReviewRatings;
  stars: number; // The average of all rated items
  text?: string;
  tip?: number;
};

/** A barber profile, owned by a user with 'barber' role. */
export type Barber = {
  // All information below is public
  id: string;
  ownerUserId: string;
  rating: number; // Can not be updated by user

  mediaGallery: Media[];

  profile: UserProfile;
  shop?: {
    hours?: ShopHours;
    address?: EncodedAddress;
    position?: { lat: number, lng: number };
  };

  acceptedPaymentMethods: {
    inAppPayment: boolean;
  };

  services: BarberService[];
  averagePrice: number;

  // Preloaded information not stored on database
  reviews?: BarberReview[];
  distance?: string;

  account: StripeAccount;
};

/** An scheduled appointment to visit a barber made by a client. */
export type Appointment = {
  id: string;
  clientId: string;
  barberId: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'noshow' | 'completed-and-reviewed' | 'started';
  urgent: boolean; // API must check past urgent appointments to limit its rate

  date: string; // Date as ISO string, in barber shop local time
  _dateUTC?: number; // Unix time in seconds in UTC, for sorting appointments with different time zones

  requestedServicesIds: string[]; // Among services listed in Barber.services
  reviewId?: string; // Id of BarberReview created for this appointment
  rescheduled?: boolean; // If this appointment was rescheduled at least once

  billing: {
    // List all charges, including discounts
    charges: {
      label: string;
      amount: number;
      type: 'service' | 'platform';
      currency?: string;
    }[];

    grandTotal: number;
    status: 'pending' | 'paid';
    paymentIds: string[]; // List of Payments created to pay for this bill
  };

  // Data preloaded by API during response, but not stored on database.
  client?: User;
  barber?: Barber;
  services?: BarberService[];
  payments?: Payment[];
  review?: BarberReview;
};

/** Stores busy time slots on a barber's schedule, for a specific date. */
export type BarberSchedule = {
  [hour: string]: boolean;  // A 24-hour format, such as "13:00"
};

/** Stores Payment card information */
export type StripeCard = {
  id: string;
  isDefault: boolean;
  brand: string;
  last4: string;
  brandImage: any;
};

export type StripeSource = {
  tokenId: string;
  created: number;
  livemode: boolean;
  card?: StripeCard;
};

export type StripeBalanceTransaction = {
  currency: string;
  amount: number;
}

export type StripeBalance = {
  object: 'balance';
  livemode: boolean;
  available: ?StripeBalanceTransaction[],
  connect_reserved: ?StripeBalanceTransaction[],
  pending: ?StripeBalanceTransaction[],
}

export type StripeFeeDetail = {
  amount: number;
  application: ?string;
  currency: string;
  description: string;
  type: 'application_fee' | 'stripe_fee' | 'tax';

}
export type StripeTransaction = {
  id: string;
  object: 'balance_transaction';
  amount: number;
  available_on: number;
  created: number;
  currency: string;
  description: string;
  fee: number;
  fee_details: StripeFeeDetail[];
  source: string;
  status: 'available' | 'pending';
  type: 'adjustment' | 'application_fee' | 'application_fee_refund' | 'charge' | 'payment' | 'payment_failure_refund' | 'payment_refund' | 'refund' | 'transfer' | 'transfer_refund' | 'payout' | 'payout_cancel' | 'payout_failure' | 'validation' | 'stripe_fee';
}

export type StripeAccountKeys = {
  publishable: string;
  secret: string;
}

export type AccountMetadata = {
  uid: string;
}

export type StripeExternalAccount = {
  data: any
}

export type BankAccountDetails = {
  accountNumber: string;
  countryCode: string;
  currency: string;
  routingNumber: ?string;
  accountHolderName: ?string;
  accountHolderType: 'individual' | 'company'
}

export type BankAccountMetadata = {}

export type StripeBankAccount = {
  id: string;
  object: 'bank_account';
  account: string;
  account_holder_name: string;
  account_holder_type: 'individual' | 'company';
  bank_name: string;
  country: string;
  customer: string;
  default_for_currency: boolean;
  last4: string;
  metadata: BankAccountMetadata;
  routing_number: string;
  status: 'new' | 'validated' | 'verified' | 'verification_failed' | 'errored'
}

export type StripeAccount = {
  id: string;
  object: 'account';
  business_name: ?string;
  business_url: ?string;
  charges_enabled: boolean;
  country: string;
  created: number;
  debit_negative_balances: boolean;
  default_currency: string;
  details_submitted: boolean;
  display_name: string;
  email: string;
  keys: StripeAccountKeys;
  metadata: AccountMetadata;
  external_accounts: ?StripeExternalAccount[];
  payouts_enabled: boolean;
  statement_descriptor: string;
  timezone: string;
  type: 'stardard' | 'express' | 'custom'
}

export type StripeLoginLink = {
  object: 'login_link';
  created: number;
  url: string;
}

export type StripeAuthorization = {
  access_token: string;
  livemode: boolean;
  refresh_token: string;
  scope: string;
  stripe_publishable_key: string;
  stripe_user_id: string;
  token_type: string;
}

export type BillingAddress = {

  name: string; // - The user’s full name (e.g. "Jane Doe").
  line1: string; // - The first line of the user’s street address (e.g. "123 Fake St").
  line2: string; // - The apartment, floor number, etc of the user’s street address (e.g. "Apartment 1A").
  city: string; // - The city in which the user resides (e.g. "San Francisco").
  state: string; // - The state in which the user resides (e.g. "CA").
  postalCode: string; //  - The postal code in which the user resides (e.g. "90210").
  country: string; // - The ISO country code of the address (e.g. "US").
  phone: string; // - The phone number of the address (e.g. "8885551212").
  email: string; // - The email of the address (e.g. "jane@doe.com")
};

export type PrefilledInformation = {
  email: string;
  phone: string;
  billingAddress: BillingAddress
};

export type Theme = {
  primaryBackgroundColor: string;   // - The primary background color of the theme.
  secondaryBackgroundColor: string; // - The secondary background color of this theme.
  primaryForegroundColor: string; // - The primary foreground color of this theme. This will be used as the text color for any important labels in a view with this theme (such as the text color for a text field that the user needs to fill out).
  secondaryForegroundColor: string; // - The secondary foreground color of this theme. This will be used as the text color for any supplementary labels in a view with this theme (such as the placeholder color for a text field that the user needs to fill out).
  accentColor: string;    // - The accent color of this theme - it will be used for any buttons and other elements on a view that are important to highlight.
  errorColor: string; // - The error color of this theme - it will be used for rendering any error messages or view.
};

export type PaymentRequestWithCardOptions = {
  requiredBillingAddressFields: 'full' | 'zip';
  prefilledInformation?: PrefilledInformation;
  managedAccountCurrency?: string;
  smsAutofillDisabled?: boolean;
  theme?: Theme
}

export type NotificationMessageAlert = {
  title: string;
  body: string;
}

export type NotificationMessage = {
  type: string;
  aps?: { alert: NotificationMessageAlert }
}