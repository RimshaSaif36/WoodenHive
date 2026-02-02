import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

/* ================= MENU ITEMS ================= */
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    // Map nav items to category filters (for listing page)
    let categoryKey = null;
    switch (menuItem.id) {
      case "office":
      case "kitchen":
      case "gifts":
      case "accessories":
        categoryKey = menuItem.id;
        break;
      case "home-category":
        categoryKey = "home";
        break;
      default:
        categoryKey = null;
    }

    const currentFilter = categoryKey ? { category: [categoryKey] } : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter) {
      setSearchParams(new URLSearchParams(`?category=${categoryKey}`));
    } else {
      navigate(menuItem.path);
    }
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
          key={item.id}
          onClick={() => handleNavigate(item)}
          className="cursor-pointer text-sm font-medium"
        >
          {item.label}
        </Label>
      ))}
    </nav>
  );
}

/* ================= RIGHT CONTENT ================= */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth) || {};
  const { cartItems } = useSelector((state) => state.shopCart) || {};
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 right-1 text-sm font-bold">
            {cartItems?.items?.length || 0}
          </span>
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-bold">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(logoutUser())}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ================= SHOPPING HEADER ================= */
function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* ✅ Navbar height SAME (h-16) */}
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        
        {/* ✅ Logo visually bigger WITHOUT increasing header height */}
        <Link to="/shop/home" className="flex items-center">
          <img
            src="/logo.png"
            alt="Wooden Hive"
            className="h-12 w-auto object-contain"
          />
           <span className="text-2xl font-bold font-stylish text-yellow-900 tracking-wide ">

  Wooden Hive
</span>

        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
