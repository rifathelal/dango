import './deps.ts'
import { createBot, Intents, startBot, getChannel, getMessage, Message, deleteMessage, sendMessage } from 'https://deno.land/x/discordeno@18.0.1/mod.ts'

const DEBUG = Deno.env.get('DEBUG') === 'true'
const BOT_TOKEN = Deno.env.get('BOT_TOKEN')
const CLIENT_ID = Deno.env.get('CLIENT_ID')
const GUILD_ID = Deno.env.get('GUILD_ID')

async function main() {
  if (!BOT_TOKEN || !CLIENT_ID) {
    console.error('Invalid environment params!')
    return
  } else if (DEBUG) {
    console.log(BOT_TOKEN)
    console.log(CLIENT_ID)
    console.log(GUILD_ID)
  }

  const bot = createBot({
    token: BOT_TOKEN,
    intents: 
      Intents.Guilds | Intents.GuildMessages | 
      Intents.DirectMessages | Intents.MessageContent,
    events: {
      ready(_bot, payload) {
        console.log(`Ready! Logged in as ${payload.user.username}`)
      },
      async messageCreate(bot, message) {
        async function checkMessage(message: Message) {
          if (message.embeds.length == 0) return
          else {
            const embed = message.embeds[0]
            if (embed.description?.includes('Maintenance has ended')) {
              await deleteMessage(bot, message.channelId, message.id)
            }
          }
        }
        
        if (message.embeds.length == 0) {
          setTimeout(async () => {
            console.log('late print')
            await checkMessage(message)
          }, 5000)
        } else {
          console.log('early print')
          await checkMessage(message)
        }
      }
    },
  });

  await startBot(bot)
}

main()