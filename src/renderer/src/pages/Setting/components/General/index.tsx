import { Computer, Moon, SunOne } from "@icon-park/react";
import { useStore } from "@renderer/store/useStore";
import { message, Select, Switch } from "antd"
import { useEffect, useState } from "react";
import styles from '../../style.module.scss';

export const General: React.FC = () => {
  const [autoLaunch, setAutoLaunch] = useState<boolean>(false); // 开机自启状态
  const [loading, setLoading] = useState<boolean>(false);
  const { theme, setTheme } = useStore(state => state);

  useEffect(() => {
    const initializeSettings = async () => {
      // 获取开机自启状态
      try {
        const isAutoLaunch = await window.api.loginItemSettings();
        console.log('开机自启状态', isAutoLaunch);
        setAutoLaunch(isAutoLaunch);
      } catch (error) {
        console.error('获取自启动状态失败:', error);
      }
    };

    initializeSettings();
  }, []);

  // 开机自启设置
  const handleSetAutoLaunch = async (checked: boolean) => {
    setLoading(true);
    try {
      const result = await window.api.setAutoLaunch(checked);
      setAutoLaunch(result);
      message.success(`开机自启动已${result ? '开启' : '关闭'}`);
    } catch (error) {
      console.error('设置自启动失败:', error);
      message.error('设置开机自启动失败');
    } finally {
      setLoading(false);
    }
  };


  const handleTheme = (value: ThemeType) => {
    setTheme(value)
    // window.api.sendMessage('modalWindowSend', value)
  }
  return (
    <main>
      <section className={styles.section}>
        <div className="flex items-center gap-12">
          <div className="label">设置主题：</div>
          <Select
            value={theme}
            style={{ width: '40%' }}
            onChange={handleTheme}
            options={[
              {
                value: 'light',
                label: <>
                  <div className="flex items-center gap-2">
                    <SunOne theme="outline" />
                    <span className="">浅色</span>
                  </div>
                </>
              },
              {
                value: 'dark',
                label: <>
                  <div className="flex items-center gap-2">
                    <Moon theme="outline" />
                    <span className="">深色</span>
                  </div>
                </>
              },
              {
                value: 'auto',
                label: <>
                  <div className="flex items-center gap-2">
                    <Computer theme="outline" />
                    <span className="">自动</span>
                  </div>
                </>
              }
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className="flex items-center gap-6">
          <div className="label">开机自动启动：</div>
          <Switch
            checked={autoLaunch}
            onChange={handleSetAutoLaunch}
            loading={loading}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </div>
      </section>
    </main>
  )
}
