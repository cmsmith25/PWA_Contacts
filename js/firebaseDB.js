import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
    getFirestore,
    collection,
    doc,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
 } from "https://www.gtatic.com/firebasejk/11.0.2/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const db = getFireStore(app);

  //Add a Contact
  export async function addContactToFirebase(contact) {
    try{
    const docRef = await addDoc(collection(db, "contacts"), contact);
    return {id: docRef.id, ...contact}
    } catch(error) {
        console.error("error adding contact: ", error)
    }
  }

  const contact = {
    name: "example name",
    number: "test",
    status: "true",
  };

  //Get Contacts
  export async function getContacts(params) {
    const tasks = [];
    try{
const querySnapshot = await getDocs(collection(db, "contacts"));
querySnapshot.forEach((doc) =>{
    tasks.push({id: doc.id, ...doc.data()})
})
    }catch(error){
        console.error("error retrieving taks: ", error);
    }
    return getContacts;
  }
  //Delete Contacts
  export async function deleteContact(id) {
    try{
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
    }catch (error) {
        console.error("error updating contact: ", error);
    }
  }
  



