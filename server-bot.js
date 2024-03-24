// Conventional Commit: fix - Change maxTokens value
const OpenAI = require('openai');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'gpt-3.5-turbo',
            prompt: prompt,
            maxTokens: 200 // Змініть за потребою
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

// Bot commands
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// Handle bot messages
bot.hears('gpt', async (ctx) => {
    const userMessage = ctx.message.text;

    // Get response from ChatGPT based on user message
    const chatGPTResponse = await getChatGPTResponse(userMessage);

    // Reply with the response from ChatGPT
    ctx.reply(chatGPTResponse);
});

// Launch bot
bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
