// Declare chart instances at the top of your script
let ageGroupChartInstance;
let languagePreferenceChartInstance;

// Function to update age group chart
function updateAgeGroupChart(ageGroups) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    const ageLabels = Object.keys(ageGroups);
    const ageData = Object.values(ageGroups);

    // Check if the chart instance exists and destroy it before creating a new one
    if (ageGroupChartInstance) {
        ageGroupChartInstance.destroy();
    }

    // Create a new chart instance
    ageGroupChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ageLabels,
            datasets: [{
                label: 'Age Distribution',
                data: ageData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Age Group Distribution' }
            }
        }
    });
}

// Function to update language preference chart
function updateLanguagePreferenceChart(languageCount) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const labels = Object.keys(languageCount);
    const data = Object.values(languageCount);

    // Check if the chart instance exists and destroy it before creating a new one
    if (languagePreferenceChartInstance) {
        languagePreferenceChartInstance.destroy();
    }

    // Create a new chart instance
    const backgroundColors = labels.map(label => {
        if (label === 'Cuyonon') return 'rgba(255, 205, 86, 0.7)';
        if (label === 'Tagalog') return 'rgba(75, 192, 192, 0.7)';
        return 'rgba(54, 162, 235, 0.7)';
    });

    languagePreferenceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace(/0.7/, '1')),
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Wait for the DOM to be fully loaded before initializing charts
document.addEventListener('DOMContentLoaded', function() {
    // Example of calling these functions with sample data
    const exampleAgeGroups = {
        "18-25": 10,
        "26-35": 15,
        "36-45": 5,
        "46-55": 8,
        "56+": 2
    };
    const exampleLanguageCount = {
        "Cuyonon": 10,
        "Tagalog": 20,
        "English": 5
    };

    // Call the update functions with the sample data
    updateAgeGroupChart(exampleAgeGroups);
    updateLanguagePreferenceChart(exampleLanguageCount);
});
async function fetchMonthlyUsers() {
    const usersSnapshot = await db.collection('users').get();
    const monthlyUserCounts = {};

    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const createdAt = new Date(userData.createdAt); // Ensure date is a Date object

        // Get the year and month
        const yearMonth = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`; // Format: YYYY-MM

        // Count users per month
        monthlyUserCounts[yearMonth] = (monthlyUserCounts[yearMonth] || 0) + 1;
    });

    return monthlyUserCounts;
}
async function fetchMonthlyUsers() {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const monthlyUserCounts = {};

    snapshot.forEach(doc => {
        const userData = doc.data();
        const dateJoined = userData.createdAt;

        if (dateJoined) {
            let jsDate;

            // Check if dateJoined is a Firestore Timestamp or a string
            if (typeof dateJoined.toDate === 'function') {
                jsDate = dateJoined.toDate(); // Convert Firestore Timestamp to JS Date
            } else {
                jsDate = new Date(dateJoined); // Parse as string
            }

            // Validate the resulting Date object
            if (!isNaN(jsDate.getTime())) {
                const month = jsDate.getMonth() + 1; // Get month (1-12)
                const year = jsDate.getFullYear(); // Get year
                const monthYear = `${year}-${month.toString().padStart(2, '0')}`;

                // Increment the count for the corresponding month-year
                monthlyUserCounts[monthYear] = (monthlyUserCounts[monthYear] || 0) + 1;
            } else {
                console.warn(`Invalid date format for document ${doc.id}: ${dateJoined}`);
            }
        } else {
            console.warn(`Missing 'createdAt' for document ${doc.id}`);
        }
    });

    return monthlyUserCounts;
}

async function setupLineChart() {
    const monthlyUserCounts = await fetchMonthlyUsers();

    // Sort the months (keys) in YYYY-MM format
    const labels = Object.keys(monthlyUserCounts).sort();

    // Convert YYYY-MM into a human-readable format like 'Month Year'
    const readableLabels = labels.map(label => {
        const [year, month] = label.split('-');
        const date = new Date(year, month - 1); // Create a date object
        return date.toLocaleString('default', { month: 'long', year: 'numeric' }); // Format: 'Month Year'
    });

    // Data for the chart
    const data = labels.map(label => monthlyUserCounts[label]);

    const ctx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: readableLabels,
            datasets: [{
                label: 'Number of Users',
                data: data,
                borderColor: 'rgba(25, 118, 210, 1)', // Line color
                backgroundColor: 'rgba(25, 118, 210, 0.2)', // Fill under line
                borderWidth: 2,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month and Year', // Label for X-axis
                    },
                },
                y: {
                    beginAtZero: true, // Start Y-axis at zero
                    title: {
                        display: true,
                        text: 'Number of Users', // Label for Y-axis
                    },
                },
            },
        },
    });
}

   
// Call setupLineChart when the document is loaded
document.addEventListener('DOMContentLoaded', setupLineChart);