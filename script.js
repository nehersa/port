const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  themeToggle.textContent = isDarkMode
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
  themeToggle.setAttribute("aria-pressed", String(isDarkMode));
});

console.log("JavaScript connected");

// Search by project title, description, or technology.
const projectSearch = document.getElementById("projectSearch");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectSearchStatus = document.getElementById("projectSearchStatus");
const noProjectsMessage = document.getElementById("noProjectsMessage");

function filterProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const searchableText = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
    const matches = searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  projectSearchStatus.textContent = query
    ? `Showing ${visibleCount} of ${projectCards.length} projects for "${projectSearch.value.trim()}".`
    : `Showing all ${projectCards.length} projects.`;
  noProjectsMessage.hidden = visibleCount !== 0;
}

projectSearch.addEventListener("input", filterProjects);

// Existing weather feature (preserved).
const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherButton");
const weatherResult = document.getElementById("weatherResult");

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.textContent = "Please enter a city.";
    return;
  }

  weatherResult.textContent = "Loading weather...";

  try {
    // Open-Meteo provides weather data without a browser-exposed API key.
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    if (!geoResponse.ok) throw new Error(`Geocoding HTTP ${geoResponse.status}`);

    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];
    if (!place) {
      weatherResult.textContent = "City not found. Check the spelling and try again.";
      return;
    }

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`
    );
    if (!weatherResponse.ok) throw new Error(`Weather HTTP ${weatherResponse.status}`);

    const weatherData = await weatherResponse.json();
    const conditionNames = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Drizzle",
      55: "Dense drizzle", 61: "Slight rain", 63: "Rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers",
      81: "Rain showers", 82: "Heavy rain showers", 95: "Thunderstorm"
    };
    const current = weatherData.current;
    const condition = conditionNames[current.weather_code] || "Current conditions available";
    weatherResult.textContent = `${place.name}: ${current.temperature_2m}°C · ${condition}`;
  } catch (error) {
    weatherResult.textContent = "Unable to fetch weather right now. Please try again.";
    console.error(error);
  }
}

weatherButton.addEventListener("click", getWeather);
