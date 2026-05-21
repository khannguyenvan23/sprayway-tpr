import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const firebaseAuth = require("C:/Users/Admins/AppData/Roaming/npm/node_modules/firebase-tools/lib/auth.js");

const account = firebaseAuth.getGlobalDefaultAccount();
if (!account?.tokens?.refresh_token) {
  throw new Error("Firebase CLI is not logged in.");
}

const token = await firebaseAuth.getAccessToken(account.tokens.refresh_token, [
  "email",
  "openid",
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/cloudplatformprojects.readonly",
  "https://www.googleapis.com/auth/firebase",
]);

process.stdout.write(token.access_token);
