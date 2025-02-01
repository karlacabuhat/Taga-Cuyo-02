import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc,getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqr7jav_7l0Y7gIhfTklJXnHPzjAYV8f4",
    authDomain: "taga-cuyo-app.firebaseapp.com",
    projectId: "taga-cuyo-app",
    storageBucket: "taga-cuyo-app.firebasestorage.app",
    messagingSenderId: "908851804845",
    appId: "1:908851804845:web:dff839dc552a573a23a424",
    measurementId: "G-NVSY2HPNX4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app); // Initialize Firebase Storage

// Show modal when Add Content button is clicked
document.getElementById('addContentButton').addEventListener('click', () => {
    document.getElementById('addContentModal').style.display = 'block';
});

// Close modal when close button is clicked
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('addContentModal').style.display = 'none';
});

// Load categories for the category dropdown and set up change event to load subcategories
async function loadCategories() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categorySelect = document.getElementById("categorySelect");
        const filterCategory = document.getElementById("filterCategory");

        // Clear existing options before populating new ones
        categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
        filterCategory.innerHTML = '<option value="">All Categories</option>';

        // Populate the categories dynamically for both dropdowns
        categoriesSnapshot.forEach((doc) => {
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doc.data().category_name || doc.id;
            categorySelect.appendChild(option);

            // Populate filter category dropdown
            const filterOption = document.createElement("option");
            filterOption.value = doc.id;
            filterOption.textContent = doc.data().category_name || doc.id;
            filterCategory.appendChild(filterOption);
        });

        // Load subcategories when a category is selected
        categorySelect.addEventListener("change", () => {
            const selectedCategory = categorySelect.value;
            loadSubcategories(selectedCategory);
        });

        // Listen for filter category change
        filterCategory.addEventListener("change", () => {
            const selectedCategory = filterCategory.value;
            loadCategoriesAndWords(selectedCategory); // Filter words based on selected category
        });

    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Load subcategories based on the selected category
async function loadSubcategories(categoryId) {
    const subcategorySelect = document.getElementById("subcategorySelect");

    // Clear existing options
    subcategorySelect.innerHTML = '<option value="" disabled selected>Select a subcategory</option>';

    try {
        const subcategoriesSnapshot = await getDocs(collection(db, "categories", categoryId, "subcategories"));

        subcategoriesSnapshot.forEach((doc) => {
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doc.data().subcategory_name || doc.id;
            subcategorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading subcategories:", error);
    }
}

// Fetch categories, subcategories, and words, and display in the table
async function loadCategoriesAndWords(filterCategoryId = "") {
try {
const categoriesSnapshot = await getDocs(collection(db, "categories"));

const categoriesTableBody = document.getElementById("categoriesTableBody");
categoriesTableBody.innerHTML = "";

categoriesSnapshot.forEach(async (categoryDoc) => {
    if (filterCategoryId === "" || categoryDoc.id === filterCategoryId) {
        const categoryName = categoryDoc.data().category_name || categoryDoc.id;
        const subcategoriesSnapshot = await getDocs(collection(db, "categories", categoryDoc.id, "subcategories"));
        
        subcategoriesSnapshot.forEach(async (subcategoryDoc) => {
            const subcategoryName = subcategoryDoc.data().subcategory_name || subcategoryDoc.id;
            const wordsSnapshot = await getDocs(collection(db, "categories", categoryDoc.id, "subcategories", subcategoryDoc.id, "words"));

            wordsSnapshot.forEach((wordDoc) => {
                const wordData = wordDoc.data();
                const word = wordData.word;
                const translated = wordData.translated;
                const options = Array.isArray(wordData.options) ? wordData.options.join(", ") : "";
                const image_path = wordData.image_path || '';

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</td>
                    <td>${subcategoryName.charAt(0).toUpperCase() + subcategoryName.slice(1)}</td>
                    <td>${word}</td>
                    <td>${translated}</td>
                    <td>${options}</td>
                    <td>
                        <img src="${image_path}" alt="Uploaded Image" style="width:50px; height:50px;" />
                    </td>
                    <td>
                        <button class="btn btn-edit" style="background-color: rgb(223, 223, 2); color: white; border:none; padding: 10px 5px;" data-id="${wordDoc.id}" data-category="${categoryDoc.id}" data-subcategory="${subcategoryDoc.id}">Edit</button>

                        <button class="btn btn-delete delete" style="background-color: #f44336; color: white; border:none; padding: 10px 10px;" data-id="${wordDoc.id}">Delete</button>
                    </td>
                `;

                categoriesTableBody.appendChild(row);
                const editButton = row.querySelector(".btn-edit");
                editButton.addEventListener("click", (event) => handleEdit(event));

                // Now attach the event listener for the delete button
                const deleteButton = row.querySelector(".btn-delete");
                deleteButton.addEventListener("click", (event) => deleteContent(event, categoryDoc.id, subcategoryDoc.id));
            });
        });
    }
});
} catch (error) {
console.error("Error loading categories and words:", error);
}
}



async function logActivity(action, userEmail, details) {
try {
// Create a log document in Firestore (or log it elsewhere)
await addDoc(collection(db, "history"), {
    action,
    userEmail,
    details,
    timestamp: new Date()
});
} catch (error) {
console.error("Error logging activity:", error);
}
}

