// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyA-HwTJkj5v4En_SLnr7nc16rkwGk7NVLc",
  authDomain: "statistic-umfrage.firebaseapp.com",
  databaseURL: "https://statistic-umfrage-default-rtdb.firebaseio.com",
  projectId: "statistic-umfrage",
  storageBucket: "statistic-umfrage.firebasestorage.app",
  messagingSenderId: "54072890599",
  appId: "1:54072890599:web:d39926f9085dfd84ea7e42",
  measurementId: "G-FDFL4EKQG9"
};

// Firebase starten
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Formular
const form = document.getElementById("voteForm");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const value = document.querySelector('input[name="answer"]:checked').value;

  const ref = db.ref("frage1/" + value);

  ref.transaction(function(current){
    return (current || 0) + 1;
  });
});

// Balkendiagramm
const bars = {
  A: document.getElementById("barA"),
  B: document.getElementById("barB"),
  C: document.getElementById("barC"),
  D: document.getElementById("barD")
};

const counts = {
  A: document.getElementById("countA"),
  B: document.getElementById("countB"),
  C: document.getElementById("countC"),
  D: document.getElementById("countD")
};

firebase.database().ref("frage1").on("value", (snapshot) => {
  const data = snapshot.val() || {};

  let total = 0;
  Object.values(data).forEach(v => total += v);

  ["A","B","C","D"].forEach(letter => {
    const value = data[letter] || 0;
    counts[letter].innerText = value;

    const percent = total ? (value / total) * 100 : 0;
    bars[letter].style.width = percent + "%";
  });

  document.getElementById("chart").style.display = "block";
});
function scheduleHourlyReset() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const msUntilNextHour =
    ((60 - minutes) * 60 - seconds) * 1000;

  setTimeout(() => {
    resetVotes();
    setInterval(resetVotes, 3600000);
  }, msUntilNextHour);
}

function resetVotes() {
  const resetData = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  firebase.database().ref("frage1").set(resetData);
}

scheduleHourlyReset();
