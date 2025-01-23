const API_KEY = "2608a422567940c6fd793a578e905206";
const DEFAULT_CITY = "Delhi";

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    });

    
    fetchWeather(DEFAULT_CITY);

    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            () => {
                console.log("Geolocation not available, using default city.");
            }
        );
    }
});


async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "200") {
            updateCurrentWeather(data.city, data.list[0]);
            renderCharts(data.list);
        } else {
            alert("City not found!");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


async function fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateCurrentWeather(data.city, data.list[0]);
        renderCharts(data.list);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


function updateCurrentWeather(city, weather) {
    document.getElementById("location").textContent = `Location: ${city.name}, ${city.country}`;
    document.getElementById("dateTime").textContent = `Date/Time: ${new Date(weather.dt * 1000).toLocaleString()}`;
    document.getElementById("temperature").textContent = `Temperature: ${weather.main.temp}°C`;
    document.getElementById("condition").textContent = `Condition: ${weather.weather[0].description}`;
    document.getElementById("humidity").textContent = `Humidity: ${weather.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `Wind Speed: ${weather.wind.speed} m/s`;
}


function renderCharts(data) {
    const labels = data.map((entry) => new Date(entry.dt * 1000).toLocaleDateString());
    const temperatures = data.map((entry) => entry.main.temp);
    const humidities = data.map((entry) => entry.main.humidity);

    
    new Chart(document.getElementById("tempChart"), {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temperatures,
                    borderColor: "red",
                    fill: false,
                },
            ],
        },
    });

    
    new Chart(document.getElementById("humidityChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Humidity (%)",
                    data: humidities,
                    backgroundColor: "blue",
                },
            ],
        },
    });
}
