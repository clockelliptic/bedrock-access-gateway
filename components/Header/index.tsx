import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="p-4 flex items-center border-b border-gray-200 shadow-sm">
      <Image src="/next.svg" alt="Company Logo" width={180} height={45} priority />
      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <Link href={'/'} className="underline">
              Home
            </Link>
          </li>
          <Link href={'/new-post'} className="underline">
            New Post
          </Link>
        </ul>
      </nav>
    </header>
  )
}
