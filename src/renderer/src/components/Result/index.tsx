import { useRef } from 'react';
import styles from './style.module.scss'
import useSelect from "@renderer/hooks/useSelect"
import { ApplicationOne, CodeBrackets } from '@icon-park/react';
export default function Result() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, id, selectItem } = useSelect(containerRef);
  // const [hoveredItem, setHoveredItem] = useState<number | null>();

  // const handleMouseEnter = (event: MouseEvent<HTMLDivElement>, item: ContentType, index: number) => {
  //   event.preventDefault();
  //   if (hoveredItem === item.id) return
  //   setHoveredItem(item.id);
  //   // 发送给主进程，用于显示子窗口
  //   window.api.showPreviewWindow(item, index)
  // };

  // const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setHoveredItem(null);
  // };

  const handleClick = (item: ContentType) => {
    if (item.searchType === 'window') {
      window.api.openApp(item.content);
    }
    selectItem(item.id);
  };

  const DynamicIcon = ({ searchType }: { searchType?: string }) => {
    switch (searchType) {
      case 'window':
        return <ApplicationOne className={styles.icon} theme="outline" size="18" strokeWidth={3} />;
      default:
        return <CodeBrackets className={styles.icon} theme="outline" size="18" strokeWidth={3} />;
    }
  };

  return (
    // <main ref={containerRef} className={[`${styles.main}`, `${data.length ? 'mt-3' : ''}`].join(' ')}>
    <main
      ref={containerRef}
      className={`${styles.main} ${data.length ? 'mt-3' : ''}`}
    >
      {
        data.map((item) => (
          // onMouseEnter={(event) => handleMouseEnter(event, item, index + 1)}
          //   onMouseLeave={(event)=> handleMouseLeave(event)}

          // <div
          //   key={item.id}
          //   onClick={() => handleClick(item)}
          //   className={[`${styles.item}`, `${item.id === id ? styles.active : ''}`].join(' ')}
          // >
          <div
            key={item.id}
            onClick={() => handleClick(item)}
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
