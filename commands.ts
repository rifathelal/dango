import {
  Bot,
  Message,
  sendMessage,
} from 'https://deno.land/x/discordeno@18.0.1/mod.ts'

const data: { tag: string; server: string; sublist: (number | bigint)[] }[] = []

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

const register: Command = {
  name: 'register',
  description: 'Registers a tag',
  execute: async (bot, message, args) => {
    const utag = args[0], userver = args[1]

    let tag = data.find((x) => x.tag == utag && x.server == userver)
    if (!tag) {
      tag = { tag: utag, server: userver, sublist: [] }
      data.push(tag)
    }

    const sublist = tag.sublist
    if (!sublist.includes(message.channelId)) sublist.push(message.channelId)
    await sendMessage(bot, message.channelId, {
      content: `Registered \`${utag}\` for @${message.tag}`,
    })
  },
}

const showList: Command = {
  name: 'list',
  description: 'Show tag list',
  execute: async (bot, message, _args) => {
    const udata = data.filter((x) => x.sublist.includes(message.channelId)).map(
      (y) => y.tag,
    ).join('\n')
    await sendMessage(bot, message.channelId, { content: `\`${udata}\`` })
  },
}

const fetchPost: Command = {
  name: 'fetch',
  description: 'Fetch an image from konachan',
  execute: async (bot, message, args) => {
    let tag
    if (args.length > 0) tag = args.join('%20')
    else {
      const udata = data.filter((x) => x.sublist.includes(message.channelId))
        .map(
          (y) => y.tag,
        )
      tag = udata[Math.floor(Math.random() * udata.length)]
    }

    const post = await fetch(
      `https://ja.gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${tag}%20sort:random`,
    )
    const postjson = await post.json()

    await sendMessage(bot, message.channelId, {
      content: `${postjson?.post[0].file_url}`,
    })
  },
}

export const commands: Command[] = [ping, register, showList, fetchPost]
