# Finish the Andzisa mobile app

## Goal
Turn the current registration screen into a complete, mobile-first community safety app that people can install free on iPhone and Android from a link.

## What will be built
- Preserve the Andzisa name and green/gold visual identity.
- Replace the yellow “A” with a newly created, original face-only logo and matching app icon.
- Remove every occurrence of “Sagwadi” from visible app content and metadata.
- Create account registration and sign-in, followed by a member profile.
- Add member profiles with a transparent five-star peer rating and rating history.
- Add private one-to-one conversations with a clear inbox and chat screen.
- Add report and block actions on member profiles and conversations.
- Add a compact mobile navigation for Profile, Messages, and Safety.
- Add install support so the app can be added to an iPhone or Android home screen without an app-store fee.

## Safety and trust
- Use Lovable Cloud for accounts and app data.
- Keep profiles, ratings, messages, reports, and blocks protected by signed-in access rules.
- Prevent members from rating themselves.
- Hide blocked members and prevent new messages between blocked accounts.
- Keep reports private and never expose them to the reported member.

## Technical details
- Build the existing project as an installable Progressive Web App (PWA), which works from a link on iPhone and Android.
- Add the web app manifest, icons, mobile display settings, and offline app shell.
- Use separate mobile screens for authentication, profile, member details, inbox, conversation, and safety controls.
- Add route-specific page titles and sharing descriptions.
- Verify registration, profile ratings, messaging, reporting, blocking, and installation presentation at phone and desktop sizes.

## Scope note
This delivers a free installable app from a web link. Publishing through Apple’s App Store or Google Play is not included because those stores require separate developer accounts and review processes.
