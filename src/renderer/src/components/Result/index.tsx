import { MouseEvent, useRef } from 'react';
import styles from './style.module.scss'
import useSelect from "@renderer/hooks/useSelect"
import { ApplicationOne, CodeBrackets } from '@icon-park/react';


const DynamicIcon = ({ searchType }: { searchType?: string }) => {
  switch (searchType) {
    case 'window':
      return <ApplicationOne className={styles.icon} theme="outline" size="18" strokeWidth={3} />;
    default:
      return <CodeBrackets className={styles.icon} theme="outline" size="18" strokeWidth={3} />;
  }
};

export default function Result() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, id, selectItem } = useSelect(containerRef);

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const rect = container!.getBoundingClientRect(); // 获取容器边界信息

    // 判断鼠标是否在容器右侧移出
    if (event.clientX >= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
      return
    }

    // 阻止事件冒泡
    event.stopPropagation();

    window.api.hidePreviewWindow(); // 隐藏窗口
    window.api.removePreviewContent(); // 移出监听
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>, item: ContentType, index: number) => {
    event.preventDefault();
    selectItem('click', item, index)
  };

  return (
    <main
      ref={containerRef}
      className={`${styles.main} ${data.length ? 'mt-3' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {
        data.map((item, index) => (
          <div
            key={item.id}
            onClick={(event) => handleClick(event, item, index)}
            className={`${styles.item} ${item.id === id ? styles.active : ''}`}
          >
            <DynamicIcon searchType={item.searchType} />
            <div className={styles.content}>
              <div
                className={styles.title}
              >{item.title}</div>
              <p className={styles.text}>{item.content}</p>
            </div>
          </div>
        ))
      }
    </main>
  )
}
