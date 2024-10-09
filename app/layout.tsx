import Header from '@/components/Header'
import { Metadata } from 'next'
import '../styles/globals.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen px-4">
        <Header />
        {children}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Chat Completions App',
  description: 'A sample Chat Completions App for bedrock-access-gateway by Allen Hart',
}
