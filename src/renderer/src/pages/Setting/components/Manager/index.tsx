import { useStore } from "@renderer/store/useStore";
import { Button, Input, message, Select, Space } from 'antd'
import { useEffect } from "react";
import styles from '../../style.module.scss';

export const Manger: React.FC = () => {
  const { config, setConfig, selectDatabase, setSelectDatabase } = useStore(state => state);
  useEffect(() => {
    const initializeSettings = async () => {
      if (!config.databaseDirectory) {
        // 获取默认数据库目录
        try {
          const path = await window.api.getDatabaseDirectory();
          setConfig({ ...config, databaseDirectory: path });
        } catch (error) {
          message.error('获取数据库目录失败, 请选择新的路径')
          console.error('获取数据库目录失败:', error);
        }
      }

    };

    initializeSettings();
  }, [config, setConfig]);

  // 数据备份
  const handleBackup = async () => {
    try {
      const backupDir = await window.api.backupDatabase(selectDatabase);
      if (backupDir) {
        message.success(`备份成功，路径为: ${backupDir}`);
      } else {
        message.info('备份操作已取消');
      }
    } catch (error) {
      console.error('备份失败:', error);
      message.error('备份失败');
    }
  };

  // 数据恢复
  const handleRestore = async () => {
    try {
      const restorePath = await window.api.restoreDatabase();
      if (restorePath) {
        setConfig({ ...config, databaseDirectory: restorePath });
        // 重启应用
        if (process.env.NODE_ENV === 'production') {
          window.api.windowReset();
        }
        message.success(`数据恢复成功，路径为: ${restorePath}`);
      } else {
        message.info('恢复操作已取消');
      }
    } catch (error) {
      console.error('恢复失败:', error);
      message.error('恢复失败');
    }
  };
  return (
    <main>
      <section className={styles.section}>
        <div className="flex items-center gap-6">
          <div className="label">数据库目录：</div>
          <Input
            style={{ width: '70%' }}
            type="text"
            readOnly
            name="databaseDirectory"
            value={config.databaseDirectory}
          />
        </div>
      </section>


      <section className={styles.section}>
        <div className="flex items-center gap-10">
          <div className="label">数据备份：</div>
          <Select
            value={selectDatabase}
            style={{ width: '40%' }}
            onChange={setSelectDatabase}
            options={[
              { value: 'A', label: '年-月-日' },
              { value: 'B', label: '时-分-秒' },
              { value: 'C', label: '年-月-日-时-分-秒' },
            ]}
          />
        </div>
      </section>

      <Space className="flex justify-center mr-10 mt-5">
        <Button type="primary" onClick={handleBackup}>
          开始备份
        </Button>
        <Button type="primary" onClick={handleRestore}>
          恢复数据
        </Button>
      </Space>
    </main>
  )
}
