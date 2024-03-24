const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)

// BREAKING CHANGE: The bot now handles text messages instead of stickers
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a message'))
bot.on(message('text'), (ctx) => ctx.reply('😊'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// New feature: Receive stickers and reply with emoji
bot.on(message('sticker'), (ctx) => ctx.reply('🎉'))
