import { db } from './connect'

export function initTable() {
  db().exec(`
  create table if not exists categories (
    id integer primary key autoincrement not null,
    name text not null,
    created_at text not null
  );
`)

  db().exec(`
  create table if not exists contents (
    id integer primary key autoincrement not null,
    title text not null,
    content text not null,
    category_id integer,
    created_at text not null
  );
`)

//   db().exec(`
//   create table if not exists config (
//     id integer primary key autoincrement not null,
//     content text not null
//   );
// `)
}

// for (let i = 1; i < 10; i++) {
//   db().exec(`
//   INSERT INTO categories (name,created_at) VALUES('分类_${i}',datetime());
//   `)
//   for (let j = 0; j < 10; j++) {
//     db().exec(
//       `INSERT INTO contents (title,content,category_id,created_at) VALUES('片段_${j}_${i}','zustand','${i}',datetime());`
//     )
//   }
// }
