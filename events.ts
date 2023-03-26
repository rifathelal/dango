import { EventHandlers } from 'https://deno.land/x/discordeno@18.0.1/mod.ts'
import { commands } from './commands.ts'

const ready: EventHandlers['ready'] = (_bot, payload) => {
  console.log(`Ready! Logged in as ${payload.user.username}`)
}

const messageCreate: EventHandlers['messageCreate'] = async (bot, message) => {
  const content = message.content.split(' ')
  if (content.length == 0) return

  let ucommand = content[0]?.toLowerCase()
  if (ucommand.length < 2 || !ucommand.startsWith('+')) return
  ucommand = ucommand.substring(1)
  const args = content.slice(1)

  const command = commands.find((command) =>
    command.name == ucommand || (command.aliases?.includes(ucommand) ?? false)
  )

  if (command) await command.execute(bot, message, args)
}

export const events: Partial<EventHandlers> = { ready, messageCreate }

// async messageCreate(bot, message) {

//   async function checkMessage(message: Message) {
//     if (message.embeds.length == 0) return
//     else {
//       const embed = message.embeds[0]
//       if (embed.description?.includes('Maintenance has ended')) {
//         await deleteMessage(bot, message.channelId, message.id)
//       }
//     }
//   }

//   if (message.embeds.length == 0) {
//     setTimeout(async () => {
//       console.log('late print')
//       await checkMessage(message)
//     }, 5000)
//   } else {
//     console.log('early print')
//     await checkMessage(message)
//   }
// },
