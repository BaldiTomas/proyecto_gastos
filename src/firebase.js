import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: "AIzaSyActD8zMydD8vdmFPv7AJDC-WqRj2cEGWM",
  authDomain: "gestion-de-gastos-b4506.firebaseapp.com",
  projectId: "gestion-de-gastos-b4506",
  storageBucket: "gestion-de-gastos-b4506.appspot.com",
  messagingSenderId: "564066592200",
  appId: "1:564066592200:web:8caff55c2b77f4fe5bccfd"
};

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)

export { database, auth }
