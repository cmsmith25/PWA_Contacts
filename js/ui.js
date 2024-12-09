import { openDB } from "http:unpkg.com/idb?module";



document.addEventListener( "DOMContentLoaded", function() {
     //Side navigation menu
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus , { edge: "right" });
    //Form to add a contact
    const forms = document.querySelector(".side-form");
    M.Sidenav.init(forms, { edge: "left" });

    loadContacts();

    checkStorageUsage();
});


if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("/serviceworker.js")
    .then((req) => console.log("Service Worker is Registered!", req))
    .catch((err) => console.log("Service Worker registration failed", err));
}



//create indexDB database
async function createDB() {
    const db = await openDB("contactKeeper", 1, {
        upgrade(db) {
            const store = db.createObjectStore("contacts", {
                keyPath: "id",
                autoIncrement: true,
            });
            store.createIndex("status", "status");
        },
    });
    return db;
}

//Add Contact
async function addContact(contact) {
    const db = await createDB();

    //Start a transaction
    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");

    //Add contact to store
    await store.add(contact);

    //Complete transaction
    await tx.done;

    //Update storage usage
    checkStorageUsage();
}

//Delete Contact
async function deleteContact(id) {
    const db = await createDB();

    //start transaction
    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");

    //Delete Contact by id
    await store.delete(id);

    await tx.done;

    //Remove contact from UI
    const contactCard = document.querySelector(`[data-id="${id}"]`);
    if(contactCard) {
        contactCard.remove();
    }

    //Update storage usage
    checkStorageUsage();
}

//Load Contacts with transaction
async function loadContacts() {
    const db = await createDB();

//start transaction
const tx = db.transaction("contacts", "readonly");
const store = tx.objectStore("contacts");

//Get all contacts
const contacts = await store.getAll();

await tx.done;

const contactContainer = document.querySelector(".contacts");
contactContainer.innerHTML = "";
contacts.forEach((contact) => {
    displayContact(contact);

});
}

//Display contact using existing HTML structure
function displayContact(contact) {
    const contactContainer = document.querySelector(".contacts");
    const html = `
        <div class="card-panel white row valign-wrapper" data-id=${contact.id}>
            <div class="col s2">
            <img src="img/icons/contacts.png" 
            class="circle responsive-img"
            alt="contact icon"
            style="max-width: 100%; height: auto"
            />
            </div>
            <div class="contact-info col s8">
                <h5 class="contact-name black-text">${contact.name}</h5>
                <div class="contact-number">${contact.number}</div>
            </div>

            <div class="contact-icons">
                <i class="material-icons call_out">call_outline</i>
                
            </div>

            <div class="email-info">
                <div class="email-address">Mom@gmail.com</div>
                <i class="material-icons email">email</i>
                
            </div>
            <div class="col s2 right-align">
            <button class="contact-delete btn-flat" aria-label="Delete Contact">
            <i class="material-icons black-text text-darken-1"
            style="font-size: 30px"
            >delete</i>
        </button>
        </div>
        
        </div>
        `;

        contactContainer.insertAdjacentHTML("beforeend", html);

        //Attach delete event listener
        const deleteButton = contactContainer.querySelector(
            ` [data-id="${contact.id}"] .contact-delete`
        );

        deleteButton.addEventListener("click", () => deleteContact(contact.id));

    }

    //Add Contact Button listener

    const addContactButton = document.querySelector(".btn-small");
    addContactButton.addEventListener("click", async () => {
        const nameInput = document.querySelector("#name");
        const numberInput = document.querySelector("#number");

        const contact = {
            name: nameInput.value,
            number: numberInput.value,
            status: "pending",
        };

        await addContact(contact); //Add Contact to IndexedDB
        
        displayContact(contact);  //Add Contact to UI


        //Clears input fields after adding
        nameInput.value = "";
        numberInput.value = "";


        //Closes the side form after adding
        const forms = document.querySelector(".side-form");
        const instance = M.Sidenav.getInstance(forms);
        instance.close();
    });


    //Function to check storage usage
    async function checkStorageUsage() {
        if (navigator.storage && navigator.storage.estimate){
            const { usage,quota } = await navigator.storage.estimate();

            const usageInMB = (usage / (1024 * 1024)).toFixed(2); //convert to MB
            const quotaInMB = (quota / (1024 * 1024)).toFixed(2); //convert to MB

            console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);

            //Update the UI
            const storageInfo = document.querySelector("#storage-info");
            if(storageInfo){
                storageInfo.textContent = `Storage used: ${usageInMB} MB of ${quotaInMB} MB`;
            }

            if (usage/quota > 0.8){
                const storageWarning = document.querySelector("#storage-warning");
                if(storageWarning){
                    storageWarning.textContent = "Warning: You are running low on data";
                    storageWarning.style.display = "block";
                } else {
                    const storageWarning = document.querySelector("#storage-warning");
                    if(storageWarning){
                        storageWarning.textContent = "";
                        storageWarning.style.display = "none";
                    }
                }

            }
        }
    }
