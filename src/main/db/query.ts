import { db } from './connect'

// 查询所有
export const findAll = (sql: string, params = {}) => {
  return db().prepare(sql).all(params)
}

// 查询单条
export const findOne = (sql: string) => {
  return db().prepare(sql).get()
}

// 插入
export const insert = (sql: string) => {
  return db().prepare(sql).run().lastInsertRowid
}

// 更新
export const update = (sql: string, params: Record<string, any>) => {
  return db().prepare(sql).run(params).changes
}

// 删除
export const del = (sql: string, params = {}) => {
  return db().prepare(sql).run(params).changes
}

// export const config = () => {
//   const data = findOne(`select * from config where id=1`) as { content: string }
//   return data ? JSON.parse(data.content) : {}
// }
