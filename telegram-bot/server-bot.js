const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.command('echo', (ctx) => {
    const text = ctx.message.text.replace('/echo', '').trim(); // Отримуємо текст без команди "/echo"
    if (text) {
        ctx.reply(text);
    } else {
        ctx.reply('Please provide text to echo.');
    }
});
bot.on(message('sticker'), (ctx) => ctx.reply('😊'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
