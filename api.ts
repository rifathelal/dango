export type Post = {
  id: number | string
  tags: string[]
  url: string
}

export interface APIAdapter {
  id: string
  getPosts: (
    tags?: string[],
    limit?: number,
    random?: boolean,
  ) => Promise<Post[]>
}

type GelbooruResult = {
  post?: {
    id: string
    tags: string
    file_url: string
  }[]
}

export class GelbooruAdapter implements APIAdapter {
  id: string
  BASE_URL: string
  constructor() {
    this.id = 'gelbooru'
    this.BASE_URL =
      'https://ja.gelbooru.com/index.php?page=dapi&s=post&q=index&json=1'
  }

  async getPosts(
    tags?: string[],
    limit?: number,
    random?: boolean,
  ): Promise<Post[]> {
    let url = this.BASE_URL

    const reqTags = []
    if (tags) reqTags.push(...tags)
    if (random) reqTags.push('sort:random')

    url += `&tags=${reqTags.join('%20')}`
    url += `&limit=${limit ?? 100}`

    const result = await fetch(url)
    const resjson: GelbooruResult = await result.json()
    const posts = resjson.post
    return posts?.map(({ id, tags, file_url }) => ({
      id,
      tags: tags.split(' '),
      url: file_url,
    })) ?? []
  }
}
