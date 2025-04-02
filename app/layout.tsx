import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connect4 Game',
  description: 'Created By  Omar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
