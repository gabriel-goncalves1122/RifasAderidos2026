const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

admin.initializeApp({ projectId: "demo-rifasaderidos2026" });
const auth = admin.auth();

async function check() {
  try {
    const user = await auth.getUserByEmail("gabrielsampaio059@gmail.com");
    console.log("Auth claims for gabrielsampaio059@gmail.com:", user.customClaims);
  } catch (err) {
    console.error("User not found in Auth Emulator:", err.message);
  }
}
check();
