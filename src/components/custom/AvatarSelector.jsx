import Image from "next/image";
import avatar from "animal-avatar-generator";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { toast } from "react-toastify";
import { AppContext } from "@/store/AppContext";
import { avatars as avatarOptions } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAvatar } from "@/lib/features";

const AvatarSelector = ({ className }) => {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");
  const { user, setUser } = useContext(AppContext);

  const updateAvatarHandler = async (url) => {
    const currAvatar = user.avatar;
    setUser({ ...user, avatar: url });
    try {
      setOpen(false);
      const response = await updateAvatar({ avatar: url });
      if (response.success) {
        toast.success(response.message, { autoClose: 700 });
      } else {
        setUser({ ...user, avatar: currAvatar });
        toast.error(response.message);
      }
    } catch (error) {
      setUser({ ...user, avatar: currAvatar });
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Pencil
          onClick={() => setOpen(true)}
          className={`bg-black w-10 h-8 p-1 sm:w-14 sm:h-10 sm:p-2 border-2 border-white rounded-full cursor-pointer ${className}`}
        />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-fit rounded-xl">
        <DialogHeader>
          <DialogTitle>Choose your Avatar</DialogTitle>
          <DialogDescription>
            Select an avatar from the options below
          </DialogDescription>
        </DialogHeader>
        <div
          className={`px-6 grid grid-cols-4 gap-3 items-center justify-center `}
        >
          {avatarOptions.map((item, index) => (
            <Image
              key={index}
              src={item}
              alt="avatar"
              width={isSmallScreen ? 70 : 80}
              height={isSmallScreen ? 70 : 80}
              className={`rounded-full cursor-pointer ${
                item === avatar
                  ? "border-2 border-white p-0.5"
                  : "hover:border-2 hover:border-neutral-500 p-0.5 transition-all duration-100"
              }`}
              onClick={() => updateAvatarHandler(item)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;
