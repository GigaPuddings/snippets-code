export default async ({ request }) => {
  const url = new URL(request.url)
  const fileSort = url.searchParams.get('fileSort')

  let sql = `
    select * from categories
  `;

  // 验证 fileSort 参数是否为 "asc" 或 "desc"
  if (fileSort === 'asc' || fileSort === 'desc') {
    sql += ` order by created_at ${fileSort}`
  } else {
    sql += ` order by id desc`
  }

  return await window.api.sql(sql, 'findAll');

}
