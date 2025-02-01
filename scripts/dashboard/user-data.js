// user-data.js
async function fetchUserData() {
    const totalUsersSnapshot = await db.collection('users').get();
    const totalUsers = totalUsersSnapshot.size;

    let onlineUsersCount = 0;
    let userList = document.getElementById('user-list');
    let ageGroups = {
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46-55": 0,
        "56+": 0
    };
    let languageCount = {};

    userList.innerHTML = ''; // Clear the list before populating

    totalUsersSnapshot.forEach((doc) => {
        const userData = doc.data();

        if (userData.status === "Online") {
            onlineUsersCount++;
        }

        countAgeGroup(userData.age, ageGroups);

        if (userData.mother_tongue) {
            languageCount[userData.mother_tongue] = (languageCount[userData.mother_tongue] || 0) + 1;
        }
    });

    document.getElementById('total-users').innerText = totalUsers;
    document.getElementById('online-users').innerText = onlineUsersCount;

    fetchRecentUsers();
    updateAgeGroupChart(ageGroups);
    updateLanguagePreferenceChart(languageCount);
}

// Function to count age groups
function countAgeGroup(age, ageGroups) {
    if (age >= 18 && age <= 25) {
        ageGroups["18-25"]++;
    } else if (age >= 26 && age <= 35) {
        ageGroups["26-35"]++;
    } else if (age >= 36 && age <= 45) {
        ageGroups["36-45"]++;
    } else if (age >= 46 && age <= 55) {
        ageGroups["46-55"]++;
    } else if (age >= 56) {
        ageGroups["56+"]++;
    }
}

// Function to fetch and display recent users
async function fetchRecentUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    const recentUsersSnapshot = await db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

    recentUsersSnapshot.forEach((doc) => {
        const userData = doc.data();
        createUserListItem(userData, userList);
    });
}
document.addEventListener('DOMContentLoaded', fetchUserData);