// ============================================================================
// ARQUIVO: frontend/src/shared/config/firebase.ts
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

function obterHostEmulador() {
  const hostname = window.location.hostname;

  // Quando estiver acessando no próprio PC por localhost, use localhost.
  // Isso evita problemas de CORS/WebChannel do Firestore no navegador do PC.
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "127.0.0.1";
  }

  // Quando estiver acessando pelo celular, o hostname será o IP do PC.
  // Exemplo: 192.168.0.123
  return hostname;
}

const deveUsarEmuladores =
  import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

if (deveUsarEmuladores && !window.__FIREBASE_EMULATORS_CONNECTED__) {
  const emulatorHost = obterHostEmulador();

  const authPort = Number(
    import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || 9099,
  );

  const firestorePort = Number(
    import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8080,
  );

  const storagePort = Number(
    import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_PORT || 9199,
  );

  connectAuthEmulator(auth, `http://${emulatorHost}:${authPort}`, {
    disableWarnings: true,
  });

  connectFirestoreEmulator(db, emulatorHost, firestorePort);

  connectStorageEmulator(storage, emulatorHost, storagePort);

  window.__FIREBASE_EMULATORS_CONNECTED__ = true;

  console.log("🔌 Firebase Client conectado aos Emuladores Locais");
  console.log(`✅ Auth Emulator: http://${emulatorHost}:${authPort}`);
  console.log(`✅ Firestore Emulator: ${emulatorHost}:${firestorePort}`);
  console.log(`✅ Storage Emulator: ${emulatorHost}:${storagePort}`);
}
