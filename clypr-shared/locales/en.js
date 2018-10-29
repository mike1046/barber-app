export default {

action_login: 'Login',
action_logout: 'Logout',
action_signup: 'Sign up',
action_confirm: 'Confirm',
action_save: 'Save',
action_delete: 'Delete',
action_cancel: 'Cancel',
action_search: 'Search',



login_email: 'Email',
login_password: 'Password',
login_submit: 'Login',
login_alt_button: 'Already have an account? Log in',
login_alt2_button: 'Know your password? Log in',
login_signup_button: 'Do not have an account? Sign up',
login_recovery_button: 'Forgot your password?',

signup_names: 'First and last names',
signup_email: 'Email address',
signup_password: 'Choose a password',
signup_password_repeat: 'Repeat password',
signup_role_checkbox: 'I am a barber',
signup_agree_with_tos: 'I agree with ',
signup_tos: 'Terms of Service',
signup_submit: 'Sign up',

tos_title: 'Terms of Service',
tos_accept: 'Accept',

recovery_email: 'Account email address',
recovery_submit: 'Receive Recovery Email',
recovery_success: 'You will receive an email to recover your password.',

notice_logged_out: 'Please login',



appointments_tab_title: 'Appointments',

appointments_actions_noshow: 'Charge No-Show',
appointments_actions_completed: 'Mark Completed',
appointments_actions_started: 'Client Arrived',
appointments_actions_reschedule: 'Reschedule',
appointments_actions_review: 'Review Barber',
appointments_actions_book: 'Book',
appointments_actions_bookAgain: 'Book Again',
appointments_actions_details: 'Details',

appointment_action_noshow_title: 'Is this a no-show?',
appointment_action_noshow_desc: 'Did your client missed the appointment?',
appointment_action_noshow_cancel: 'No',
appointment_action_noshow_confirm: 'Yes, confirm',

appointment_action_cancel_title: 'Cancel Appointment?',
appointment_action_cancel_charge: 'Your deposit will be charged $__AMOUNT__ due to late cancelling. The remaining amount will be refunded.',
appointment_action_cancel_noCharge: 'Your deposit will be fully refunded.',
appointment_action_cancel_close: 'No',
appointment_action_cancel_accept: 'Confirm',

appointment_action_reschedule_title: 'Reschedule Appointment?',
appointment_action_reschedule_firstTime: 'You can reschedule once without penalty. Do you want to continue?',
appointment_action_reschedule_secondTime: 'You have already rescheduled once. You will be charged 50% as a penalty this time. Do you want to continue?',
appointment_action_reschedule_close: 'No',
appointment_action_reschedule_accept: 'Yes, continue',

appointments_status_scheduled: 'Appointment is scheduled',
appointments_status_scheduledPast: 'Waiting to be started',
appointments_status_started: 'Waiting to be completed',
appointments_status_cancelled: 'Appointment was cancelled',
appointments_status_noshow: 'Appointment missed',
appointments_status_completed: 'Service completed',
appointments_status_unknown: 'Unknown status',

appointments_create_view_title: 'Book',
appointments_create_title_service: 'Choose a service',
appointments_create_title_hour: 'Choose Time',
appointments_create_services_empty: 'This barber has no services available.',
appointments_create_services_all: 'See All Services',
appointments_create_hours_error1: 'Could not load available hours',
appointments_create_hours_loading: 'Loading available hours...',
appointments_create_hours_empty: 'No available hours.',
appointments_create_priceItems_service: 'Service',

appointments_details_view_title: 'Details',
appointments_details_view_title_alt: 'Appointment',
appointments_details_title_services: 'Services',
appointments_details_title_review: 'Your Review',
appointments_details_title_billing: 'Bill',
appointments_details_title_payments: 'Payments',

appointments_list_empty: 'No appointments.',
appointments_list_notes_cancelled: 'Cancelled',
appointments_list_filter_future: 'Upcoming',
appointments_list_filter_past: 'Past',

appointment_action_no_payment_source_title: 'No Credit Card Configured',
appointment_action_no_payment_source_desc: 'Would you like to configure one now?',
appointment_action_no_payment_source_cancel: 'Maybe Later',
appointment_action_no_payment_source_confirm: 'Sure',


barbers_search_tab_title: 'Search',
barbers_list_empty: 'No barbers found.',
barbers_search_field: 'Search by name or city',
barbers_filter_button: 'Filter',
barbers_filter_title: 'Filter Results',
barbers_filter_sorting: 'Sort by',
barbers_filter_distance: 'Distance',
barbers_filter_distance_max: 'Max Distance',
barbers_filter_distance_unlimited: 'Unlimited',
barbers_filter_price: 'Price',
barbers_filter_rating: 'Rating',

barber_profile_view_title: 'Barber',
barber_profile_tab_shop: 'Shop',
barber_profile_tab_gallery: 'Gallery',
barber_profile_tab_reviews: 'Reviews',
barber_profile_tab_reviews_empty: 'No reviews yet.',
barber_profile_empty: 'No barber details yet.',
barber_profile_unknown: 'Barber not found.',
barber_profile_action_appointment: 'Create Appointment',

barber_review_view_title: 'Review',
barber_review_title: 'How was your experience?',
barber_review_aspect_customer: 'Customer service',
barber_review_aspect_time: 'Punctuality',
barber_review_aspect_haircut: 'Haircut quality',
barber_review_tip: 'Leave a tip for the barber',
barber_review_tip_cash: 'I did leave in cash',
barber_review_tip_custom: 'custom',
barber_review_text: 'Leave your opinion',
barber_review_submit: 'Send Review',



clients_tab_title: 'Clients',
client_history_view_title: 'History',
client_profile_preferred_button: 'Preferred Client',
client_profile_preferred_desc: 'Maybe an explanation about it here.',
client_profile_history_empty: 'No appointments yet.',
client_list_empty: 'No clients yet.',



settings_tab_title: 'Settings',

settings_edit_title_profile: 'PROFILE',
settings_edit_profile: 'Name and Photo',
settings_edit_profile_title: 'Edit Profile',
settings_edit_profile_name: 'First and last name',
settings_edit_profile_error1: 'Failed to upload your image',
settings_edit_profile_error2: 'Error uploading your image',

settings_edit_preview: 'Profile Preview',
settings_connect_stripe: 'Connect Stripe',

settings_edit_gallery: 'Photo Gallery',
settings_edit_gallery_delete_title: 'Remove?',
settings_edit_gallery_delete_desc: 'Delete this image from gallery?',
settings_edit_gallery_empty: 'Add photos from your best cuts.',
settings_edit_gallery_addItem: 'Add Photo',

settings_edit_address: 'Address',
settings_edit_address_title: 'Edit Address',
settings_edit_address_tip: 'Where will clients meet you?',
settings_edit_address_input_shopName: 'Shop Name',
settings_edit_address_input_street: 'Street',
settings_edit_address_input_street2: 'Street 2',
settings_edit_address_input_city: 'City',
settings_edit_address_input_state: 'State',
settings_edit_address_input_stateSelect:'Choose your state',
settings_edit_address_input_zipcode: 'Zipcode',
settings_edit_address_input_timezoneSelect: 'Time Zone',

settings_edit_title_shop: 'SHOP',

settings_edit_services: 'Offered Services',
settings_edit_services_title: 'Edit Service',
settings_edit_services_empty: 'Add offered services in your barber shop.',
settings_edit_services_addItem: 'Add Service',
settings_edit_services_tip: 'What can clients choose?',
settings_edit_services_input_label: 'Service name',
settings_edit_services_input_desc: 'Description',
settings_edit_services_input_price: 'Price',
settings_edit_services_input_duration: 'Duration',
settings_edit_services_input_duration_label: 'minutes',
settings_edit_services_error1: 'Minimum price is',

settings_edit_hours: 'Open Hours',
settings_edit_hours_title: 'Shop Hours',
settings_edit_hours_tip: 'When is your shop open?',
settings_edit_hours_timePick: 'Pick a time',
settings_edit_hours_closed: 'Closed',
settings_edit_hours_preferred: 'Exclusive for Preferred Clients',
settings_edit_hours_addItem: 'Add Interval',

settings_edit_title_payments: 'PAYMENTS',
settings_edit_cards: 'Payment Methods',
settings_edit_payout_methods: 'Payout Methods',
settings_edit_payments: 'Payment History',

settings_edit_title_account: 'ACCOUNT',

settings_edit_password: 'Change Password',
settings_edit_password_input_old: 'Type your current password',
settings_edit_password_input_new: 'Type a new password',
settings_edit_password_input_repeat: 'Repeat new password',
settings_edit_password_error1: 'New password does not match.',

settings_deleteAccount_button: 'Delete Account',
settings_deleteAccount_message: 'Your account will be deleted forever.',
settings_deleteAccount_password: 'Type your password',
settings_deleteAccount_submit: 'Delete My Account',

settings_share_title: 'SHARE',
share_barbers: 'Invite Barbers',
share_clients: 'Invite Friends',

invitation_barbers_email_subject: 'Try Clypr for Barbers',
invitation_barbers_email_body: 'Come install Clypr: http://www.clypr.net',

invitation_clients_email_subject: 'Try Clypr for your next cut',
invitation_clients_email_body: 'Come install Clypr: http://www.clypr.net',

settings_about_title: 'ABOUT',
settings_about_faq: 'FAQ',
settings_about_tos: 'Terms of Service',
settings_about_privacy: 'Privacy Policy',

settings_contact_view_title: 'Contact',
settings_contact_title: 'Contact Support',
contact_confirmation_title: 'Thank you!',
contact_confirmation_message: 'We will be in touch as soon as possible.',
contact_title: 'How can we help you?',
contact_form_text: 'Type your message',
contact_submit: 'Send Message',

revenue_open_account: 'Open Account',
revenue_account_title: 'Your Account',

shop_hours_closed: 'Closed',

mediaGallery_item_view_title: 'Photo',
mediaGallery_empty: 'No photos yet.',

payment_status_title: 'Payment',
payment_list_empty: 'No payments made yet.',

revenue_tab_title: 'Revenue',



weekdays_short_sun: 'Sun',
weekdays_short_mon: 'Mon',
weekdays_short_tue: 'Tue',
weekdays_short_wed: 'Wed',
weekdays_short_thu: 'Thu',
weekdays_short_fri: 'Fri',
weekdays_short_sat: 'Sat',

weekdays_long_sun: 'Sunday',
weekdays_long_mon: 'Monday',
weekdays_long_tue: 'Tuesday',
weekdays_long_wed: 'Wednesday',
weekdays_long_thu: 'Thursday',
weekdays_long_fri: 'Friday',
weekdays_long_sat: 'Saturday',

time_minutes: 'minutes',
time_interval_to: 'to',

unities_miles : 'miles',
form_field_error: 'Please fill all fields',
account_error1: 'You must be logged in',

source_list_empty: 'No cards configured',
action_add_source: 'Add New Card...',
payment_source_last4: 'Ending in __LAST4__',


pending_list_heading: 'Pending Balance',
pending_balance_list_empty: 'No pending balance',

available_list_heading: 'Available Balance',
available_balance_list_empty: 'No available balance',
balance_row_text: '$__AMOUNT__ __CURRENCY__',

transactions_heading: 'Transactions',
transactions_list_empty: 'No transactions found',
transaction_row_text: '$__AMOUNT__ __CURRENCY__',
transaction_date: '__DATE__',

bank_account_list_empty: 'No bank account configured',
action_add_bank_account: 'Add bank account',
bank_account_last4: 'Ending in __LAST4__',

add_bank_account_title: 'Add Account',
add_bank_account_button: 'Add'

};
