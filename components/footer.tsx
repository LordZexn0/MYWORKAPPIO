import Link from "next/link"
import { useCMS } from "@/hooks/use-cms"

export default function Footer() {
  const { content } = useCMS()
  const { footer } = content

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/images/logo-transparent.png" alt="Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold">MyWorkApp.io</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              {footer.quickLinks.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footer.contact.title}</h3>
            <ul className="space-y-2">
              {footer.contact.items.map((item, index) => (
                <li key={index} className="text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
