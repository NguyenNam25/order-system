import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ListIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <>
      <div className="flex items-center px-48 gap-6 h-14">
        <Link href={"/"}>
          <h1 className="w-32 h-full flex items-center justify-center">logo</h1>
        </Link>
        <InputGroup className="h-10 flex-1">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex gap-6 h-full items-center">
          <Link href={"/login"}>
            <div className="flex gap-1 h-full items-center justify-center">
              <UserIcon />
              <h2>Login</h2>
            </div>
          </Link>
          <Link href="/orders">
            <div className="flex gap-1 h-full items-center justify-center">
              <ListIcon />
              <h2>Orders</h2>
            </div>
          </Link>
          <Link href="/cart">
            <div className="flex gap-1 h-full items-center justify-center">
              <ShoppingCartIcon />
              <h2>Cart</h2>
            </div>
          </Link>
        </div>
      </div>
      <NavigationMenu className="w-full max-w-none px-2 bg-black text-white h-10">
        <NavigationMenuList className="flex gap-12 h-full">
          <NavigationMenuItem className="text-xl hover:cursor-pointer">
            <NavigationMenuLink className="border border-transparent bg-transparent hover:bg-transparent focus:bg-transparent hover:border-white text-white">
              Categories
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-xl hover:cursor-pointer">
            <NavigationMenuLink className="border border-transparent bg-transparent hover:bg-transparent focus:bg-transparent hover:border-white text-white">
              New Releases
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-xl hover:cursor-pointer">
            <NavigationMenuLink className="border border-transparent bg-transparent hover:bg-transparent focus:bg-transparent hover:border-white text-white">
              Best Seller
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-xl hover:cursor-pointer">
            <NavigationMenuLink className="border border-transparent bg-transparent hover:bg-transparent focus:bg-transparent hover:border-white text-white">
              Coupons
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-xl hover:cursor-pointer">
            <NavigationMenuLink
              href="/products"
              className="border border-transparent bg-transparent hover:bg-transparent focus:bg-transparent hover:border-white text-white"
            >
              See all Products
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
