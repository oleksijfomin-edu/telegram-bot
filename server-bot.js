const OpenAI = require('openai');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

// Перевірка чи існує значення змінної BOT_TOKEN в середовищі
if (!process.env.BOT_TOKEN) {
    console.error('Не встановлено змінну середовища BOT_TOKEN');
    process.exit(1);
}

// Перевірка чи існує значення змінної OPENAI_API_KEY в середовищі
if (!process.env.OPENAI_API_KEY) {
    console.error('Не встановлено змінну середовища OPENAI_API_KEY');
    process.exit(1);
}

// Перевірка чи існує значення змінної WEBHOOK_DOMAIN в середовищі
if (!process.env.WEBHOOK_DOMAIN) {
    console.error('Не встановлено змінну середовища WEBHOOK_DOMAIN');
    process.exit(1);
}

// Перевірка чи існує значення змінної PORT в середовищі
if (!process.env.PORT) {
    console.error('Не встановлено змінну середовища PORT');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'text-davinci-002',
            prompt: prompt,
            maxTokens: 100 // Змініть за потребою
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

bot.start((ctx) => ctx.reply('Hola')); // Змінено текст на 'Hola'
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍')); // Виправлено фільтр для стікерів
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

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
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
