import { Form, useLoaderData, useSubmit } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes';
import './content.scss';
import { ChangeEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useMantineColorScheme } from '@mantine/core';

export default () => {
  const submit = useSubmit();
  const { content } = useLoaderData() as {
    content: ContentType;
  };

  const [type, setType] = useState<'light' | 'dark'>('light');
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setType(colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light');
  }, [colorScheme]);

  const [title, setTitle] = useState(content.title);
  const [editorContent, setEditorContent] = useState(content.content);

  // 使用 useMemo 仅缓存 themeOptions，减少依赖更新
  const themeOptions = useMemo(() => {
    const settings: CreateThemeOptions['settings'] =
      type === 'light'
        ? {
          background: '#ffffff',
          foreground: '#3D3D3D',
          selection: '#BBDFFF',
          gutterBackground: '#ffffff',
        }
        : {
          background: '#292A30',
          foreground: '#CECFD0',
          caret: '#fff',
          selection: '#727377',
        };

    const styles: CreateThemeOptions['styles'] =
      type === 'light'
        ? [
          { tag: [t.comment, t.quote], color: '#707F8D' },
          { tag: [t.keyword], color: '#aa0d91', fontWeight: 'bold' },
          { tag: [t.string, t.meta], color: '#D23423' },
          { tag: [t.variableName], color: '#23575C' },
        ]
        : [
          { tag: [t.comment, t.quote], color: '#7F8C98' },
          { tag: [t.keyword], color: '#FF7AB2', fontWeight: 'bold' },
          { tag: [t.string, t.meta], color: '#FF8170' },
          { tag: [t.variableName], color: '#ACF2E4' },
        ];

    return createTheme({ theme: type, settings, styles });
  }, [type]);

  const extensions = [javascript({ jsx: true })];
  const basicSetup = { autocompletion: false };

  // 防抖处理提交
  const debouncedSubmit = useCallback(
    debounce((data: ContentType) => {
      submit(data, { method: 'POST' });
    }, 500),
    []
  );

  // 防抖处理 CodeMirror 的 onChange
  const handleEditorChange = useCallback(
    debounce((value: string) => {
      setEditorContent(value);
      debouncedSubmit({ ...content, content: value });
    }, 100),
    [content]
  );

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    debouncedSubmit({ ...content, title: value });
  }, [content]);

  useEffect(() => {
    setTitle(content.title);
    setEditorContent(content.content);
  }, [content]);

  return (
    <Form method="PUT">
      <main className="content-main" key={content.id}>
        <input type="text" name="id" defaultValue={content.id} hidden />

        {/* 标题输入框 */}
        <div className='content-title'>
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
        <CodeMirror
          className="code-mirror"
          value={editorContent}
          theme={themeOptions}
          extensions={extensions}
          onChange={handleEditorChange}
          basicSetup={basicSetup}
        />
      </main>
    </Form>
  );
};
