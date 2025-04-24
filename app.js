// 1. Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. Your firebaseConfig (paste from console)
const firebaseConfig = {
  apiKey: "AIzaSyAhw7avqaiu7J0_6CdfLvHHmDKa9at-NjQ",
  authDomain: "my-crm-3d603.firebaseapp.com",
  projectId: "my-crm-3d603",
  storageBucket: "my-crm-3d603.firebasestorage.app",
  messagingSenderId: "896361101360",
  appId: "1:896361101360:web:735d8a9d7f38920b7cd5f5",
  measurementId: "G-Z0NKJLH2YT"
};

// 3. Initialize Firebase
const app    = initializeApp(firebaseConfig);
const auth   = getAuth(app);
const db     = getFirestore(app);

// 4. UI elements
const authUI    = document.getElementById("auth-container");
const crmUI     = document.getElementById("crm-container");
const emailIn   = document.getElementById("email");
const passIn    = document.getElementById("password");
const btnLogin  = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const contactsList = document.getElementById("contacts-list");
const fnIn      = document.getElementById("first-name");
const lnIn      = document.getElementById("last-name");
const btnAdd    = document.getElementById("btn-add");

// 5. Auth listeners
btnSignup.addEventListener("click", () =>
  createUserWithEmailAndPassword(auth, emailIn.value, passIn.value)
    .catch(console.error)
);
btnLogin.addEventListener("click", () =>
  signInWithEmailAndPassword(auth, emailIn.value, passIn.value)
    .catch(console.error)
);

onAuthStateChanged(auth, user => {
  if (user) {
    authUI.style.display = "none";
    crmUI.style.display  = "block";
    loadContacts();
  } else {
    authUI.style.display = "block";
    crmUI.style.display  = "none";
  }
});

// 6. Firestore operations
async function loadContacts() {
  contactsList.innerHTML = "";
  const snap = await getDocs(collection(db, "contacts"));
  snap.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().first} ${doc.data().last}`;
    contactsList.append(li);
  });
}

btnAdd.addEventListener("click", async () => {
  await addDoc(collection(db, "contacts"), {
    first: fnIn.value,
    last:  lnIn.value,
    createdAt: new Date()
  });
  fnIn.value = lnIn.value = "";
  loadContacts();
});
