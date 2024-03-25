const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)

// todo: add database integration to enable username storage

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('💛'))
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