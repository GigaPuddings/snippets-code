export default async ({ params, request }) => {
  const url = new URL(request.url);
  const searchWord = url.searchParams.get('searchWord');
  const { cid } = params;

  // 基础 SQL 查询语句，使用 JOIN 连接两个表
  let sql = `
    select contents.*, categories.name as category_name
    from contents
    left join categories on contents.category_id = categories.id
  `;

  // 如果用户提供了搜索关键词，则查询符合关键词的内容
  if (searchWord) {
    sql += ` where contents.title like @searchWord order by contents.id desc`;
    return window.api.sql(sql, 'findAll', { searchWord: `%${searchWord}%` });
  }

  // 如果提供了 category_id 则过滤某个分类下的内容
  if (cid !== undefined) {
    sql += ` where contents.category_id = ${cid}`;
  }

  // 最后按 ID 降序排列
  sql += ' order by contents.id desc';

  return window.api.sql(sql, 'findAll');
};
