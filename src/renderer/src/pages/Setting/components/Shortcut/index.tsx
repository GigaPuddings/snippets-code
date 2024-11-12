import { Input, message } from "antd";
import { useState } from "react"
import { ShortcutModal } from "../ShortcutModal";
import { useStore } from "@renderer/store/useStore";
import styles from '../../style.module.scss';

export const Shortcut: React.FC = () => {

  const [shortCutType, setShortCutType] = useState<ShortCutType>('search')
  const { config, setConfig } = useStore(state => state);

  const { shortCut } = config

  const [isModalVisible, setIsModalVisible] = useState(false); // 设置快捷键模态框

  // 打开快捷键设置弹框
  const showModal = (type: ShortCutType) => {
    setShortCutType(type)
    setIsModalVisible(true);
  };

  // 关闭快捷键设置弹框
  const handleClose = () => {
    setIsModalVisible(false);
  };

  // 保存快捷键
  const handleSaveShortcut = (newShortcut: string) => {
    const shortCut = config.shortCut

    shortCut[shortCutType] = newShortcut
    setConfig({ ...config, shortCut });



    window.api.shortCut(newShortcut, shortCutType);
    message.success(`快捷键 ${newShortcut} 设置成功！`);
  };

  return (
    <main>
      <section className={styles.section}>
        <div className="flex items-center gap-6">
          <div className="label">工具条唤醒快捷键：</div>
          <Input
            type="text"
            name="search"
            style={{ width: '40%' }}
            readOnly
            value={shortCut.search}
            onClick={() => showModal('search')}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className="flex items-center gap-6">
          <div className="label">主窗口唤醒快捷键：</div>
          <Input
            type="text"
            name="config"
            style={{ width: '40%' }}
            readOnly
            value={shortCut.config}
            onClick={() => showModal('config')}
          />
        </div>
      </section>
      {/* 弹出快捷键设置模态框 */}
      <ShortcutModal
        visible={isModalVisible}
        onClose={handleClose}
        onSave={handleSaveShortcut}
      />
    </main>
  )
}
