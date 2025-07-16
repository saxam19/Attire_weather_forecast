const apiKey = "878bbc985f91f6c086277a47c50b9fad"; // Replace with your real key

const cityInput = document.getElementById("cityInput");
const locationElem = document.getElementById("location");
const weatherElem = document.getElementById("weather");
const attireElem = document.getElementById("attire");
const card = document.getElementById("weatherCard");

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

document.getElementById("micBtn").addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = (event) => {
    const city = event.results[0][0].transcript;
    cityInput.value = city;
    getWeather();
  };
});

function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name.");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }

      const temp = data.main.temp;
      const weather = data.weather[0].main.toLowerCase();

      locationElem.textContent = `${data.name}, ${data.sys.country}`;
      weatherElem.textContent = `Weather: ${weather}, Temp: ${temp}°C`;
      attireElem.textContent = getAttire(temp, weather);

      changeTheme(temp, weather);
      card.classList.remove("hidden");
    })
    .catch(() => alert("Failed to fetch weather data."));
}

function getAttire(temp, weather) {
  if (weather.includes("rain")) return "🌧️ Wear waterproof jacket and carry umbrella.";
  if (temp < 10) return "🧥 Wear coat, gloves, and boots.";
  if (temp < 20) return "🧣 Light jacket or sweater recommended.";
  if (temp < 30) return "👕 T-shirt and pants are comfortable.";
  return "☀️ Light clothes, cap and drink water often!";
}

function changeTheme(temp, weather) {
  const body = document.body;
  body.className = "";

  if (weather.includes("rain")) {
    body.classList.add("rainy");
  } else if (temp < 10) {
    body.classList.add("cold");
  } else if (temp > 30) {
    body.classList.add("hot");
  } else {
    body.classList.add("sunny");
  }
}
