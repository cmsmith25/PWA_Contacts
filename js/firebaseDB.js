import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
 } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


  
  const firebaseConfig = {
    apiKey: "AIzaSyAZpd3XKCYnJHkNLLAIoUv7YRO5z3rfj64",
    authDomain: "contactkeeper-e0d3e.firebaseapp.com",
    projectId: "contactkeeper-e0d3e",
    storageBucket: "contactkeeper-e0d3e.firebasestorage.app",
    messagingSenderId: "751073691110",
    appId: "1:751073691110:web:77a1d3bbafe6fea51e0227",
    measurementId: "G-V08285HCZ2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //Add a Contact
  export async function addContactToFirebase(contact) {
    try{
    const docRef = await addDoc(collection(db, "contacts"), contact);
    return { id: docRef.id, ...contact }
    } catch(e) {
        console.error("error adding contact: ", e)
    }
  }


  //Get Contacts
  export async function getContactsFromFirebase() {
    const contacts = [];
    try{
const querySnapshot = await getDocs(collection(db, "contacts"));
querySnapshot.forEach((doc) =>{
    tasks.push({ id: doc.id, ...doc.data() });
});
    }catch (e) {
        console.error("error retrieving contacts: ", e);
    }
    return contacts;
  }
  

  //Delete Contacts
  export async function deleteContactFromFirebase(id) {
    if(!id) {
      console.error("Invalid ID passed to deleteContactFromFirebase.");
      return;
    }
    try {
     await deleteDoc(doc(db, "contacts", id));   
    }catch (error) {
        console.error("error deleting contacts: ", error);
    }
  }
  //Update Contacts
  export async function updateContact(id, updateContact) {
    try{
    const contactRef = doc(db, "contacts", id);
    await updateDoc(contactRef, updatedData);
    } catch (e) {
        console.error("error updating contact: ", e);
    }
  }
  



