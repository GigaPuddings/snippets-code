import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input } from 'antd';
import type { InputRef } from 'antd';
export const ShortcutModal = ({ visible, onClose, onSave }) => {
  const [keys, setKeys] = useState<string[]>([]); // 用于存储按下的键
  const [shortCut, setShortCut] = useState<string>(''); // 用于显示组合键
  const inputRef = useRef<InputRef | null>(null); // 引用输入框

  // 格式化按键名称
  const formatKey = (key: string): string => key.replace(/Left|Right|Key|Digit/, '');

  // 处理键盘按下事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // 阻止默认事件
    const newKeys = [...keys];

    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      const key = formatKey(e.key);
      if (!newKeys.includes(key)) {
        newKeys.push(key); // 保存组合键
        setKeys(newKeys);
        // 如果按下了字母键或空格键，添加到组合
        if (e.key.match(/^(\w|Space)$/gi)) {
          setShortCut(newKeys.join('+'));
          setKeys([]); // 重置组合键数组
        }
      }
    }

    // 按下 Enter 提交
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 提交快捷键
  const handleSubmit = () => {
    if (shortCut) {
      onSave(shortCut); // 保存组合键
      onClose(); // 关闭模态框
    }
  };

  // 关闭模态框后重置状态
  const handleAfterClose = () => {
    setKeys([]);
    setShortCut('');
  };

  // 使输入框在模态框打开时自动聚焦
  useEffect(() => {
    setTimeout(() => {
      if (visible && inputRef.current) {
        inputRef.current.focus({
          preventScroll: true, // 防止页面跳动
        });
      }
    }, 800);
  }, [visible]);

  return (
    <Modal
      open={visible}
      afterClose={handleAfterClose}
      onCancel={onClose}
      footer={null}
      mask={false}
      width={350}
      keyboard
      closable={false}
    >
      <div className="w-full text-center dark:text-[--mantine-color-gray-light-color]">
        <p className="mb-2 ">按组合键，然后按Enter键提交。</p>
        <Input
          ref={inputRef}
          placeholder="请输入快捷键"
          value={shortCut}
          onKeyDown={handleKeyDown}
          readOnly
        />
      </div>
    </Modal>
  );
};
