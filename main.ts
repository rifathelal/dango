import { BOT_TOKEN, CLIENT_ID, DEBUG, GUILD_ID } from './deps.ts'
import {
  createBot,
  Intents,
  startBot,
} from 'https://deno.land/x/discordeno@18.0.1/mod.ts'
import { events } from './events.ts'

async function main() {
  if (!BOT_TOKEN || !CLIENT_ID) throw 'Invalid environment params!'
  addDebug()

  const intents = Intents.Guilds | Intents.GuildMessages |
    Intents.DirectMessages | Intents.MessageContent

  const bot = createBot({
    token: BOT_TOKEN,
    intents,
    events: events,
  })

  await startBot(bot)
}

function addDebug() {
  if (DEBUG) {
    console.log(BOT_TOKEN)
    console.log(CLIENT_ID)
    console.log(GUILD_ID)
  }
}

main()
