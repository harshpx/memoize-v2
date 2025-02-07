import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Palette,
  Pin,
  PinOff,
  ChevronUp,
  ChevronDown,
  Trash,
} from "lucide-react";
import { colors } from "@/lib/utils";
import { toast } from "react-toastify";
import { AppContext } from "@/store/AppContext";
import useOutsideClick from "@/hooks/useOutsideClick";

const NoteInputBox = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { user, setUser } = useContext(AppContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#171717");
  const [pinned, setPinned] = useState(false);

  const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { ref: colorSelectorRef, isOutsideClick: isClickOutsideColorSelector } =
    useOutsideClick();

  useEffect(() => {
    if (!colorSelectorOpen) return; // Don't run effect unless open

    const timeout = setTimeout(() => {
      if (isClickOutsideColorSelector) {
        setColorSelectorOpen(false);
      }
    }, 100); // Small delay to avoid immediate closure on first click

    return () => clearTimeout(timeout);
  }, [colorSelectorOpen, isClickOutsideColorSelector]);

  const dialogCloseTrigger = async () => {
    const data = {
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
    };
    setTitle("");
    setContent("");
    setColor("#171717");
    setPinned(false);
    setColorSelectorOpen(false);

    console.log(data);

    if (!data.title && !data.content) return;

    // create note api call
    const previousNotes = user.notes;
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.success) {
        setUser({ ...user, notes: [...previousNotes, res.note] });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) {
          dialogCloseTrigger();
        }
      }}
    >
      <DialogTrigger>
        {isMobile ? (
          <div className="p-2 rounded-2xl bg-neutral-700">
            <Plus size={32} />
          </div>
        ) : (
          <Input
            readOnly
            placeholder="Take a note..."
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-2 border-neutral-400 rounded-xl cursor-pointer h-12"
          />
        )}
      </DialogTrigger>
      <DialogContent
        className="w-[90%] sm:w-[450px] rounded-2xl border-2 h-[70%] border-neutral-500"
        style={{ backgroundColor: color }}
      >
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none border-none text-xl md:text-xl h-12"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none border-none resize-none min-h-52 text-sm p-3.5 flex-1"
            placeholder="Take a note..."
          />
          <div className="w-full mt-4 px-2 flex justify-between items-start">
            <Collapsible
              open={colorSelectorOpen}
              onOpenChange={setColorSelectorOpen}
              className="relative"
              ref={colorSelectorRef}
            >
              <CollapsibleTrigger>
                <div className="flex items-center p-2 border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-full">
                  <div className="flex items-center gap-1">
                    <Palette size={24} />
                    <span>Colors</span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute bottom-12 left-0 w-72 bg-neutral-500 bg-opacity-20 rounded-2xl">
                <div className="flex flex-wrap gap-2 p-2">
                  {colors.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-full w-8 h-8 cursor-pointer ${
                        color === item ? "border-2 border-white" : ""
                      }`}
                      style={{ backgroundColor: item }}
                      onClick={() => setColor(item)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div
              className="flex items-center p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-full"
              onClick={() => setPinned(!pinned)}
            >
              {pinned ? (
                <div className="flex items-center gap-1">
                  <PinOff size={20} />
                  <span>Unpin</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Pin size={20} />
                  <span>Pin</span>
                </div>
              )}
            </div>
            {/* <div className="flex items-center p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-full">
              <div className="flex items-center gap-1">
                <Trash size={20} className="-mt-0.5" />
                <span>Delete</span>
              </div>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteInputBox;
