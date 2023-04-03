import { Bot } from 'https://deno.land/x/discordeno@18.0.1/bot.ts'
import { sendMessage } from 'https://deno.land/x/discordeno@18.0.1/mod.ts'
import { getUsersByTags } from './db.ts'
import { APIAdapter, GelbooruAdapter, Post } from './api.ts'

let previousData: Post[] = []
export async function fetchUpdates(bot: Bot) {
  const api: APIAdapter = new GelbooruAdapter()
  const newData = await api.getPosts()

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
    const users = getUsersByTags(post.tags)
    for (const user of users) {
      sendMessage(bot, user, { content: post.url })
    }
  }
}
