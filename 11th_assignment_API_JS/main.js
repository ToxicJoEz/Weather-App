
const ApiKey = '6f27181e16e44576869183251241312';
let typingTimer; // Timer for debouncing
const debounceTime = 500; // Delay in milliseconds

// Default fallback city
const fallbackCity = 'Alex';

// Detect user location and fetch default weather
function detectLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${latitude},${longitude}&days=3`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch weather data");
                        }
                        return response.json();
                    })
                    .then(weatherData => {
                        updateWeatherCards(weatherData);
                    })
                    .catch(error => {
                        console.error("Error fetching weather data by location:", error);
                        fetchWeatherByCity(fallbackCity); // Fallback to default city
                    });
            },
            (error) => {
                console.error("Geolocation error:", error);
                fetchWeatherByCity(fallbackCity); // Fallback to default city
            }
        );
    } else {
        console.error("Geolocation not supported");
        fetchWeatherByCity(fallbackCity); // Fallback to default city
    }
}

// Fetch weather data by city name
function fetchWeatherByCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${city}&days=3`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            return response.json();
        })
        .then(weatherData => {
            updateWeatherCards(weatherData);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            clearWeatherCards();
        });
}

// Real-time search as user types
document.getElementById('city').addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const city = document.getElementById('city').value;

        if (city.trim() === '') {
            fetchWeatherByCity(fallbackCity); // Reset to default city if input is cleared
        } else {
            fetchWeatherByCity(city);
        }
    }, debounceTime);
});

// Update weather cards
function updateWeatherCards(weatherData) {
    const location = weatherData.location;
    const currentWeather = weatherData.current;
    const forecast = weatherData.forecast.forecastday;

    // Update current day card
    const localDate = new Date(location.localtime);
    const dayName = localDate.toLocaleString('en-US', { weekday: 'long' });
    const dateString = localDate.toLocaleDateString();

    document.getElementById('locationName').textContent = location.name;
    document.getElementById('date').textContent = dateString;
    document.getElementById('day').textContent = dayName;
    document.getElementById('temperature').textContent = currentWeather.temp_c;
    document.getElementById('condition').textContent = currentWeather.condition.text;
    document.getElementById('windSpeed').textContent = currentWeather.wind_kph;
    document.getElementById('currentIcon').src = `https:${currentWeather.condition.icon}`;

    // Update next day forecast card
    const nextDay = forecast[1];
    const nextDayDate = new Date(nextDay.date);
    const nextDayName = nextDayDate.toLocaleString('en-US', { weekday: 'long' });

    document.getElementById('day1Name').textContent = nextDayName;
    document.getElementById('day1Temp').textContent = nextDay.day.avgtemp_c;
    document.getElementById('day1Condition').textContent = nextDay.day.condition.text;
    document.getElementById('day1Icon').src = `https:${nextDay.day.condition.icon}`;

    // Update the day after tomorrow forecast card
    const followingDay = forecast[2];
    const followingDayDate = new Date(followingDay.date);
    const followingDayName = followingDayDate.toLocaleString('en-US', { weekday: 'long' });

    document.getElementById('day2Name').textContent = followingDayName;
    document.getElementById('day2Temp').textContent = followingDay.day.avgtemp_c;
    document.getElementById('day2Condition').textContent = followingDay.day.condition.text;
    document.getElementById('day2Icon').src = `https:${followingDay.day.condition.icon}`;
}

// Clear weather cards
function clearWeatherCards() {
    document.getElementById('locationName').textContent = "City Name";
    document.getElementById('date').textContent = "";
    document.getElementById('day').textContent = "";
    document.getElementById('temperature').textContent = "";
    document.getElementById('condition').textContent = "";
    document.getElementById('windSpeed').textContent = "";
    document.getElementById('currentIcon').src = "";

    document.getElementById('day1Name').textContent = "Next Day";
    document.getElementById('day1Temp').textContent = "";
    document.getElementById('day1Condition').textContent = "";
    document.getElementById('day1Icon').src = "";

    document.getElementById('day2Name').textContent = "Following Day";
    document.getElementById('day2Temp').textContent = "";
    document.getElementById('day2Condition').textContent = "";
    document.getElementById('day2Icon').src = "";
}

// Initialize by detecting location
detectLocationAndFetchWeather();
