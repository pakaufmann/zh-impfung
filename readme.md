# ZH-Impfung

Azure function to poll the vaccination page of Zurich and check if a group has been activated.

If activated, send an SMS through Twilio to the configured number.

Needs the following configured env vars:

* ACCOUNT_SID: account SID from Twilio
* AUTH_TOKEN: Auth-Token from Twilio
* FROM_NUMBER: The phone number from Twilio
* TO_NUMBER: The phone number to send the SMS to
* GROUP_TO_CHECK: The group to check (A-T)