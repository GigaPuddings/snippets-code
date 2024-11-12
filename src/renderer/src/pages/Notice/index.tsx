import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Upgrade() {
  // const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  // useEffect(() => {
  //   window.electron.ipcRenderer.on('update-available', (info: any) => {
  //     // 显示 UI 提示用户有更新可用
  //     console.log('update-available: ', info);
  //     modal.confirm({
  //       title: `检测到新版本：${info.version}`,
  //       content: '点击确定立即更新',
  //       onOk: () => {
  //         navigate('/upgrade');
  //       },
  //       onCancel: () => {
  //         console.log('cancel update');
  //       },
  //     });
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <main className='relative h-screen w-screen bg-white'>
      <div className="w-full h-5 drag border shadow-slate-300"></div>
      <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
        {/* {contextHolder} */}
      新版本更新通知，是否更新！！
      <br />
      <Button type="primary" onClick={() => navigate('/upgrade')}>确认</Button>
      </div>
    </main>
  )
}
