// activities.js
async function fetchRecentActivities() {
    const querySnapshot = await db.collection('activities')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();

    let activityList = document.getElementById('activity-list');
    activityList.innerHTML = ''; // Clear previous activities

    querySnapshot.forEach(doc => {
        const activityData = doc.data();
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Action:</strong> ${activityData.action} <br>
            <strong>By:</strong> ${activityData.addedBy} <br>
            <strong>Location:</strong> ${activityData.location} <br>
            <strong>Timestamp:</strong> ${activityData.timestamp.toDate().toLocaleString()}
        `;
        activityList.appendChild(listItem);
    });
}

// Update recent activities
function updateRecentActivities() {
    fetchRecentActivities();
}

// Call fetchRecentActivities() when the page loads
document.addEventListener('DOMContentLoaded', fetchRecentActivities);

function loadUserSupport() {
    db.collection("tickets")
        .orderBy("timeStamp", "desc")
        .limit(5)
        .get()
        .then((querySnapshot) => {
            const userSupportList = document.getElementById("userSupportList");
            userSupportList.innerHTML = ""; // Clear existing data

            querySnapshot.forEach((doc) => {
                const supportData = doc.data();
                const timeStamp = supportData.timeStamp
                    ? (typeof supportData.timeStamp.toDate === "function"
                        ? supportData.timeStamp.toDate()
                        : new Date(supportData.timeStamp)) // If it's a string, convert to Date
                    : null;

                const supportItem = document.createElement("li");
                supportItem.innerHTML = `
                    <strong>Issue:</strong> ${supportData.issue || "No issue provided"}<br>
                    <strong>By:</strong> ${supportData.fullName || "Anonymous"} (${supportData.email || "No email"})<br>
                    <strong>Submitted At:</strong> ${timeStamp ? timeStamp.toLocaleString() : "Unknown"}
                `;
                userSupportList.appendChild(supportItem);
            });
        })
        .catch((error) => {
            console.error("Error loading user support data: ", error);
        });
}
// Load user support data on page load
document.addEventListener("DOMContentLoaded", loadUserSupport);


