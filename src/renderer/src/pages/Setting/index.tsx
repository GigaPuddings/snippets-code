import { ContentBar } from "@renderer/components/ContentBar";
import { Tabs, TabsProps } from "antd";
import { General } from "./components/General";
import { Manger } from "./components/Manager";
import { Shortcut } from "./components/Shortcut";
export default () => {

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '快捷键',
      children: <Shortcut />,
    },
    {
      key: '2',
      label: '文件管理',
      children: <Manger />,
    },
    {
      key: '3',
      label: '通用设置',
      children: <General />,
    }

  ];
  return (
    <>
      <ContentBar model={false} title="软件配置" />
      <Tabs
        className="h-[calc(100vh-40px)]"
        defaultActiveKey="1"
        tabPosition={'left'}
        items={items}
      />
    </>
  );
};
