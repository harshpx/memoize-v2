"use client";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/branding/Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotepadText, ListTodo } from "lucide-react";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import AvatarSelector from "@/components/custom/AvatarSelector";
import Branding from "./branding/Branding";
import { deleteCookie } from "@/lib/utils";

const Header = ({ children }) => {
  const { user, page, setPage, setAuthenticated } = useContext(AppContext);

  const signoutHandler = () => {
    deleteCookie("token");
    setAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="h-screen w-full">
      {/* header */}
      <div className="w-full flex items-center justify-between px-4 h-[55px] lg:h-[60px]">
        <div className="flex items-center gap-2">
          <Logo size="sm" style="" />
        </div>
        {!isSmallScreen && (
          <Tabs value={page} onValueChange={setPage}>
            <TabsList className="bg-transparent flex items-center">
              <TabsTrigger
                value="notes"
                className={`flex items-center gap-1 cursor-pointer px-4 py-1.5 rounded-full data-[state=active]:bg-neutral-300 data-[state=active]:text-black`}
              >
                <NotepadText className="size-8" />
                <span>Notes</span>
              </TabsTrigger>
              <TabsTrigger
                value="todos"
                className={`flex items-center gap-1 cursor-pointer px-4 py-1.5 rounded-full data-[state=active]:bg-neutral-300 data-[state=active]:text-black`}
              >
                <ListTodo className="size-8" />
                <span>Todos</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {/* Sheet(sidebar) trigger button on top bar for big screens + only user*/}
        {!isSmallScreen ? (
          <Sheet className="border">
            <SheetTrigger className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={user?.avatar?.url} />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div className="text-nowrap">{`Hi ${user?.username}!`}</div>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-center justify-between">
              <div>
                <div className="w-full mt-5 sm:mt-12 mb-5 flex flex-col gap-2 items-center">
                  <Image
                    src={user?.avatar?.url}
                    alt="avatar"
                    width={isSmallScreen ? 150 : 200}
                    height={isSmallScreen ? 150 : 200}
                  />
                  <AvatarSelector className="-mt-8" />
                </div>
                <SheetHeader className="w-full">
                  <SheetTitle className="text-3xl font-[500] text-center">{`Hi ${user?.username}!`}</SheetTitle>
                  <SheetDescription className="text-center">{`Welcome to Memoize`}</SheetDescription>
                </SheetHeader>
                <div className="w-full my-4 flex justify-center">
                  <Button className="" onClick={signoutHandler}>
                    Logout
                  </Button>
                </div>
              </div>
              <Branding className="text-sm" />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="text-nowrap">{`Hi ${user?.username}!`}</div>
        )}
      </div>
      {/* children: Dashboard to be wrapped inside */}
      <div className="w-full h-[calc(100vh-110px)] lg:h-[calc(100vh-60px)] bg-neutral-800">{children}</div>
      {/* footer (only for small screens) */}
      {isSmallScreen && (
        <div className="w-full h-[55px] px-4 flex justify-between items-center">
          <Tabs value={page} onValueChange={setPage}>
            <TabsList className="bg-transparent flex items-center">
              <TabsTrigger
                value="notes"
                className={`flex items-center gap-1 cursor-pointer px-4 py-1.5 rounded-full data-[state=active]:bg-neutral-300 data-[state=active]:text-black`}
              >
                <NotepadText className="size-8" />
                <span>Notes</span>
              </TabsTrigger>
              <TabsTrigger
                value="todos"
                className={`flex items-center gap-1 cursor-pointer px-4 py-1.5 rounded-full data-[state=active]:bg-neutral-300 data-[state=active]:text-black`}
              >
                <ListTodo className="size-8" />
                <span>Todos</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Drawer>
            <DrawerTrigger>
              <Avatar className="w-11 h-11 border-2 active:border-white">
                <AvatarImage src={user?.avatar?.url} />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            </DrawerTrigger>
            <DrawerContent className="">
              <div className="w-full mt-10 sm:mt-12 mb-2 flex flex-col gap-2 items-center">
                <Image
                  src={user?.avatar?.url}
                  alt="avatar"
                  width={isSmallScreen ? 150 : 200}
                  height={isSmallScreen ? 150 : 200}
                />
                <AvatarSelector className="-mt-7" />
              </div>
              <DrawerHeader className="w-full">
                <DrawerTitle className="text-3xl font-[500] text-center">{`Hi ${user?.username}!`}</DrawerTitle>
                <DrawerDescription className="text-center">{`Welcome to Memoize`}</DrawerDescription>
              </DrawerHeader>
              <div className="w-full my-4 flex justify-center">
                <Button className="" onClick={signoutHandler}>
                  Logout
                </Button>
              </div>
              <DrawerFooter>
                <Branding className="text-sm" />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default Header;
