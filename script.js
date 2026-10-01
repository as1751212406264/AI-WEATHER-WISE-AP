const API_KEY = "YOUR_API_KEY";

const API_URL =
    "https://api.openweathermap.org/data/2.5/weather";


async function getWeather() {

    const city =
        document.getElementById("cityInput").value.trim();

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const result =
        document.getElementById("weatherResult");


    // Check city input

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    // Show loading

    loading.style.display = "block";

    error.style.display = "none";

    result.style.display = "none";


    try {

        const url =
            `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;


        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "City not found. Please enter a valid city."
                );

            }

            if (response.status === 401) {

                throw new Error(
                    "Invalid API key. Please check your API key."
                );

            }

            throw new Error(
                "Unable to get weather information."
            );
        }


        const data =
            await response.json();


        displayWeather(data);


    } catch (err) {

        showError(err.message);

    } finally {

        loading.style.display = "none";
    }
}


// Display weather

function displayWeather(data) {

    document.getElementById("weatherResult")
        .style.display = "block";


    // City

    document.getElementById("cityName")
        .textContent = data.name;


    // Country

    document.getElementById("country")
        .textContent = data.sys.country;


    // Temperature

    document.getElementById("temperature")
        .textContent =
        `${Math.round(data.main.temp)}°C`;


    // Feels like

    document.getElementById("feelsLike")
        .textContent =
        `Feels like: ${Math.round(data.main.feels_like)}°C`;


    // Description

    document.getElementById("description")
        .textContent =
        data.weather[0].description;


    // Weather icon

    const icon =
        data.weather[0].icon;

    document.getElementById("weatherIcon")
        .src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;


    // Humidity

    document.getElementById("humidity")
        .textContent =
        `${data.main.humidity}%`;


    // Wind

    document.getElementById("wind")
        .textContent =
        `${data.wind.speed} m/s`;


    // Pressure

    document.getElementById("pressure")
        .textContent =
        `${data.main.pressure} hPa`;


    // Visibility

    const visibility =
        data.visibility / 1000;

    document.getElementById("visibility")
        .textContent =
        `${visibility.toFixed(1)} km`;


    // Sunrise

    document.getElementById("sunrise")
        .textContent =
        convertTime(data.sys.sunrise);


    // Sunset

    document.getElementById("sunset")
        .textContent =
        convertTime(data.sys.sunset);


    // AI recommendation

    const advice =
        generateAIAdvice(data);

    document.getElementById("aiAdvice")
        .textContent = advice;
}


// AI Weather Recommendation

function generateAIAdvice(data) {

    const temperature =
        data.main.temp;

    const humidity =
        data.main.humidity;

    const weather =
        data.weather[0].main.toLowerCase();

    const wind =
        data.wind.speed;


    let advice = "";


    // Rain

    if (
        weather.includes("rain") ||
        weather.includes("drizzle") ||
        weather.includes("thunderstorm")
    ) {

        advice +=
            "Rainy conditions are expected. Carry an umbrella and be careful while travelling. ";
    }


    // Hot weather

    if (temperature >= 35) {

        advice +=
            "The temperature is high. Stay hydrated and avoid spending too much time in direct sunlight. ";
    }

    else if (temperature >= 30) {

        advice +=
            "The weather is warm. Drink enough water and stay comfortable outdoors. ";
    }


    // Cold weather

    if (temperature < 20) {

        advice +=
            "The weather is relatively cool. Wear suitable clothing when going outside. ";
    }


    // High humidity

    if (humidity >= 80) {

        advice +=
            "Humidity is high, so outdoor activities may feel uncomfortable. ";
    }


    // Strong wind

    if (wind >= 10) {

        advice +=
            "Wind speed is high. Take extra care during outdoor activities. ";
    }


    // Clear weather

    if (
        weather.includes("clear") &&
        temperature < 35
    ) {

        advice +=
            "Weather conditions look generally suitable for normal outdoor activities. ";
    }


    // Default

    if (advice === "") {

        advice =
            "Weather conditions look moderate. Have a safe and comfortable day!";
    }


    return advice;
}


// Convert Unix time

function convertTime(timestamp) {

    const date =
        new Date(timestamp * 1000);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// Error message

function showError(message) {

    const error =
        document.getElementById("error");

    error.textContent = message;

    error.style.display = "block";

    document.getElementById("weatherResult")
        .style.display = "none";
}


// Press Enter to search

document.getElementById("cityInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            getWeather();
        }

    });
