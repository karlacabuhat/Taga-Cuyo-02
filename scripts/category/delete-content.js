async function deleteContent(event, categoryId, subcategoryId) {
const wordId = event.target.getAttribute("data-id");

if (confirm("Are you sure you want to delete this word?")) {
try {
    // Get the current user's email
    const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;

    // If there's no user, prevent deletion and alert the user
    if (!currentUserEmail) {
        alert("You must be logged in to perform this action.");
        return;
    }

    // Delete the word document from Firestore
    await deleteDoc(doc(db, "categories", categoryId, "subcategories", subcategoryId, "words", wordId));

    // Log the deletion activity
   // await logActivity("Deleted word", currentUserEmail, { wordId, categoryId, subcategoryId });

    // Reload the categories and words table after deletion
    loadCategoriesAndWords();  // This will refresh the table
    alert("Word deleted successfully!");
} catch (error) {
    console.error("Error deleting content:", error);
    alert("An error occurred while deleting the word.");
}
}
}