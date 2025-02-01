async function updateTranslations() {
    const translationsList = document.getElementById('translated-phrases-list');
    translationsList.innerHTML = ''; // Clear the list before updating

    // Create the table header
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Output Language</th>
        <th style="text-align:center">Sentence</th>
        <th>Source Language</th>
        <th>Target Language</th>
    `;
    table.appendChild(headerRow);

    try {
        const translationSnapshot = await db.collection('translations')
            .orderBy('timestamp', 'desc') // Assuming 'timestamp' is a field that indicates when the translation was created
            .limit(15) // Get only the 15 most recent translations
            .get();

        if (translationSnapshot.empty) {
            translationsList.innerHTML = '<p>No translations available.</p>';
            return;
        }

        // Create table rows for each translation
        translationSnapshot.forEach((doc) => {
            const data = doc.data();
            const outputSentence = data.output_sentence;
            const sentence = data.sentence;
            const sourceLanguage = data.source_language;
            const targetLanguage = data.target_language;

            // Create a row for each translation
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${outputSentence}</td>
                <td>"${sentence}"</td>
                <td>${sourceLanguage}</td>
                <td>${targetLanguage}</td>
            `;
            table.appendChild(row);
        });

        translationsList.appendChild(table);

    } catch (error) {
        console.error('Error fetching translations:', error.message);
        translationsList.innerHTML = `<p>Error: ${error.message}. Please contact support.</p>`;
    }
}

// Call updateTranslations when the page is loaded
document.addEventListener('DOMContentLoaded', updateTranslations);