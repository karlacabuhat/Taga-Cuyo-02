
async function handleEdit(event) {
const editButton = event.target.closest('.btn-edit');

// Fetch IDs from the button's dataset
const wordId = editButton.dataset.id;
const categoryId = editButton.dataset.category;
const subcategoryId = editButton.dataset.subcategory;

if (!wordId || !categoryId || !subcategoryId) {
console.error("Error: Missing IDs", { wordId, categoryId, subcategoryId });
alert("Unable to edit: missing category, subcategory, or word ID.");
return;
}

// Access the editable cells
const row = editButton.closest('tr');
const wordCell = row.querySelector('td:nth-child(3)');
const translatedCell = row.querySelector('td:nth-child(4)');
const optionsCell = row.querySelector('td:nth-child(5)');

// Toggle between edit and save mode
if (editButton.textContent.trim() === "Edit") {
// Make cells editable
wordCell.contentEditable = "true";
translatedCell.contentEditable = "true";
optionsCell.contentEditable = "true";
wordCell.focus();
editButton.textContent = "Save";
} else {
// Save the updated data
const updatedWord = wordCell.textContent.trim();
const updatedTranslated = translatedCell.textContent.trim();
const updatedOptions = optionsCell.textContent.trim().split(",").map(opt => opt.trim());

try {
await updateDoc(doc(db, "categories", categoryId, "subcategories", subcategoryId, "words", wordId), {
    word: updatedWord,
    translated: updatedTranslated,
    options: updatedOptions,
});

alert("Word updated successfully!");
editButton.textContent = "Edit";
loadCategoriesAndWords(); // Refresh the table
} catch (error) {
console.error("Error updating word:", error);
alert("An error occurred while updating the word.");
}
}
}

