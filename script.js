const API_KEY = "YOUR_AP_KEY";

const API_URL =
    "https://api.openweathermap.org/data/2.5/weather";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        const url =
            `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                alert("City not found. Please enter a valid city.");
            } else if (response.status === 401) {
                alert("Invalid API key. Please check your API key.");
            } else {
                alert("Unable to get weather information.");
            }
            return;
        }

        const data = await response.json();

        document.getElementById("cityName").textContent =
            data.name;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)} °C`;

        document.getElementById("weatherCondition").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity} %`;

        document.getElementById("windSpeed").textContent =
            `${data.wind.speed} m/s`;

        document.getElementById("recommendationText").textContent =
            generateAIAdvice(data);

    } catch (error) {

        alert("Error connecting to weather service.");
        console.error(error);
    }
}


// Search button
document.getElementById("searchBtn")
    .addEventListener("click", getWeather);


// Press Enter to search
document.getElementById("cityInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            getWeather();
        }

    });


// AI Weather Recommendation
function generateAIAdvice(data) {

    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const weather = data.weather[0].main.toLowerCase();
    const wind = data.wind.speed;

    let advice = "";

    if (
        weather.includes("rain") ||
        weather.includes("drizzle") ||
        weather.includes("thunderstorm")
    ) {
        advice +=
            "Carry an umbrella and be careful while travelling. ";
    }

    if (temperature >= 35) {
        advice +=
            "The temperature is high. Stay hydrated and avoid direct sunlight. ";
    } else if (temperature >= 30) {
        advice +=
            "The weather is warm. Drink enough water. ";
    }

    if (temperature < 20) {
        advice +=
            "The weather is cool. Wear suitable clothing. ";
    }

    if (humidity >= 80) {
        advice +=
            "Humidity is high, so outdoor activities may feel uncomfortable. ";
    }

    if (wind >= 10) {
        advice +=
            "Wind speed is high. Take extra care outdoors. ";
    }

    if (advice === "") {
        advice =
            "Weather conditions look moderate. Have a safe and comfortable day!";
    }

    return advice;
}
