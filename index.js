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

// درخواست اجازه برای نوتیفیکیشن
if ("Notification" in window) {
    Notification.requestPermission();
}

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    if (inputValue.trim() !== "") {
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
        
        // ارسال نوتیفیکیشن هنگام اضافه کردن
        if (Notification.permission === "granted") {
            new Notification("رستوران نور", {
                body: `آیتم "${inputValue}" به لیست اضافه شد.`,
                icon: "icon.png" // اگر آیکون داری آدرسش را اینجا بگذار
            });
        }
    }
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        
        clearShoppingListEl();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "<p style='color: #888; text-align: center;'>لیست خرید در حال حاضر خالی است...</p>";
    }
}, {
    onlyOnce: false
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    
    // نگه داشتن طولانی یا دو بار کلیک برای حذف (مناسب موبایل)
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
    
    shoppingListEl.append(newEl);
}