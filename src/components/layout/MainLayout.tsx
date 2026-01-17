import { ReactNode } from 'react'

interface MainLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <main className="h-[calc(100vh-56px)] flex">
      {/* Left panel - Vitals */}
      <div className="w-[400px] flex-shrink-0 p-4 overflow-y-auto border-r border-border-subtle">
        {leftPanel}
      </div>

      {/* Right panel - Reasoning */}
      <div className="flex-grow p-4 min-w-0">
        {rightPanel}
      </div>
    </main>
  )
}
