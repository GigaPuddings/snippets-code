import { db } from './connect'

export const findAll = (sql: string, params = {}) => {
  return db().prepare(sql).all(params)
}

export const findOne = (sql: string) => {
  return db().prepare(sql).get()
}

export const insert = (sql: string) => {
  return db().prepare(sql).run().lastInsertRowid
}

export const update = (sql: string, params: Record<string, any>) => {
  return db().prepare(sql).run(params).changes
}

export const del = (sql: string, params = {}) => {
  return db().prepare(sql).run(params).changes
}

// export const config = () => {
//   const data = findOne(`select * from config where id=1`) as { content: string }
//   return data ? JSON.parse(data.content) : {}
// }
