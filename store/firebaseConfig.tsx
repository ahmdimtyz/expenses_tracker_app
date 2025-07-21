// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,    // ← swap in initializeFirestore
  collection,
  query,
  orderBy,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyD0_HjJS7fwR_WiUf6KTmTmCjflf9tZ0Wc",
  authDomain: "budget-tracking-c1848.firebaseapp.com",
  databaseURL: "https://budget-tracking-c1848-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "budget-tracking-c1848",
  storageBucket: "budget-tracking-c1848.firebasestorage.app",
  messagingSenderId: "737585255238",
  appId: "1:737585255238:web:0c9a7432d61ce1c1cf4b47",
  measurementId: "G-5NXEKR5NF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Force XHR long-polling and disable fetch streams
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const expensesCol   = collection(db, 'expenses');
export const expensesQuery = query(expensesCol, orderBy('date', 'desc'));
export const expenseDoc    = (id: string) => doc(expensesCol, id);

export { onSnapshot, addDoc, setDoc, deleteDoc };