import { Button, Flex, Progress } from "antd";
import { useEffect, useState } from "react";

export default function Upgrade() {
  const [info, setInfo] = useState<any>()
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    // 跳转到此页面，立刻开始下载
    window.api.sendMessage('download-update');


    if (window.api && window.api.onDownloadProgress) {
      // 同时同步监听下载进度
      if (window.api && window.api.onDownloadProgress) {
        window.api.onDownloadProgress((prog: any) => {
          console.log('prog>>>>>>', prog);
          setProgress(prog);
          if (prog >= 100) {
            setProgress(100);
          }
        });
      }
    }

    if (window.api && window.api.onUpdateDownloaded) {
      // 监听下载完成
      window.api.onUpdateDownloaded((info: any) => {
        // 提示用户安装更新
        console.log('update-downloaded: ', info);

        // 下载完成设置
        setInfo(info)
        setProgress(100);
      });
    }




  }, []);

  // 安装更新
  const installUpdate = () => {
    window.api.sendMessage('install-update');
  };

  // 跳过此版本
  const skipVersionUpdate = () => {
    window.api.sendMessage('skip-version-update', info?.version);
  }

  // 取消
  const cancel = () => {
    window.api.closeWindow()
  }

  return (
    <main className='relative h-screen w-screen bg-white text-center'>
      <div className="w-full h-5 drag border shadow-slate-300"></div>
      {progress >= 100 ? (
        <div className="h-full w-full absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
          <h2>应用下载完成</h2>
          <br />
          {info}
          <Flex className="w-screen px-5" justify="space-evenly" align="center">
            <Button type="primary" onClick={cancel}>取消</Button>
            <Button type="primary" onClick={skipVersionUpdate}>跳过此版本</Button>
            <Button type="primary" onClick={installUpdate}>退出并安装更新</Button>
          </Flex>
        </div>
      ) : (
        <div className="pt-5 h-full w-full absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
          <Progress
            percent={progress}
            percentPosition={{ align: 'start', type: 'inner' }}
            size={[300, 20]}
            strokeColor="#B7EB8F"
          />
          <h1>正在下载更新...</h1>
        </div>
      )}
    </main>
  )
}
