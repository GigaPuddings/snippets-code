import { Delete, Edit } from "@icon-park/react"
import { useContextMenu } from "mantine-contextmenu"
import { useSubmit } from "react-router-dom"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useStore } from "@renderer/store/useStore";
import styles from './styles.module.scss'
import useContent from "../useContent";
import { DragEvent } from "react";
const { confirm } = Modal;

export default (category: CategoryType) => {
  const { showContextMenu } = useContextMenu()
  const { setEditCategoryId } = useStore(state => state)
  const { updateContentCategory } = useContent()
  const submit = useSubmit()

  function handleDel(name: string) {
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: `确认删除${name}？包含的片段内容将会彻底删除，请谨慎操作!`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        submit({ id: category.id }, { method: 'DELETE' });
        message.success('操作成功')
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const contextMenu = () => {
    return showContextMenu([
      {
        key: 'edit',
        icon: <Edit theme="outline" size="16" strokeWidth={2} />,
        title: '重命名',
        onClick: () => setEditCategoryId(category.id),
      },
      {
        key: 'delete',
        icon: <Delete theme="outline" size="16" strokeWidth={2} />,
        title: '删除文件夹',
        onClick: () => handleDel(category.name),
      },
    ], { className: 'contextMenu' })
  }

  const dragHandle =  {
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      e!.dataTransfer!.dropEffect = 'move'
      const el = e.currentTarget as HTMLDivElement
      el.classList.add(styles.daring)
    },
    onDragLeave: (e: DragEvent) => {
      const el = e.currentTarget as HTMLDivElement
      el.classList.remove(styles.daring)
    },
    onDrop: (e: DragEvent) => {
      const el = e.currentTarget as HTMLDivElement
      el.classList.remove(styles.daring)
      const id = e!.dataTransfer!.getData('id')
      updateContentCategory(Number(id), category.id)
    }
  }

  return { contextMenu, dragHandle }
}
