import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://shopping-list-dab7a-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const adminBtn = document.getElementById("admin-btn");
const adminPass = document.getElementById("admin-pass");

// افزودن آیتم به دیتابیس
if (addButtonEl) {
    addButtonEl.addEventListener("click", function() {
        let inputValue = inputFieldEl.value;
        if (inputValue.trim() !== "") {
            push(shoppingListInDB, inputValue);
            inputFieldEl.value = "";
        }
    });
}

// بخش مدیریت (بدون استفاده از eval یا توابع ناامن)
if (adminBtn) {
    adminBtn.addEventListener("click", function() {
        if (adminPass.value === "1234") {
            alert("خوش آمدید مدیر");
            // در اینجا می‌توانید توابع مدیریتی را صدا بزنید
        } else {
            alert("رمز عبور اشتباه است");
        }
    });
}

// نمایش زنده لیست از فایربیس
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        
        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "<p style='text-align:center; color:#888;'>لیست خالی است...</p>";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    
    // حذف با دو بار کلیک (مخصوص مدیریت)
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
    
    shoppingListEl.append(newEl);
}