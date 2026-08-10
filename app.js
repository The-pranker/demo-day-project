/* do this later
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDG5eBp5V5oKfWKty1C-b_mEpRGucWMJfM",
    authDomain: "fir-day-b2659.firebaseapp.com",
    projectId: "fir-day-b2659",
    storageBucket: "fir-day-b2659.firebasestorage.app",
    messagingSenderId: "956958082403",
    appId: "1:956958082403:web:3c85ea9f3a54ff792fff56",
    measurementId: "G-HQ3TDQS9BL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  //Initialize Firebase Authentication service
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("register_button");


registerButton.addEventListener("click", (event) => {
  event.preventDefault(); 

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please enter both an email and a password.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registration successful! Account created for: " + userCredential.user.email);
      emailInput.value = "";
      passwordInput.value = "";
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });

});

*/