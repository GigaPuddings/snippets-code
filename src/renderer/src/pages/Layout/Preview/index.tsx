import { MouseEvent, useEffect, useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function Preview() {
  const [content, setContent] = useState<Pick<ContentType, 'title' | 'content'>>();


  // 使用 useMemo 来缓存扩展，避免每次渲染时重新创建
  const extensions = useMemo(() => [javascript({ jsx: true })], []);
  const basicSetup = useMemo(() => ({ autocompletion: false, highlightActiveLine: false, lineNumbers: false, foldGutter: false }), []);

  useEffect(() => {
    // 监听来自主窗口的内容更新
    if (window.api && window.api.updatePreviewContent) {
      window.api.updatePreviewContent((item: Pick<ContentType, 'title' | 'content'>) => {
        setContent(item);
      });
    }

    return () => {
      window.api.removePreviewContent()
    };
  }, []);

  // 鼠标移出窗口外隐藏预览窗口
  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    window.api.hidePreviewWindow()
  };

  return (
    <div className="relative max-h-screen w-screen p-3" onMouseLeave={(event) => handleMouseLeave(event)}>
      {content && (
        <>
          {/* <div className="tooltip-arrow"></div> */}
          <div className="h-full bg-gray-100 border rounded-md p-2 overflow-hidden">
            <CodeMirror
              className="relative z-0 rounded-md overflow-auto max-h-[calc(100vh-40px)] text-xs bg-slate-50"
              value={content.content}
              // theme={vscodeLight}
              readOnly={true}
              editable={false}
              autoFocus={false}
              extensions={extensions}
              basicSetup={basicSetup}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Preview
