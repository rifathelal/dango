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
import { APIAdapter, GelbooruAdapter } from './api.ts'

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
    let tags: string[]
    if (args.length > 0) tags = args
    else {
      const subs = getSubscriptions(message.channelId)
      tags = [subs[Math.floor(Math.random() * subs.length)]]
    }

    const api: APIAdapter = new GelbooruAdapter()
    const posts = await api.getPosts(tags, 1, true)
    const post = posts.length > 0 ? posts[0] : null

    const embed: Embed | null = post
      ? {
        title: `Gelbooru`,
        url: post.url,
        image: { url: post.url },
        footer: { text: `${tags.join(' ')}` },
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
