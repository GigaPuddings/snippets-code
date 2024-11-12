import { redirect } from 'react-router-dom'

export default async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  switch (request.method) {
    case 'POST': {
      const category_id : number = await window.api.sql(
        `insert into categories (name,created_at) values ('未命名',datetime('now', 'localtime'))`,
        'insert'
      )

      return redirect(`/config/category/contentList/${category_id}/add`)
    }
    case 'DELETE': {
      await window.api.sql(`delete from categories where id=@id`, 'del', {
        id: data.id
      })
      // await window.api.sql(
      //   `update contents set category_id=0 where category_id=@category_id`,
      //   'update',
      //   {
      //     category_id: data.id
      //   }
      // )
      await window.api.sql(
        `delete from contents where category_id=@category_id`,
        'update',
        {
          category_id: data.id
        }
      )
      return redirect(`/config/category/contentList`)
    }
    case 'PUT': {
      return window.api.sql(`update categories set name=@name where id=@id`, 'update', data)
    }
  }
  return {}
}
