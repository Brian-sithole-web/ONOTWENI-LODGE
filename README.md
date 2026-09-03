# Onothweni Lodge

Premium accommodation website for **Onothweni Lodge** in Manguzi, KwaZulu-Natal. The public site is a calm, photography-led lodge experience. Guests can search availability, sign in with Google, and request a stay. Administrators manage rooms, prices, blocked dates, and booking status.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

Until Firebase is configured, the site runs in preview mode with local storage. On the Login page you can continue as a guest or as an administrator to review the full booking and admin experience.

## Connect Google sign-in (Firebase)

1. Create a Firebase project.
2. Enable **Authentication → Google**.
3. Create a **Firestore** database and enable **Storage**.
4. Copy `.env.example` to `.env`.
5. Fill in the `VITE_FIREBASE_*` values from the Firebase console.
6. Deploy the security rules:

```bash
firebase deploy --only firestore:rules,storage
```

7. After the first administrator signs in with Google, open Firestore and set that user’s `users/{uid}.role` field to `admin`. Do this in the Firebase console so guests cannot grant themselves administrator access.

## What administrators should configure first

- Room prices and number of units
- Contact email, phone, and WhatsApp (the WhatsApp button only appears once a number is saved)
- Gallery photography (replace the placeholder images)
- Cancellation notice period and lodge policies

Contact details, prices, and business statistics are never invented in the public site. Empty fields stay empty until they are saved in **Admin → Settings** or **Admin → Rooms**.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview the production build
