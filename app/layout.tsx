import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rental King | Student Housing in Glassboro, NJ',
  description: 'Quality student housing near Rowan University',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
