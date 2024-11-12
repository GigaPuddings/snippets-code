import React from "react";
import { ContentBar } from "@renderer/components/ContentBar";
const Loading: React.FC = () => {
  return (
    <React.Fragment>
      <main className="w-screen h-screen dark:bg-[#22282c] flex flex-col">
        <ContentBar />
        <div className="flex flex-col gap-4 items-center justify-center flex-1">
          <div className="wavy">
            {['l', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((letter, index) => (
              <span key={index} style={{ '--i': index + 1 } as React.CSSProperties}>
                {letter}
              </span>
            ))}
          </div>
          <div className="loader w-1/2"></div>
        </div>
      </main>
    </React.Fragment>
  )
}

export default Loading




