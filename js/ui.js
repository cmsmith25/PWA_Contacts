import { openDB } from "https://unpkg.com/idb?module";

import {
    addContactToFirebase,
    getContactsFromFirebase,
    deleteContactFromFirebase,
} from "./firebaseDB.js";


//Initialize Sidenav and Forms
document.addEventListener("DOMContentLoaded", function() {
     //Side navigation menu
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus , { edge: "right" });

    //Form to add a contact
    const forms = document.querySelector(".side-form");
    M.Sidenav.init(forms, { edge: "left" });

    //Load contacts from IndexedDB
    loadContacts();
    syncContacts();


    //Check my storage usage
    checkStorageUsage();

    requestPersistentStorage();
});


//Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("/serviceworker.js")
    .then((req) => console.log("Service Worker is Registered!", req))
    .catch((err) => console.log("Service Worker registration failed", err));
}



//create indexedDB database
async function createDB() {
    const db = await openDB("contactKeeper", 1, {
        upgrade(db) {
            const store = db.createObjectStore("contacts", {
                keyPath: "id",
                autoIncrement: false,
            });
            store.createIndex("synced", "synced");
        },
    });
    return db;
}

//Add Contact
async function addContact(contact) {
    const db = await createDB();
    let contactId;

if(navigator.onLine) {
    const savedContact = await addContactToFirebase(contact);
    contactId = savedContact.id;

    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");
    await store.put({ ...contact, id: contactId, synced: true });
    await tx.done;
}   else {
    contactId = `temp-${Date.now()}`;

    //Start a transaction
    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");
    await store.put({ ...contact, id: contactId, synced: false});
    await tx.done;
}


//Update storage usage
    checkStorageUsage();

    //Return contact with id
    return { ...contact, id: contactId };
}

//Sync unsynced contacts from IndexedDB to Firebase
async function syncContacts() {
    if (!navigator.onLine) return;
    const db = await createDB();
    const tx = db.transaction("contacts");
    const store = tx.objectStore("contacts");
    try{ 
        const unsyncedContacts = await store.getAll();
        for (const contact of unsyncedContacts) {
            if(!contact.synced) {
                const syncedContact = await addContactToFirebase(contact);
                await store.put({ ...contact, id: syncedContact.id, synced: true});
            }
        }
        } catch (error) {
            console.error("Error syncing contacts:", error);
        } finally {
            await tx.done;
        }
    }   

//Delete Contact
async function deleteContact(id) {
    if(!id) {
        console.error("Invalid ID passed to deleteContact.");
        return;
    }
    const db = await createDB();
    if(navigator.onLine) {
        await deleteContactFromFirebase(id);
    }

    //Delete from IndexedDB
    const tx = db.transaction("contacts", "readwrite");
    const store = tx.objectStore("contacts");

    try{
    await store.delete(id);
    } catch (e) {
        console.error("Error deleting contact from IndexedDB:", e);
    }

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
    const contactContainer = document.querySelector(".contacts");
    contactContainer.innerHTML = "";

    try{

    if(navigator.onLine) {
        const firebaseContacts = await getContactsFromFirebase();
        const tx = db.transaction("contacts", "readwrite");
        const store = tx.objectStore("contacts");

        for (const contact of firebaseContacts) {
            // Save contacts to IndexedDB with 'synced' flag
            await store.put({ ...contact, synced: true });
            displayContact(contact); // Display each task in the UI
          }
          await tx.done;
    }   else {
        const tx = db.transaction("contacts", "readonly");
        const store = tx.objectStore("contacts");
        const contacts = await store.getAll();


        contacts.forEach((contact) => 
            displayContact(contact));
        }
        await tx.done;
    }
    catch (error) {
    console.error("Error loading contacts");
}



//Display contact using existing HTML structure
function displayContact(contact) {
    const contactContainer = document.querySelector(".contacts");
    const contactElement = document.createElement("div");
    contactElement.className = "card-panel white row valign-wrapper";
    contactElement.dataset.id = contact.id;

    contactElement.innerHTML = `
    
            <div class="col s2">
            <img src="/img/icons/contacts.png" 
            class="circle responsive-img"
            alt="contact icon"
            style="max-width: 100%; height: auto"
            />
            </div>
            <div class="contact-info col s8">
                <h5 class="contact-name black-text">${contact.name}</h5>
                <div class="contact-number">${contact.number}</div>
            </div>

                
            </div>
            <div class="col s2 right-align">
            <button class="contact-delete btn-flat" aria-label="Delete Contact">
            <i class="material-icons black-text text-darken-1"
            style="font-size: 30px"
            >delete</i>
        </button>
        </div>
        
        `;

        contactContainer.appendChild(contactElement);
}




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
            
            const storageWarning = document.querySelector("#storage-warning");

            if (usage/quota > 0.8){
                const storageWarning = document.querySelector("#storage-warning");
                if(storageWarning){
                    storageWarning.textContent = "Warning: You are running low on data";
                    storageWarning.style.display = "block";
                }
                } else {
                    const storageWarning = document.querySelector("#storage-warning");
                    if(storageWarning){
                        storageWarning.textContent = "";
                        storageWarning.style.display = "none";
                    }
                }

            }
    }

        //Function to request persistent storage
        async function requestPersistentStorage() {
            if(navigator.storage && navigator.storage.persist) {
                const isPersistent = await navigator.storage.persist();
                console.log(`Persistent storage granted: ${isPersistent}`);
            }
        }

           

        window.addEventListener("online", syncContacts);
        window.addEventListener("online", loadContacts);
    
    }