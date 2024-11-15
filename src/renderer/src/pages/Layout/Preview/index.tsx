import { useState, useEffect, MouseEvent } from 'react';
import { debounce } from 'lodash';
import CodeMirrorEditor from '@renderer/components/CodeMirrorEditor';
import { Statistics } from '@uiw/react-codemirror';

function Preview() {
  const [content, setContent] = useState<Pick<ContentType, 'title' | 'content'>>();
  const [data, setData] = useState<Statistics>();

  const basicSetup = { autocompletion: false, highlightActiveLine: false, lineNumbers: false, foldGutter: false };

  useEffect(() => {
    // 监听来自主窗口的内容更新
    const updateContent = (item: Pick<ContentType, 'title' | 'content'>) => {
      if (item.content !== content?.content || item.title !== content?.title) {
        setContent(item);
      }
    };

    if (window.api && window.api.updatePreviewContent) {
      window.api.updatePreviewContent(updateContent);
    }

    return () => {
      if (window.api && window.api.removePreviewContent) {
        window.api.removePreviewContent();
      }
    };
  }, [content]);

  // 防抖后的 onStatistics
  const onStatistics = debounce((data: Statistics) => {
    setData(data);
  }, 300);  // 300ms 防抖延迟

  // 鼠标移出窗口外隐藏预览窗口
  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    window.api.hidePreviewWindow();
  };

  return (
    <div className="relative max-h-screen w-screen p-3" onMouseLeave={handleMouseLeave}>
      {content && (
        <>
          {/* <div className="tooltip-arrow"></div> */}
          <div className="h-full bg-gray-100 dark:bg-[#282d32] border dark:border-[#43444e] rounded-md p-2 pb-1 overflow-hidden">
            <CodeMirrorEditor
              value={content.content}
              readOnly={true}
              editable={false}
              autoFocus={false}
              basicSetup={basicSetup}
              onStatistics={onStatistics}
            />
            <div className="mt-1 text-right">
              <span className="px-2 py-[1px] dark:text-[#c9ccd4] text-slate-600 dark:bg-gray-700 text-xs shadow-sm rounded-md">
                行数: {data?.lineCount}
              </span>
              <span className="ml-1 px-2 py-[1px] dark:text-[#c9ccd4] text-slate-600 dark:bg-gray-700 text-xs shadow-sm rounded-md">
                长度: {data?.length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Preview;
