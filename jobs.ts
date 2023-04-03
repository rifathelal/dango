import { Bot } from 'https://deno.land/x/discordeno@18.0.1/bot.ts'
import { sendMessage } from 'https://deno.land/x/discordeno@18.0.1/mod.ts'
import { getUsersByTags } from './db.ts'

type Post = {
  id: number
  file_url: string
  tags: string
}

let previousData: Post[] = []
export async function fetchUpdates(bot: Bot) {
  const result = await (await fetch(
    `https://ja.gelbooru.com/index.php?page=dapi&s=post&q=index&json=1`,
  )).json() as { post: Post[] }

  const newData = result.post.map(({ id, file_url, tags }) => ({
    id,
    file_url,
    tags,
  }))

  if (previousData.length == 0) {
    previousData = newData
    return
  }

  const newIDs = new Set(newData.map((item) => item.id))
  const previousIDs = new Set(previousData.map((item) => item.id))
  previousIDs.forEach((post) => newIDs.delete(post))

  previousData = newData

  const posts = newData.filter((post) => newIDs.has(post.id))
  for (const post of posts) {
    const users = getUsersByTags(post.tags.split(' '))
    for (const user of users) {
      sendMessage(bot, user, { content: post.file_url })
    }
  }
}
