import {
  Bot,
  CreateMessage,
  Embed,
  Message,
  sendMessage,
} from 'https://deno.land/x/discordeno@18.0.1/mod.ts'
import {
  getSubscriptions,
  subIfNotSubbed,
  unsubscribe as unsubscribeDB,
} from './db.ts'

export type Command = {
  name: string
  description: string
  aliases?: string[]
  execute: (bot: Bot, message: Message, args: string[]) => Promise<void>
}

const ping: Command = {
  name: 'ping',
  description: 'Replies with ping!',
  execute: async (bot, message, _args) => {
    await sendMessage(bot, message.channelId, { content: 'Pong!' })
  },
}

const subscribe: Command = {
  name: 'subscribe',
  description: 'Subscribe to a tag',
  execute: async (bot, message, args) => {
    const utag = args[0]
    subIfNotSubbed(message.channelId, utag)
    await sendMessage(bot, message.channelId, {
      content: `Subscribed \`${message.tag}\` to \`${utag}\``,
    })
  },
}

const unsubscribe: Command = {
  name: 'unsubscribe',
  description: 'Unsubscribe to a tag',
  execute: async (bot, message, args) => {
    const utag = args[0]
    unsubscribeDB(message.channelId, utag)
    await sendMessage(bot, message.channelId, {
      content: `Unsubscribed \`${message.tag}\` to \`${utag}\``,
    })
  },
}

const showList: Command = {
  name: 'list',
  description: 'Show subscribed tag list',
  execute: async (bot, message, _args) => {
    const userlist = getSubscriptions(message.channelId)
    const message1 = `\`\`\`\n${userlist.join('\n')}\n\`\`\``
    await sendMessage(bot, message.channelId, {
      content: `${message1}`,
    })
  },
}

const fetchPost: Command = {
  name: 'fetch',
  description: 'Fetch an image from konachan',
  execute: async (bot, message, args) => {
    let tag
    if (args.length > 0) tag = args.join('%20')
    else {
      const subs = getSubscriptions(message.channelId)
      tag = subs[Math.floor(Math.random() * subs.length)]
    }

    const result = await fetch(
      `https://ja.gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${tag}%20sort:random`,
    )
    const postjson = await result.json()
    const post = postjson?.post?.[0]?.file_url as string
    const posttags = postjson?.post?.[0]?.tags as string
    const embed: Embed | null = post
      ? {
        title: `Gelbooru`,
        url: post,
        image: { url: post },
        footer: { text: `${tag}` },
        // footer: { text: `${tag} | ${posttags}` },
      }
      : null
    const reply: CreateMessage = embed
      ? { embeds: [embed] }
      : { content: 'Not found' }
    await sendMessage(bot, message.channelId, reply)
  },
}

export const commands: Command[] = [
  ping,
  subscribe,
  unsubscribe,
  showList,
  fetchPost,
]
