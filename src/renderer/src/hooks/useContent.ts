import { useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const updateContentCategory = async (id: number, category_id: number) => {
    await window.api.sql(`update contents set category_id=@category_id where id=@id`, 'update', {
      id,
      category_id
    })
    navigate(`/config/category/contentList/${category_id}/content/${id}`)
  }
  return { updateContentCategory }
}
