const OpenAI = require('openai');
const axios = require('axios');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'gpt-4.0-turbo', // Зміна версії GPT
            prompt: prompt,
            maxTokens: 120 // Змінено значення maxTokens
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

//==================================================================================================
//Функція що дає прогноз погоди в певному місті
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

bot.command('weather', async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' '); // Отримуємо назву міста з тексту команди
    try {
        const weatherInfo = await getWeather(city);
        ctx.reply(weatherInfo);
    } catch (error) {
        ctx.reply('Сталася помилка при отриманні прогнозу погоди.');
    }
});
//====================================================================================================

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👌'))//Зміна смайлика
bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
// Додамо можливість відповіді на повідомлення "bye"
bot.hears('bye', (ctx) => ctx.reply('Goodbye!'))

// Додамо нову функціональність: відправку випадкової фрази при отриманні команди "/random"
bot.command('random', (ctx) => {
    const phrases = ['Hello!', 'How are you?', 'Have a nice day!'];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    ctx.reply(phrases[randomIndex]);
});

// Оновлення функціональності для відправлення повідомлення про зміну режиму
bot.command('change_mode', (ctx) => {
    ctx.reply('Режим успішно змінено!');
});

// Видаляємо застарілий обробник повідомлень для команди "/old_command"
bot.hears('old_command', (ctx) => {
    ctx.reply('Вибачте, команда old_command була застарілою та видалена. Будь ласка, використовуйте команду new_command замість неї.');
});


// Обробник вхідних повідомлень бота
bot.hears('gpt', async (ctx) => {
    const userMessage = ctx.message.text;

    // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача
    const chatGPTResponse = await getChatGPTResponse(userMessage);

    // Надсилаємо отриману відповідь користувачеві
    ctx.reply(chatGPTResponse);
});

bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
})

// Обробка сигналу SIGINT
process.once('SIGINT', () => {
    bot.stop('SIGINT');
    console.log('Bot stopped gracefully on SIGINT');
});

// Обробка сигналу SIGTERM
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    console.log('Bot stopped gracefully on SIGTERM');
});
