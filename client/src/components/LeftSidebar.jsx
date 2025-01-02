import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
  Instagram,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import { useAuthStore } from "../store/useAuthStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationExample from "./NotificationDrawer";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpenNotification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shrink, setShrink] = useState(false);

  const logoutHandler = async () => {
    logout();
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
    setMobileMenuOpen(false);
  };

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, text: "Home" },
    { icon: <Search className="w-5 h-5" />, text: "Search" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Explore" },
    { icon: <MessageCircle className="w-5 h-5" />, text: "Messages" },
    { icon: <Heart className="w-5 h-5" />, text: "Notifications" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
  ];

  // Mobile navigation items (limited set for bottom bar)
  const mobileNavItems = sidebarItems.slice(0, 5);

  const handleSidebar = (text) => {
    if (text === "Notifications") {
      setShrink(!shrink);
      setIsOpenNotification(!isOpen);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed top-0 z-[100] left-0 px-4 border-r border-gray-300 
  ${shrink ? "w-20" : "w-[16%]"} 
  h-screen duration-300 ease-in-out`}
      >
        <div className="flex flex-col w-full z-[100]">
          <h1 className="my-8 pl-3 font-bold text-xl">
            {shrink ? (
              <Instagram className="" />
            ) : (
              <span className="text-2xl italic">Instagram</span>
            )}
          </h1>
          <div className="flex-grow">
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                <div
                  onClick={() => {
                    handleSidebar(item.text);
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm transition-opacity duration-300 ${
                    shrink ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100]">
        <div className="flex justify-around items-center h-16">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex flex-col items-center justify-center w-16 h-full"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.text}</span>
            </button>
          ))}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-16 h-full">
                <Menu className="w-5 h-5" />
                <span className="text-xs mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <div className="grid gap-4 py-4">
                {sidebarItems.slice(5).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => sidebarHandler(item.text)}
                    className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content padding */}
      <div className="md:pl-[16%]">
        <CreatePost open={open} setOpen={setOpen} />
      </div>

      {/* notifications */}
      <NotificationExample
        isOpen={isOpen}
        setIsOpenNotification={setIsOpenNotification}
      />
    </>
  );
}
