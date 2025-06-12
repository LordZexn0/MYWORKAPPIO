import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-90 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo-transparent.png" alt="MyWorkApp.io Logo" width={50} height={50} className="h-10 w-auto" />
        </Link>
      </div>
    </header>
  )
}
