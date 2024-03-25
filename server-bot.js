const OpenAI = require('openai');

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

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
