import 'https://deno.land/x/dotenv@v3.2.2/load.ts'

export const DEBUG = Deno.env.get('DEBUG') === 'true'
export const BOT_TOKEN = Deno.env.get('BOT_TOKEN')
export const CLIENT_ID = Deno.env.get('CLIENT_ID')
export const GUILD_ID = Deno.env.get('GUILD_ID')
