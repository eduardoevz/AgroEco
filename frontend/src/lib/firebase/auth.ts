import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile as fbUpdateProfile,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from './config';
import { UserProfile, UserRole } from '@/types';
import { DEMO_USER } from '@/demo/mockData';

const DEMO_USER_KEY = 'agroeco_demo_user';

export async function registerUser(
  email: string,
  pass: string,
  name: string,
  role: UserRole = 'productor'
): Promise<UserProfile> {
  if (isDemoMode || !auth) {
    const newUser: UserProfile = {
      id: 'demo-user-' + Date.now(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
    }
    return newUser;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  try {
    await fbUpdateProfile(fbUser, { displayName: name });
  } catch (err) {
    console.warn('No se pudo actualizar displayName en Auth:', err);
  }

  const profile: UserProfile = {
    id: fbUser.uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      await setDoc(doc(db, 'users', fbUser.uid), profile);
    } catch (err) {
      console.warn('Advertencia al guardar perfil en Firestore (la cuenta de Auth se creó con éxito):', err);
    }
  }

  return profile;
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isDemoMode || !auth) {
    let user = DEMO_USER;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try {
          user = JSON.parse(stored);
        } catch {}
      } else {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
      }
    }
    return user;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  let profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0] || 'Productor',
    email: fbUser.email || email,
    role: 'productor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      } else {
        await setDoc(doc(db, 'users', fbUser.uid), profile);
      }
    } catch (err) {
      console.warn('Advertencia al consultar perfil en Firestore (se continúa con sesión de Auth):', err);
    }
  }

  return profile;
}

export function getAuthErrorMessage(err: any): string {
  const code = err?.code || '';
  const msg = err?.message || '';

  if (code === 'auth/unauthorized-domain') {
    return 'Dominio no autorizado en Firebase. Para permitir el acceso desde este dominio (ej: agroeco-oficial.vercel.app), agrégalo en Firebase Console -> Authentication -> Settings -> Dominios autorizados.';
  }
  if (code === 'auth/popup-blocked') {
    return 'El navegador bloqueó la ventana emergente de Google. Por favor habilita las ventanas emergentes (pop-ups) en tu navegador para continuar.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'La ventana de Google se cerró antes de completar la autenticación. Inténtalo nuevamente.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Se canceló la solicitud anterior de Google. Por favor haz clic de nuevo.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'El método de acceso (Google o Correo) no está habilitado en tu consola de Firebase (Authentication -> Sign-in method).';
  }
  if (code === 'auth/account-exists-with-different-credential') {
    return 'Ya existe una cuenta con este correo registrada mediante contraseña. Inicia sesión ingresando tus datos directamente.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'Este correo electrónico ya está registrado. Inicia sesión directamente.';
  }
  if (code === 'auth/weak-password') {
    return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
  }
  if (code === 'auth/invalid-email') {
    return 'El formato del correo electrónico no es válido.';
  }
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found'
  ) {
    return 'Credenciales incorrectas. Verifica tu correo y contraseña o regístrate si aún no tienes cuenta.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Fallo de conexión con el servidor. Revisa tu conexión a internet.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Demasiados intentos fallidos. Por seguridad, espera unos momentos antes de reintentar.';
  }
  return msg || 'Error en la autenticación. Por favor intenta de nuevo.';
}

export async function loginWithGoogle(): Promise<UserProfile> {
  if (isDemoMode || !auth) {
    let user = DEMO_USER;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try {
          user = JSON.parse(stored);
        } catch {}
      } else {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
      }
    }
    return user;
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const fbUser = result.user;

  let profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Productor',
    email: fbUser.email || '',
    ...(fbUser.phoneNumber ? { phone: fbUser.phoneNumber } : {}),
    role: 'productor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const docRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        profile = { ...profile, ...docSnap.data() } as UserProfile;
      } else {
        const dataToSave: Record<string, any> = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        };
        if (profile.phone) {
          dataToSave.phone = profile.phone;
        }
        await setDoc(docRef, dataToSave);
      }
    } catch (err) {
      console.warn('Advertencia al consultar/guardar perfil en Firestore:', err);
    }
  }

  return profile;
}

export async function logoutUser(): Promise<void> {
  if (isDemoMode || !auth) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    return;
  }
  await fbSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  if (isDemoMode || !auth) {
    return;
  }
  await fbSendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  const updatedAt = new Date().toISOString();
  if (isDemoMode || !db) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      const current = stored ? JSON.parse(stored) : DEMO_USER;
      const updated = { ...current, ...data, updatedAt };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
    }
    return;
  }

  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt,
    });
  } catch (err) {
    console.warn('Error al actualizar en Firestore, guardando en local:', err);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      const current = stored ? JSON.parse(stored) : DEMO_USER;
      const updated = { ...current, ...data, updatedAt };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
    }
  }
}

export function subscribeAuthState(
  callback: (user: UserProfile | null) => void
): () => void {
  if (isDemoMode || !auth) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch {
          callback(DEMO_USER);
        }
      } else {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
        callback(DEMO_USER);
      }
    } else {
      callback(DEMO_USER);
    }
    return () => {};
  }

  const firestoreDb = db;

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    let profile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Productor',
      email: fbUser.email || '',
      ...(fbUser.phoneNumber ? { phone: fbUser.phoneNumber } : {}),
      role: 'productor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (firestoreDb) {
      try {
        const snap = await getDoc(doc(firestoreDb, 'users', fbUser.uid));
        if (snap.exists()) {
          profile = { ...profile, ...snap.data() } as UserProfile;
        }
      } catch (err) {
        console.warn('Advertencia cargando documento de usuario en Firestore (se mantiene sesión activa de Auth):', err);
      }
    }

    // IMPORTANTE: Siempre entregar el perfil del usuario autenticado si fbUser existe
    callback(profile);
  });
}
