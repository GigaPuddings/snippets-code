import React, { useMemo, useEffect, useState } from 'react';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { createTheme, type CreateThemeOptions } from '@uiw/codemirror-themes';
import { useMantineColorScheme } from '@mantine/core';


const CodeMirrorEditor: React.FC<ReactCodeMirrorProps> = (options) => {

  const [type, setType] = useState<'light' | 'dark'>('light');
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setType(colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light');
  }, [colorScheme]);

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

  return (
    <CodeMirror
      className="code-mirror"
      theme={themeOptions}
      extensions={extensions}
      {...options}
    />
  );
};

export default CodeMirrorEditor;
