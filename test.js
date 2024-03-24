// Прогноз погоди
const axios = require('axios');

async function getWeather(city) {
    const apiKey = '9d8b7911add32dd26e062b424804dd79';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data; // Отримуємо дані з результату запиту

        if (data.cod === 200) {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            return `Погода у місті ${city}: ${weatherDescription}, Температура: ${temperature}°C`;
        } else {
            return 'Не вдалося отримати прогноз погоди. Спробуйте ще раз.';
        }
    } catch (error) {
        console.error('Помилка:', error);
        return 'Сталася помилка при отриманні прогнозу погоди.';
    }
}

// Для тестування
getWeather('Kyiv')
    .then(result => console.log(result))
    .catch(error => console.error(error));