"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function WebsiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const navItems = [
    { id: 'home', label: 'Início', path: '/' },
    { id: 'articles', label: 'Artigos', path: '/artigos' },
    { id: 'about', label: 'Sobre o Observatório', path: '/sobre' },
    { id: 'contact', label: 'Contato', path: '/contato' },
  ];

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Box Amarelo */}
          <Link href="/" className="flex items-center cursor-pointer group">
            <div className="bg-[#FFC700] px-3 py-2 transition-transform duration-200 group-hover:scale-105">
              <h1 className="text-lg font-bold text-black leading-tight">
                OBSERVATÓRIO DA<br />
                <span className="text-xl font-bold">EXTREMA DIREITA</span><br />
                <span className="text-base font-bold">LATINO-AMERICANA</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation (Texto Claro) */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-[#FFC700] ${
                  isActive(item.path) ? 'text-[#FFC700] font-bold' : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 bg-black absolute left-0 right-0 px-4 shadow-lg">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors hover:text-[#FFC700] py-2 ${
                    isActive(item.path) ? 'text-[#FFC700] font-bold' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}