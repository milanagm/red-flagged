import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Red Flag Me',
  description: 'Discover your personality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main 
            className="flex-1 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://i.pinimg.com/736x/95/c0/7d/95c07d8830438ad513b081f6d5ee848c.jpg)',
              minHeight: '100vh'
            }}
          >
            <div className="h-full min-h-screen bg-black bg-opacity-10 flex items-center justify-center p-4 pt-20">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
} 