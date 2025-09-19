
console.log("Script loaded"); // test log

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbeH7v1UaIcFLKYSiiwGn_w-z0HcXeQOE",
  authDomain: "preufstand5.firebaseapp.com",
  databaseURL: "https://preufstand5-default-rtdb.firebaseio.com",
  projectId: "preufstand5",
  storageBucket: "preufstand5.firebasestorage.app",
  messagingSenderId: "970349287368",
  appId: "1:970349287368:web:8d59a556b9b0d0adca52fd",
  measurementId: "G-078JCJ5ESN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Reference to the 'real_time_data' node in Firebase
const dataRef = ref(database, 'Preufstand5');

// Array of keys to update
const new_keys = [
   "Zeit_Datum_A_2" ,"Zeit_Datum_A_1","Messwert_AA", "Messwert_AB", "Messwert_AC", "Messwert_AD", "Messwert_AE",
  "Alarmstatus1_AI", "Alarmstatus1_AJ", "Alarmstatus1_AK", "Alarmstatus1_AL", "Alarmstatus1_AM",
  "KanalStorung_BG", "KanalStorung_BH", "KanalStorung_BI", "KanalStorung_BJ", "KanalStorung_BK",
  "Betriebsstatus_BO", "Betriebsstatus_BP", "Betriebsstatus_BQ", "Betriebsstatus_BR", "Betriebsstatus_BS",
  "Alarmstatus3_AY", "Alarmstatus3_AZ", "Alarmstatus3_BA", "Alarmstatus3_BB", "Alarmstatus3_BC"
];

// Function to update the status cell based on timestamp difference
function updateStatusCell(data) {
    const currentTime = Date.now(); // Get current time in milliseconds

    if (data.TimeStamp !== undefined) {
        const timeStamp = parseFloat(data.TimeStamp) * 1000; // Convert timestamp to milliseconds
        const timeDifference = (currentTime - timeStamp) / 1000; // Difference in seconds

        console.log(`Current Time: ${currentTime}`);
        console.log(`Timestamp: ${timeStamp}`);
        console.log(`Time Difference: ${timeDifference} seconds`);

        const statusCell = document.getElementById('status-cell'); // Assuming 'status-cell' is the ID of the cell to update
        const lightCell = document.getElementById('light-cell'); // Assuming 'light-cell' is the ID of the light indicator cell

        if (statusCell && lightCell) {
            if (timeDifference > 20) {
                statusCell.innerText = 'inaktiv';
                lightCell.classList.remove('green-light');
                lightCell.classList.add('red-light');
                console.log("Status updated to inaktiv");
            } else {
                statusCell.innerText = 'aktiv';
                lightCell.classList.remove('red-light');
                lightCell.classList.add('green-light');
                console.log("Status updated to aktiv");
            }
        } else {
            console.log("Missing status cell or light cell element");
        }
    } else {
        console.log("No timestamp found");
    }
}

// Listen for changes in the dataRef
onValue(dataRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
        new_keys.forEach(key => {
            if (data[key] !== undefined && document.getElementById(key)) {
                // Update the text of the table cell
                const cell = document.getElementById(key);
                cell.innerText = data[key];

                // Only apply color change to Alarmstatus1, Alarmstatus2, Alarmstatus3, and KanalStorung
                if (key.includes("Alarmstatus") || key.includes("KanalStorung")) {
                    // Example threshold value for changing the cell color
                    const threshold = 1;

                    // Ensure the value is a number before comparison
                    const value = parseFloat(data[key]);

                    if (!isNaN(value)) {
                        if (value >= threshold) {
                            // Add the red background color class if the value exceeds the threshold
                            cell.classList.add('red-cell');
                        } else {
                            // Remove the red background color if the value is below the threshold
                            cell.classList.remove('red-cell');
                        }
                    }
                }
            } else {
                console.log(`Missing data or element for: ${key}`);
            }
        });

        // Update the status cell based on timestamp difference
        updateStatusCell(data);
    } else {
        console.log("No data found");
    }
});

// Periodically check the timestamp and update the status cell
setInterval(() => {
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateStatusCell(data);
        }
    });
}, 1000); // Check every second


