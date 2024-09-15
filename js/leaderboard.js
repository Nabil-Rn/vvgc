// List of local JSON file paths
const jsonFiles = [
    'json/leaderboard.json'];

// Function to load JSON data from a local file
async function loadJSON(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return [];
    }
}

// Function to fetch and merge data from all JSON files
async function fetchAndMergeData() {
    const allPlayers = [];

    for (const file of jsonFiles) {
        const players = await loadJSON(file);
        players.forEach(player => {
            // Check if player already exists and update points if it does
            // removed p.name === player.name ||
            const existingPlayer = allPlayers.find(p => p.discord === player.discord);
            if (existingPlayer) {
                existingPlayer.points += player.points;
            } else {
                allPlayers.push({ ...player });
            }
        });
    }

    populateLeaderboard(allPlayers);
}

// Function to fill or update the leaderboard
function populateLeaderboard(players) {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = ''; // Clear existing rows

    //removed <td>${player.name}</td>
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.discord}</td>
            <td>${player.points}</td>
        `;
        tbody.appendChild(row);
    });
}

// Call the fetchAndMergeData function to load data on page load
window.onload = fetchAndMergeData;
