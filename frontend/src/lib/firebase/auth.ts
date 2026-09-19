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
    phone: fbUser.phoneNumber || undefined,
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
      phone: fbUser.phoneNumber || undefined,
      role: 'productor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (firestoreDb) {
      try {
        const snap = await getDoc(doc(firestoreDb, 'users', fbUser.uid));
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('Advertencia cargando documento de usuario en Firestore (se mantiene sesión activa de Auth):', err);
      }
    }

    // IMPORTANTE: Siempre entregar el perfil del usuario autenticado si fbUser existe
    callback(profile);
  });
}
