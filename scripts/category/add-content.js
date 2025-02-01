// Form submission handler
document.getElementById('addContentForm').addEventListener('submit', async (event) => {
event.preventDefault(); // Prevent form from refreshing the page

const category = document.getElementById('categorySelect').value;
const subcategory = document.getElementById('subcategorySelect').value;
const word = document.getElementById('word').value;
const translated = document.getElementById('translated').value;
const options = document.getElementById('options').value.split(',');

let image_path = '';

// Handle image upload if an image is selected
const file = document.getElementById('imageUpload').files[0];
if (file) {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    image_path = await getDownloadURL(storageRef);
}

try {
    // Add the word data to Firestore
    await addDoc(collection(db, 'categories', category, 'subcategories', subcategory, 'words'), {
        word,
        translated,
        options,
        image_path,
    });

    alert('Content added successfully!');
    document.getElementById('addContentModal').style.display = 'none';
    document.getElementById('addContentForm').reset();
    loadCategoriesAndWords(category, subcategory); // Refresh the displayed content
} catch (error) {
    console.error("Error adding content:", error);
    alert('Failed to add content.');
}
});
// Initialize by loading categories and words
loadCategories();
loadCategoriesAndWords(); // Load all words initially