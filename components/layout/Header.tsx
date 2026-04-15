"use client";

// Imports
import Link from "next/link";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { SearchToast } from "@/components/ui/SearchToast";
import { useEcommerce } from "@/contexts/EcommerceContext";

// Links type
type NavLink = {
  name: string;
  href: string;
};

// Navbar links
const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// Main Page
export function Header() {
  const { cartCount, wishlist } = useEcommerce();
  const router = useRouter();

  // States
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchToastOpen, setSearchToastOpen] = useState<boolean>(false);

  // Handle Search
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);

    setSearchToastOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="min-w-fit">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="Logo"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 flex-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-md"
            >
              <div className="flex items-center w-full bg-gray-100 rounded-lg px-4 py-2 border border-transparent focus-within:border-blue-600">
                <input
                  type="text"
                  placeholder="Search products..."
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                />

                <button
                  type="submit"
                  aria-label="Search products"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-4">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchToastOpen(true)}
                aria-label="Open search"
                className="md:hidden text-gray-600 hover:text-blue-600"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Open wishlist page"
                className="relative text-gray-600 hover:text-blue-600"
              >
                <Heart className="w-5 h-5" />

                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Open cart page"
                className="relative text-gray-600 hover:text-blue-600"
              >
                <ShoppingCart className="w-5 h-5" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                aria-label="Open account page"
                className="text-gray-600 hover:text-blue-600"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="md:hidden text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 border-t pt-4 space-y-2">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 pb-3">
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 border border-transparent focus-within:border-blue-600 focus-within:shadow-md transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />

                  <button
                    type="submit"
                    aria-label="Open search"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </nav>
          )}
        </div>
      </header>

      {/* Search Toast */}
      <SearchToast
        open={searchToastOpen}
        query={searchQuery}
        setQuery={setSearchQuery}
        onClose={() => setSearchToastOpen(false)}
        onSubmit={handleSearch}
      />
    </>
  );
}
