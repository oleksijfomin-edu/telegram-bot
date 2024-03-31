// Прогноз погоди
const axios = require('axios');

async function getWeather(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data; // Отримуємо дані з результату запиту

        if (data.cod === 200) {
            const weatherID = data.weather[0].id;
            const temperature = data.main.temp;

            weather = translateWeather( weatherID );// Переклад через id
            return `Погода у місті ${city}: ${weather}, Температура: ${temperature}°C`;
        } else {
            return 'Не вдалося отримати прогноз погоди. Спробуйте ще раз.';
        }
    } catch (error) {
        console.error('Помилка:', error);
        return 'Сталася помилка при отриманні прогнозу погоди.';
    }
}
const WEATHER_DICTIONARY = {
    "200": "Гроза з невеликим дощем",
    "201": "Гроза з дощем",
    "202": "Гроза з сильним дощем",
    "210": "Легка гроза",
    "211": "Гроза",
    "212": "Сильна гроза",
    "221": "Розріджена гроза",
    "230": "Гроза з легкою мрякою",
    "231": "Гроза з мрякою",
    "232": "Гроза з сильною мрякою",
    "300": "Легка мряка",
    "301": "Мряка",
    "302": "Сильна мряка",
    "310": "Легка мряка дощ",
    "311": "Мряка дощ",
    "312": "Сильний мряка дощ",
    "313": "Дощ із мрякою",
    "314": "Сильний дощ із мрякою",
    "321": "Легкий мряка з дощем",
    "500": "Легкий дощ",
    "501": "Матеріал дощ",
    "502": "Сильний дощ",
    "503": "Дуже сильний дощ",
    "504": "Екстремальний дощ",
    "511": "Ледяний дощ",
    "520": "Легка злива",
    "521": "Розріджена злива",
    "522": "Сильна злива",
    "531": "Розріджена злива",
    "600": "Легкий сніг",
    "601": "Сніг",
    "602": "Сильний сніг",
    "611": "Дощ із снігом",
    "612": "Дощ із смішаним дощем і снігом",
    "613": "Сніговий дощ",
    "615": "Легкий дощ із снігом",
    "616": "Дощ із снігом",
    "620": "Легкий сніг",
    "621": "Сніг",
    "622": "Сильний сніг",
    "701": "Туман",
    "711": "Дим",
    "721": "Легкий туман",
    "731": "Пил",
    "741": "Туман",
    "751": "Піщано-пиловий вихор",
    "761": "Пилевий вихор",
    "762": "Вулканічний попіл",
    "771": "Шторм",
    "781": "Торнадо",
    "800": "Сонячно",
    "801": "Місьцями хмари",
    "802": "Розсіяні хмари",
    "803": "Хмарно",
    "804": "Затьмарене небо",
};
function translateWeather(weatherID) {
    return WEATHER_DICTIONARY[ weatherID ] || "Невідома погода";
}

// Для тестування
getWeather('Kyiv')
    .then(result => console.log(result))
    .catch(error => console.error(error));
