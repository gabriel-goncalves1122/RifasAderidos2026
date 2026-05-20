// ============================================================================
// ARQUIVO: src/config/firebase.ts
// ============================================================================
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// ============================================================================
// CONFIGURAÇÃO FIREBASE
// ============================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rifasaderidos2026",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "rifasaderidos2026.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:000000000000:web:0000000000000000000000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ============================================================================
// EMULADORES LOCAIS
// ============================================================================

declare global {
  interface Window {
    __FIREBASE_EMULATORS_CONNECTED__?: boolean;
  }
}

if (import.meta.env.DEV && !window.__FIREBASE_EMULATORS_CONNECTED__) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });

  connectFirestoreEmulator(db, "127.0.0.1", 8080);

  connectStorageEmulator(storage, "127.0.0.1", 9199);

  window.__FIREBASE_EMULATORS_CONNECTED__ = true;

  console.log("🔌 Firebase Client conectado aos Emuladores Locais");
  console.log("✅ Auth Emulator: http://127.0.0.1:9099");
  console.log("✅ Firestore Emulator: 127.0.0.1:8080");
  console.log("✅ Storage Emulator: 127.0.0.1:9199");
}
