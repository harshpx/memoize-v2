import useMediaQuery from "@/hooks/useMediaQuery";
import NoteInputBox from "@/components/custom/notes/NoteInputBox";
import Note from "./Note";
import { useContext } from "react";
import { AppContext } from "@/store/AppContext";

const NotePage = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { user } = useContext(AppContext);
  return (
    <div className="w-full h-full overflow-y-scroll p-4 flex flex-col gap-4 items-center relative">
      {/* note input box component */}
      <div className={`${isMobile ? "fixed right-6 bottom-14" : ""}`}>
        <NoteInputBox />
      </div>
      {/* notes */}
      {user?.notes?.filter((note) => !note.deleted)?.length === 0 && (
        <div className="mt-10 w-full flex flex-col items-center justify-center gap-2">
          <p className="text-neutral-300 text-lg">No notes available</p>
          <p className="text-neutral-500 text-sm">Create a new note by clicking on Input Box or &apos;+&apos; button </p>
        </div>
      )}
      <div className="flex justify-center w-full">
        <div className="w-full columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          {user?.notes
            ?.filter((note) => !note.deleted)
            ?.reverse()
            ?.map((note) =>
              note.pinned ? <Note key={note.id} note={note} /> : null
            )}
          {user?.notes
            ?.filter((note) => !note.deleted)
            ?.reverse()
            ?.map((note) =>
              !note.pinned ? <Note key={note.id} note={note} /> : null
            )}
        </div>
      </div>
    </div>
  );
};

export default NotePage;
