const axios = require('axios');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const integrationChatGPT = require('./src/integrations/chatgpt');

const bot = new Telegraf(process.env.BOT_TOKEN)


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

//====================================================================================================
bot.command('royalestats', async (ctx) => {
    // Отримуємо хештег гравця з тексту команди
    const playerTag = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!playerTag) {
        return ctx.reply('Будь ласка, вкажіть хештег гравця після команди /royalestats');
    }

    // remove # char
    if (playerTag.startsWith('#')){
        playerTag = playerTag.replace('#', '')
    }
    
    try {
        // Запитуємо дані гравця за допомогою Clash Royale API
        const response = await axios.get(`https://api.clashroyale.com/v1/players/%23${playerTag}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CLASH_ROYALE_API_TOKEN}`,
            }
        });
    
        const playerData = response.data;
    
            // Формуємо відповідь із даними гравця
        const trophies = playerData.trophies;
        const playerLevel = playerData.expLevel;
        const clanName = playerData.clan ? playerData.clan.name : 'Не в кланi';
        const clanRole = playerData.clan ? playerData.role : '';
    
        const message = `
            Ім'я гравця: ${playerData.name}
            Кубків: ${trophies}
            Рівень: ${playerLevel}
            Клан: ${clanName} (${clanRole})
        `;
    
        // Надсилаємо повідомлення з інформацією про гравця
        ctx.reply(message);
    } catch (error) {
        console.error('Помилка при отриманні даних гравця:', error);
        ctx.reply('Виникла помилка при отриманні даних гравця. Будь ласка, спробуйте пізніше.');
    }
});
//==================================================================================================== 

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

integrationChatGPT(bot);

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
