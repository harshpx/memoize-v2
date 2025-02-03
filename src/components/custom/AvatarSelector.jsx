import Image from "next/image";
import avatar from "animal-avatar-generator";
import { Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const avatarOptions = [
  `data:image/svg+xml;base64,${btoa(avatar("harsh", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234567", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234567890", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345678901", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789012", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345678901234", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789012345", { size: 400 }))}`,
];

const AvatarSelector = ({ className }) => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");
  const { data, update } = useSession();

  const updateAvatar = async (url) => {
    const res = await fetch("/api/update-avatar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar: url }),
    });
    const data = await res.json();
    if (data.success) {
      await update(data.updatedSession);
      toast.success(data.message,{autoClose: 1000});
    } else {
      toast.error(data.message);
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <Pencil
        onClick={() => setOpen(!open)}
        className={`bg-black w-10 h-8 p-1 sm:w-14 sm:h-10 sm:p-2 border-2 border-white rounded-full cursor-pointer ${className}`}
      />
      <div
        className={` bg-black rounded-lg border-2 flex items-center justify-center ${
          open ? "h-72" : "h-0 w-0"
        } overflow-hidden transition-all duration-300`}
      >
        <div
          className={`px-6 grid grid-cols-4 gap-3 items-center justify-center `}
        >
          {avatarOptions.map((avatar, index) => (
            <Image
              key={index}
              src={avatar}
              alt="avatar"
              width={isSmallScreen ? 70 : 80}
              height={isSmallScreen ? 70 : 80}
              className={`rounded-full cursor-pointer ${
                avatar === data?.user?.avatar ? "border-2 border-white p-0.5" : "hover:border-2 hover:border-neutral-500 p-0.5 transition-all duration-100"
              }`}
              onClick={() => updateAvatar(avatar)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
