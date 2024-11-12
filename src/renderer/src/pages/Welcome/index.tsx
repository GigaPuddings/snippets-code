import { Code } from "@icon-park/react";

export default function Welcome() {
  return (
    <>
      <div className="h-[calc(100vh-40px)] flex flex-col items-center justify-center text-base text-slate-600 dark:text-[#c9ccd4] opacity-80">
        <Code theme="outline" size="26" strokeWidth={3} />
        Welcome to use
      </div>
    </>
  )
}
