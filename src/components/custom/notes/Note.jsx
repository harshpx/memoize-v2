import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Palette, Pin, PinOff, Trash, Save } from "lucide-react";
import { colors } from "@/lib/utils";
import { toast } from "react-toastify";
import { AppContext } from "@/store/AppContext";
import { useState, useContext, useEffect } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { deleteNote, syncNotes, updateNote } from "@/lib/features";

const Note = ({ note }) => {
  const [title, setTitle] = useState(note?.title);
  const [content, setContent] = useState(note?.content);
  const [pinned, setPinned] = useState(note?.pinned);
  const [color, setColor] = useState(note?.color);
  const [deleted, setDeleted] = useState(note?.deleted);
  const [status, setStatus] = useState(note?.status);

  const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user, setUser } = useContext(AppContext);

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
    setColorSelectorOpen(false);
    if (!title && !content) return; // delete api to be called

    // update note api call
    const prevNote = note;
    const prevNotes = user.notes;

    const newData = {
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
      status,
      deleted,
      updatedAt: new Date(),
    };
    if (
      prevNote.title === newData.title &&
      prevNote.content === newData.content &&
      prevNote.color === newData.color &&
      prevNote.pinned === newData.pinned &&
      prevNote.status === newData.status
    ) {
      return;
    }
    const updatedNotes = user.notes.map((item) =>
      item.id === note.id
        ? {
            ...item,
            title: newData.title,
            content: newData.content,
            color: newData.color,
            pinned: newData.pinned,
            status: newData.status,
            updatedAt: newData.updatedAt,
          }
        : item
    );
    setUser({ ...user, notes: updatedNotes });
    try {
      // const response = await updateNote({
      //   id: note.id,
      //   ...newData,
      // });
      const response = await syncNotes(updatedNotes);
      if (response?.success) {
        setUser({
          ...user,
          notes: response?.notes,
        });
      } else {
        setUser({
          ...user,
          notes: prevNotes,
        });
        setTitle(prevNote.title);
        setContent(prevNote.content);
        setColor(prevNote.color);
        setPinned(prevNote.pinned);
        toast.error(res?.message);
      }
    } catch (error) {
      setUser({
        ...user,
        notes: prevNotes,
      });
      setTitle(prevNote.title);
      setContent(prevNote.content);
      setColor(prevNote.color);
      setPinned(prevNote.pinned);
      toast.error("Failed to update note");
    }
  };

  const deleteNoteTrigger = async () => {
    const prevNotes = user.notes;

    const updatedNotes = user.notes.map((item) =>
      item.id === note.id
        ? { ...item, deleted: true, updatedAt: new Date() }
        : item
    );
    setUser({
      ...user,
      notes: updatedNotes,
    });
    setDialogOpen(false);
    try {
      const response = await syncNotes(updatedNotes);
      if (response?.success) {
        setUser({ ...user, notes: response.notes });
      } else {
        setUser({
          ...user,
          notes: prevNotes,
        });
        toast.error(res?.message);
      }
    } catch (error) {
      setUser({
        ...user,
        notes: prevNotes,
      });
      toast.error("Failed to delete note");
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
      <DialogTrigger className="w-full mb-4">
        <div
          className="w-full rounded-xl p-4 flex flex-col gap-4 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
          style={{ backgroundColor: note?.color }}
        >
          <div className="w-full flex gap-4 items-start text-left ">
            <div className="w-full text-xl">{note?.title}</div>
            {note?.pinned ? <Pin size={24} className="mt-1" /> : <></>}
          </div>
          <div className="w-full text-sm text-justify text-wrap break-all">
            {note?.content}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="w-full sm:w-[450px] rounded-none sm:rounded-2xl h-full sm:h-[500px]"
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
          {/* <div className=" h-[1px] mt-4 mx-3 rounded-full bg-current opacity-30 mix-blend-difference"></div> */}
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
                <div className="flex items-center p-1 sm:p-2 border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl">
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
              className="flex items-center p-1 sm:p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl"
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
              onClick={deleteNoteTrigger}
              className="flex items-center p-1 sm:p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl"
            >
              <div className="flex items-center gap-1">
                <Trash size={20} className="-mt-0.5" />
                <span>Delete</span>
              </div>
            </div>
            <div
              className="flex items-center p-1 sm:p-2 cursor-pointer border-2 border-neutral-300 hover:bg-neutral-100 hover:bg-opacity-20 active:bg-opacity-20 rounded-2xl"
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

export default Note;
