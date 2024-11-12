import { NavLink, useSubmit } from "react-router-dom"
import { DeleteOne } from "@icon-park/react";
import { useContextMenu } from "mantine-contextmenu";
import dayjs from "dayjs";
import styles from './styles.module.scss'
import { message, Modal } from "antd";

interface Props {
  content: ContentType
}
export const ContentItem = ({ content }: Props) => {
  const { showContextMenu } = useContextMenu();

  const [modal, contextHolder] = Modal.useModal();
  const submit = useSubmit()


  // 判断当前时间是否与内容创建时间在同一天
  const isToday = dayjs(content.created_at).isSame(dayjs(), 'day');

  // 显示格式
  const displayDate = isToday
    ? dayjs(content.created_at).format('h:mm a') // 今天，显示 AM/PM 格式
    : dayjs(content.created_at).format('YY/M/D'); // 非当天，显示普通日期

  return (
    <>
      <NavLink
        to={`/config/category/contentList/${content.category_id}/content/${content.id}`}
        className={({ isActive }) => {
          return isActive ? styles.active : styles.link
        }}
        onDragStart={(e) => {
          e.dataTransfer.setData('id', String(content.id))
        }}
        onContextMenu={showContextMenu([
          {
            key: 'delete',
            icon: <DeleteOne theme="outline" size="16" strokeWidth={2} />,
            title: '删除片段',
            onClick: async () => {
              const confirmed = await modal.confirm({
                title: '警告',
                content: '确认要删除该片段吗?',
                cancelText: '取消',
                width: 350,
                okText: '确认',
                okType: "danger"
              });
              if (confirmed) {
                submit({ id: content.id }, { method: 'DELETE' })
                message.success('操作成功')
              }

            },
          }
        ], { className: 'contextMenu' })}
      >
        <div className={styles.item}>
          <div className={styles.header}>{content.title}</div>
          <div className={styles.footer}>
            <div className={styles.folder}>
              <div>{content.category_name}</div>
            </div>
            <div className={styles.date}>{displayDate}</div>
          </div>
        </div>
      </NavLink>
      {contextHolder}
    </>
  )
}
