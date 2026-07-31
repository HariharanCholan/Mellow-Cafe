const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Ensure private key exists
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ Missing FIREBASE_PRIVATE_KEY in .env");
  process.exit(1);
}

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID
  })
});

module.exports = getAuth();
