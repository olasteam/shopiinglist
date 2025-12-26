// Version 1.1 - Update for Mobile
import { database } from "./firebase-config.js";
import { ref, push, onValue, remove, update, onChildAdded } from "firebase/database";

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const adminPassEl = document.getElementById("admin-pass");
const loginBtnEl = document.getElementById("login-btn");

let isManager = false;
const managerPassword = "123"; 

const shoppingListInDB = ref(database, "items");

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

loginBtnEl.addEventListener("click", function() {
    if (adminPassEl.value === managerPassword) {
        isManager = true;
        document.body.classList.add("is-admin");
        adminPassEl.style.display = "none";
        loginBtnEl.textContent = "مدیر وارد شد";
        renderList();
    } else {
        alert("رمز اشتباه است");
    }
});

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    if (inputValue) {
        push(shoppingListInDB, {
            name: inputValue,
            isPurchased: false,
            comment: "",
            timestamp: Date.now()
        });
        clearInputFieldEl();
    }
});

let isInitialLoad = true;
onValue(shoppingListInDB, function(snapshot) {
    isInitialLoad = false;
    renderList(snapshot);
});

onChildAdded(shoppingListInDB, function(snapshot) {
    if (!isInitialLoad && Notification.permission === "granted") {
        new Notification("لیست خرید بروز شد", {
            body: `آیتم جدید: ${snapshot.val().name}`,
            icon: "https://raw.githubusercontent.com/itscali/scrimba-shopping-cart/main/assets/cat.png"
        });
    }
});

function renderList(snapshot) {
    onValue(shoppingListInDB, function(currentSnapshot) {
        if (currentSnapshot.exists()) {
            let itemsArray = Object.entries(currentSnapshot.val());
            clearShoppingListEl();
            for (let i = 0; i < itemsArray.length; i++) {
                appendItemToShoppingListEl(itemsArray[i]);
            }
        } else {
            shoppingListEl.innerHTML = "<p>لیست خالی است...</p>";
        }
    }, { onlyOnce: true });
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemData = item[1];
    
    let newEl = document.createElement("li");
    if (itemData.isPurchased) newEl.classList.add("purchased");

    newEl.innerHTML = `
        <div class="item-main">
            <span class="item-text">${itemData.name}</span>
            <div class="item-actions">
                <button class="btn-action comment-btn">💬</button>
                <button class="btn-action delete-btn">✖</button>
            </div>
        </div>
        ${itemData.comment ? `<div class="comment-text">${itemData.comment}</div>` : ""}
    `;

    if (isManager) {
        newEl.querySelector(".item-text").addEventListener("click", function() {
            update(ref(database, `items/${itemID}`), { isPurchased: !itemData.isPurchased });
        });

        newEl.querySelector(".delete-btn").addEventListener("click", function() {
            remove(ref(database, `items/${itemID}`));
        });

        newEl.querySelector(".comment-btn").addEventListener("click", function() {
            let userComment = prompt("توضیح مدیر:", itemData.comment);
            if (userComment !== null) {
                update(ref(database, `items/${itemID}`), { comment: userComment });
            }
        });
    }
    
    shoppingListEl.append(newEl);
}