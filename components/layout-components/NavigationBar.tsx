"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Search,
  ShoppingCart,
  UserRound,
  ClipboardList,
  ChevronDown,

} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import logo from "@/public/asus-rog-1-logo-svgrepo-com.png";

const navItems = [
  { label: "Danh mục", href: "/categories" },
  { label: "Sản phẩm mới", href: "/products?sort=newest" },
  { label: "Bán chạy", href: "/products?sort=bestseller" },
  { label: "Ưu đãi", href: "/products?filter=sale" },
  { label: "Tất cả sản phẩm", href: "/products" },
];

export default function NavigationBar() {
  const { currentUser, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#29292E] bg-[#0B0B0D] text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
      {/* Main navigation */}
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center">
          <Image src={logo} alt="logo" width={72} />
        </Link>
        {/* Desktop search */}
        <div className="hidden min-w-0 flex-1 sm:block">
          <InputGroup className="h-11 rounded-xl border border-[#303036] bg-[#17171B] transition-all duration-200 focus-within:border-[#FF0033]/70 focus-within:ring-2 focus-within:ring-[#FF0033]/10">
            <InputGroupAddon>
              <Search className="h-4.5 w-4.5 text-[#8B8B95]" />
            </InputGroupAddon>

            <InputGroupInput
              placeholder="Tìm kiếm sản phẩm gaming..."
              aria-label="Tìm kiếm sản phẩm"
              className="text-sm text-white placeholder:text-[#777780]"
            />
          </InputGroup>
        </div>

        {/* User actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-[#202024]" />
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex max-w-40 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-[#D5D5DB] outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#FF0033]">
                <UserRound className="h-5 w-5 shrink-0 text-[#FF0033]" />
                <span className="hidden truncate sm:block">
                  {currentUser.fullname}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#85858F]" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl border-[#303036] bg-[#151518] p-1.5 text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-lg py-2.5 text-red-400 focus:bg-[#FF0033]/10 focus:text-[#FF4D70]"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-medium text-[#D5D5DB] transition-colors hover:bg-white/5 hover:text-white sm:px-3"
            >
              <UserRound className="h-5 w-5 text-[#FF0033]" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}

          {/* Orders */}
          <Link
            href="/orders"
            className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-medium text-[#D5D5DB] transition-colors hover:bg-white/5 hover:text-white sm:px-3"
          >
            <ClipboardList className="h-5 w-5 text-[#B0B0B8] transition-colors group-hover:text-[#FF0033]" />
            <span className="hidden md:inline">Đơn hàng</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="group flex h-10 items-center gap-2 rounded-xl bg-[#FF0033] px-3 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,0,51,0.12)] transition-all duration-200 hover:bg-[#E6002E] hover:shadow-[0_0_22px_rgba(255,0,51,0.28)] sm:px-4"
          >
            <ShoppingCart className="h-4.5 w-4.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 sm:hidden">
        <InputGroup className="h-10 rounded-xl border border-[#303036] bg-[#17171B] focus-within:border-[#FF0033]/70">
          <InputGroupAddon>
            <Search className="h-4 w-4 text-[#8B8B95]" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Tìm kiếm sản phẩm gaming..."
            aria-label="Tìm kiếm sản phẩm"
            className="text-sm text-white placeholder:text-[#777780]"
          />
        </InputGroup>
      </div>

      {/* Category navigation */}
      <nav className="border-t border-[#29292E] bg-[#111114]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavigationMenu className="h-12 w-full max-w-none justify-start">
            <NavigationMenuList className="flex h-12 flex-wrap gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink
                    href={item.href}
                    className="relative inline-flex h-10 items-center rounded-lg border border-transparent bg-transparent px-3 text-[13px] font-medium text-[#A7A7B0] transition-all duration-200 hover:border-[#FF0033]/20 hover:bg-[#FF0033]/[0.07] hover:text-white focus:bg-[#FF0033]/10 focus:text-white sm:px-4 sm:text-sm"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Red accent line */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#FF0033] to-transparent opacity-80" />
    </header>
  );
}
