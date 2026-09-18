# South African registration and app installation

## What will change
- Add a South African ID number field to account creation.
- Validate all 13 digits, date of birth, citizenship digit, and checksum before allowing registration.
- Keep the full ID out of the community profile and database; retain only safe confirmation details in the private account metadata.
- Normalize South African mobile numbers to `+27` format and reject invalid local numbers.
- Keep email confirmation required, improve the confirmation message, and return confirmed members to Andzisa.
- Add a real **Install app** button on supported Android/desktop browsers, while showing the correct **Add to Home Screen** steps on iPhone.
- Keep the existing yellow “A” as every home-screen icon and preserve the current app features.

## Technical details
- Use the official South African ID structure and Luhn checksum for local validation; this confirms that the number is structurally valid, not that it belongs to the person entering it.
- Continue using Lovable Cloud email confirmation and the existing Google sign-in.
- Keep manifest-only installation because offline use was not requested; no service worker or offline cache will be added.
- Verify invalid/valid form behavior, manifest/icon availability, install controls, and mobile/desktop layout.
