const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        // todo: send chat message to gpt
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

const integrationChatGPT = (bot) => {
    // Обробник вхідних повідомлень бота
    bot.test('gpt', async (ctx) => {
        const userMessage = ctx.message.text;

        // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача
        const chatGPTResponse = await getChatGPTResponse(userMessage);

        // Надсилаємо отриману відповідь користувачеві
        ctx.reply(chatGPTResponse);
    });
}

module.exports = integrationChatGPT;
