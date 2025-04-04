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
import { Plus, Palette, Pin, PinOff, Save } from "lucide-react";
import { colors } from "@/lib/utils";
import { toast } from "react-toastify";
import { AppContext } from "@/store/AppContext";
import useOutsideClick from "@/hooks/useOutsideClick";
import { createNote, syncNotes } from "@/lib/features";

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
    const newNote = {
      id:
        "note-" +
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2),
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
      deleted: false,
      status: "active",
      updatedAt: new Date(),
    };
    setTitle("");
    setContent("");
    setColor("#171717");
    setPinned(false);
    setColorSelectorOpen(false);

    if (!newNote.title && !newNote.content) return;

    const previousNotes = user.notes;
    setUser({ ...user, notes: [...previousNotes, newNote] });
    try {
      // const response = await createNote(newNote);
      // if (response.success) {
      //   setUser({ ...user, notes: response.notes });
      //   toast.success(response.message);
      // } else {
      //   setUser({ ...user, notes: previousNotes });
      //   toast.error(res.message);
      // }
      const response = await syncNotes([...previousNotes, newNote]);
      if (response.success) {
        setUser({ ...user, notes: response.notes });
      } else {
        setUser({ ...user, notes: previousNotes });
        toast.error(response.message);
      }
    } catch (error) {
      setUser({ ...user, notes: previousNotes });
      toast.error("Something went wrong");
    }
  };

  const saveButtonHandler = () => {
    dialogCloseTrigger();
    setDialogOpen(false);
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
          <div className="p-2 rounded-2xl bg-neutral-700 border-2 border-neutral-200">
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
        className="w-full sm:w-[450px] rounded-none sm:rounded-2xl h-full sm:h-[500px] border-0 sm:border-2 border-neutral-500"
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
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none border-none text-2xl md:text-2xl h-12"
          />
          {/* <div className="w-full h-[1px] mt-4 bg-current opacity-30 mix-blend-difference"></div> */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none border-none resize-none min-h-52 text-[16px] p-3.5 flex-1"
            placeholder="Take a note..."
          />
          <div className="w-full mt-4 text-sm sm:text-md flex gap-1 justify-evenly items-start">
            <Collapsible
              open={colorSelectorOpen}
              onOpenChange={setColorSelectorOpen}
              className="relative"
              ref={colorSelectorRef}
            >
              <CollapsibleTrigger>
                <div className="flex items-center p-2 border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl">
                  <div className="flex items-center gap-1">
                    <Palette size={20} />
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
              className="flex items-center p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl"
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
            <div
              className="flex items-center p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl"
              onClick={saveButtonHandler}
            >
              <div className="flex items-center gap-1">
                <Save size={20} className="-mt-0.5" />
                <span>Save</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteInputBox;
