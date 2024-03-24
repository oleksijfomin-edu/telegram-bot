const OpenAI = require('openai');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const responseCache = {}; // Кеш для збереження результатів запитів до API OpenAI
const MAX_CACHE_SIZE = 100; // Максимальна кількість записів у кеші

// Функція для додавання результату до кешу з обмеженням розміру кешу
function addToCache(key, value) {
    const cacheKeys = Object.keys(responseCache);
    if (cacheKeys.length >= MAX_CACHE_SIZE) {
        const oldestKey = cacheKeys[0];
        delete responseCache[oldestKey];
    }
    responseCache[key] = value;
}

// Функція для надсилання тексту до ChatGPT і отримання результату з вказаною максимальною кількістю токенів
async function getChatGPTResponse(prompt, maxTokens) {
    const cacheKey = `${prompt}_${maxTokens}`;

    // Перевірка наявності результату у кеші
    if (responseCache[cacheKey]) {
        return responseCache[cacheKey];
    }

    try {
        const response = await openai.complete({
            engine: 'gpt-3.5-turbo',
            prompt: prompt,
            maxTokens: maxTokens
        });
        const result = response.data.choices[0].text.trim();

        // Збереження результату у кеші з обмеженням розміру
        addToCache(cacheKey, result);

        return result;
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

// Обробник вхідних повідомлень бота
bot.hears(/\/gpt maxTokens (\d+)/, async (ctx) => {
    const maxTokens = ctx.match[1];
    const userMessage = ctx.message.text;

    // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача та максимальної кількості токенів
    const chatGPTResponse = await getChatGPTResponse(userMessage, maxTokens);

    // Надсилаємо отриману відповідь користувачеві
    ctx.reply(chatGPTResponse);
});

// Обробник команди /start
bot.start((ctx) => ctx.reply('Welcome'));

// Обробник команди /help
bot.help((ctx) => ctx.reply('Send me a sticker'));

// Обробник стікерів
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

// Обробник команди "hi"
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// Запуск бота
bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
