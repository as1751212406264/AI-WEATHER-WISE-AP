const API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        // Find city coordinates
        const geoResponse = await fetch(
            `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found. Please enter a valid city.");
            return;
        }

        const location = geoData.results[0];

        // Get weather
        const weatherResponse = await fetch(
            `${API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=ms`
        );

        const data = await weatherResponse.json();

        const weather = data.current;

        document.getElementById("cityName").textContent =
            location.name;

        document.getElementById("temperature").textContent =
            `${Math.round(weather.temperature_2m)} °C`;

        document.getElementById("weatherCondition").textContent =
            getWeatherCondition(weather.weather_code);

        document.getElementById("humidity").textContent =
            `${weather.relative_humidity_2m} %`;

        document.getElementById("windSpeed").textContent =
            `${weather.wind_speed_10m} m/s`;

        document.getElementById("recommendationText").textContent =
            generateAIAdvice(weather);

    } catch (error) {

        console.error(error);
        alert("Unable to get weather information.");

    }
}


// Weather condition
function getWeatherCondition(code) {

    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 57) return "Drizzle";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rain Showers";
    if (code <= 86) return "Snow Showers";
    if (code >= 95) return "Thunderstorm";

    return "Unknown";
}


// AI Recommendation
function generateAIAdvice(weather) {

    const temperature = weather.temperature_2m;
    const humidity = weather.relative_humidity_2m;
    const wind = weather.wind_speed_10m;
    const code = weather.weather_code;

    let advice = "";

    if (code >= 51 && code <= 99) {
        advice += "Carry an umbrella and be careful while travelling. ";
    }

    if (temperature >= 35) {
        advice +=
            "The temperature is high. Stay hydrated and avoid direct sunlight. ";
    } 
    else if (temperature >= 30) {
        advice +=
            "The weather is warm. Drink enough water. ";
    } 
    else if (temperature < 20) {
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


// Search button
document.getElementById("searchBtn")
    .addEventListener("click", getWeather);


// Enter key
document.getElementById("cityInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            getWeather();
        }

    });
