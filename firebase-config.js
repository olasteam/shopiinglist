import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdg0Lh2__cclubjsVj6Af_2WY4Fvh-4rY",
  authDomain: "shopping-list-dab7a.firebaseapp.com",
  databaseURL: "https://shopping-list-dab7a-default-rtdb.firebaseio.com",
  projectId: "shopping-list-dab7a",
  storageBucket: "shopping-list-dab7a.appspot.com",
  messagingSenderId: "338914614138",
  appId: "1:338914614138:web:0f7921a4f40f0f32140f3b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };