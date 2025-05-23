if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(() => {
      console.log("Service Worker registered");
    });
  }

  const micBtn = document.getElementById("micBtn");
  const input = document.getElementById("thoughtInput");
  const sigPytbtn = document.getElementById("sigPytbtn");
  const message = document.getElementById("messageArea");
    //const api ="https://localhost:5001/api/Pyt";
    const api = "https://bustrackerserver-fcd5hra6drazczce.northeurope-01.azurewebsites.net/api/Pyt"  // Azure backend URL
  document.addEventListener("touchstart", function () {}, true);

  let recognition;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'da-DK'; // Dansk
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
      micBtn.classList.add('recording');
      micBtn.title = 'Optager… klik igen for at stoppe';
    };

    recognition.onend = function() {
      micBtn.classList.remove('recording');
      micBtn.title = 'Tal dine tanker';
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      input.value = transcript; // Bare indsæt – ikke send
      clearThought();
    };

    
    recognition.onerror = function(event) {
      micBtn.classList.remove('recording');
      console.error("Talegenkendelse fejl:", event.error);
    };

    micBtn.addEventListener("click", () => {
      if (micBtn.classList.contains('recording')) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } 
  else {
    micBtn.disabled = true;
    micBtn.title = "Talegenkendelse understøttes ikke i denne browser.";
  }

  async function clearThought() {
    
    message.style.display = "block";
    if (!input.value.trim()) {
      message.textContent = "Pyt med det !"
      sigPytbtn.click(); // sigPyt();
      return;
    }

    message.textContent = "Tænker...";

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk-pyt-1234567890abcdef"
      },
      body: JSON.stringify({ text: input.value })
    });

    const data = await response.json();
    input.value = "";

    message.style.opacity = 0;
    setTimeout(() => {
      message.textContent = data.message;
      message.style.opacity = 1;
      //sigPyt();
    }, 300);

  }

  // Enter-genvej til knappen
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    clearThought();
  }
});

function sigPyt(){
  const sound = document.getElementById("pytlyd");
  sound.currentTime = 0;
  sound.play();
}