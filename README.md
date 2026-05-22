# FamilyDiary

FamilyDiary is a beginner-friendly React Native + Firebase starter app for a family of 5. It uses Expo for easy local development, Firebase Authentication for email/password sign-in, and Cloud Firestore for real-time shared family events.

## Features

- Email/password sign-in with Firebase Authentication
- Shared event list that updates in real time for every family member
- Add, edit, and delete events from any signed-in family device
- Event details include title, date, time, location, notes, and attendees
- Native share sheet support so an event can be sent to WhatsApp or any other app
- Warm, family-friendly styling with soft blues and greens

## Project structure

```text
FamilyDiary/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── src/
│   ├── components/
│   │   ├── EventCard.js
│   │   └── EventForm.js
│   ├── constants/
│   │   └── familyMembers.js
│   ├── firebase/
│   │   ├── auth.js
│   │   ├── config.js
│   │   └── events.js
│   └── screens/
│       ├── AddEventScreen.js
│       ├── EditEventScreen.js
│       ├── HomeScreen.js
│       └── LoginScreen.js
```

## Before you start

You need:

- Node.js LTS installed from [https://nodejs.org](https://nodejs.org)
- A free Firebase account
- The Expo Go app on your iPhone from the App Store

## Step 1: Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

## Step 2: Create your Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Create a project**
3. Give it a name such as `FamilyDiary`
4. You can leave Google Analytics off for this starter app if you want
5. Wait for Firebase to create the project

## Step 3: Add a web app inside Firebase

1. In your Firebase project, click the **</> Web** icon to add an app
2. Give the app a name like `FamilyDiaryApp`
3. Click **Register app**
4. Firebase will show you a config object with values such as `apiKey`, `authDomain`, and `projectId`
5. Keep that page open because you will paste those values into this project

## Step 4: Turn on Authentication

1. In Firebase, open **Build > Authentication**
2. Click **Get started**
3. Open the **Sign-in method** tab
4. Enable **Email/Password**
5. Save your changes

## Step 5: Create Firestore Database

1. In Firebase, open **Build > Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** or **test mode** while learning
4. Pick the region closest to your family
5. Finish setup

For a simple family-only starter, make sure signed-in users can read and write events. Example Firestore rules while you are getting started:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Add your Firebase config to `app.json`

Open `/home/runner/work/FamilyDiary/FamilyDiary/app.json` and replace the placeholder values under `expo.extra.firebase`:

```json
"extra": {
  "firebase": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
    "projectId": "YOUR_PROJECT_ID",
    "storageBucket": "YOUR_PROJECT_ID.firebasestorage.app",
    "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
    "appId": "YOUR_APP_ID"
  }
}
```

Paste in the real values from Firebase.

## Step 7: Start the app

Run:

```bash
npx expo start
```

This opens the Expo developer tools in your terminal/browser.

## Step 8: Open it on your iPhone with Expo Go

1. Make sure your iPhone and computer are on the same Wi-Fi network
2. Open **Expo Go** on your iPhone
3. Scan the QR code shown by Expo
4. The app should open on your phone

## Step 9: Create accounts for your family

- Use the **Create account** option in the app for each family member
- After that, each person can sign in with email and password
- Every signed-in family member can add, edit, delete, and share events

## How the event sharing works

Each event card has a **Share** button. Tapping it opens the native iPhone/Android share sheet so you can send the event text to WhatsApp or any other app.

## Helpful scripts

```bash
npm run start   # Start Expo
npm run web     # Open the app in a web browser
npm run check   # Build a web export to verify the project bundles
```

## Notes

- This starter app is designed for a family of five and includes five default family member labels
- You can change the names in `/home/runner/work/FamilyDiary/FamilyDiary/src/constants/familyMembers.js`
- Firebase config values are project-specific, so do not commit private environment overrides unless you mean to share them
