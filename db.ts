import { DB } from 'https://deno.land/x/sqlite@v3.7.0/mod.ts'

let db: DB | null
export function getDB(isTest?: boolean) {
  let path = 'data.db'
  if (isTest) path = 'test.db'
  if (!db) db = new DB(path)
  return db
}

export function wipeDB(isTest: boolean) {
  const db = getDB(isTest)
  db.execute(`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS subscriptions;
  `)
}

export function initDB(isTest: boolean) {
  db = getDB(isTest)
  db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id  BIGINT PRIMARY KEY
  );
  
  CREATE TABLE IF NOT EXISTS subscriptions (
    user_id   BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name      TEXT
  );
  `)
}

export function addUserIfNotExists(userID: bigint) {
  const db = getDB()
  db.query(`INSERT INTO users (id) VALUES (?) ON CONFLICT DO NOTHING`, [userID])
}

export function isAlreadySubbed(userID: bigint, tag: string) {
  const db = getDB()
  return db.query(
    `SELECT user_id FROM subscriptions WHERE user_id = ? AND name = ?`,
    [userID, tag],
  ).length > 0
}

export function subscribe(userID: bigint, tag: string) {
  addUserIfNotExists(userID)

  const db = getDB()
  db.query(
    `INSERT INTO subscriptions (user_id, name) VALUES (?, ?)`,
    [userID, tag],
  )
}

export function unsubscribe(userID: bigint, tag: string) {
  const db = getDB()
  db.query(
    `DELETE FROM subscriptions WHERE user_id = ? AND name = ?`,
    [userID, tag],
  )
}

export function subIfNotSubbed(userID: bigint, tag: string) {
  if (!isAlreadySubbed(userID, tag)) subscribe(userID, tag)
}

export function getSubscriptions(userID: bigint) {
  const db = getDB()
  const tagList = db.query(
    `SELECT name FROM subscriptions WHERE user_id = ?`,
    [userID],
  )
  return tagList.map((value) => value[0])
}
