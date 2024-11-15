// ContentEditor.tsx
import { Form, useLoaderData, useSubmit } from 'react-router-dom';
import { Input } from 'antd';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import CodeMirrorEditor from '@renderer/components/CodeMirrorEditor';
import { debounce } from 'lodash';
import './content.scss';

export default () => {
  const submit = useSubmit();
  const { content } = useLoaderData() as { content: ContentType };

  const [title, setTitle] = useState(content.title);
  const [editorContent, setEditorContent] = useState(content.content);

  // 防抖处理提交
  const debouncedSubmit = useCallback(
    debounce((data: ContentType) => {
      submit(data, { method: 'POST' });
    }, 500),
    []
  );

  // 防抖处理 Title 输入
  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    debouncedSubmit({ ...content, title: value });
  }, [content]);

  // 防抖处理 CodeMirror 的 onChange
  const handleEditorChange = useCallback(
    debounce((value: string) => {
      setEditorContent(value);
      debouncedSubmit({ ...content, content: value });
    }, 100),
    [content]
  );

  useEffect(() => {
    setTitle(content.title);
    setEditorContent(content.content);
  }, [content]);

  return (
    <Form method="PUT">
      <main className="content-main" key={content.id}>
        <input type="text" name="id" defaultValue={content.id} hidden />

        {/* 标题输入框 */}
        <div className="content-title">
          <Input
            value={title}
            name="title"
            autoFocus
            size="small"
            variant="borderless"
            onChange={handleTitleChange}
          />
        </div>

        {/* CodeMirror 编辑器 */}
        <CodeMirrorEditor
          value={editorContent}
          onChange={handleEditorChange}
        />
      </main>
    </Form>
  );
};
