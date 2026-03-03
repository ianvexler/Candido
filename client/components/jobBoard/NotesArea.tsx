import { JobBoardEntry, Note } from "@/lib/types";
import Loader from "@/components/common/Loader";
import { useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { format } from "date-fns";
import { createNote } from "@/api/resources/notes/createNote";
import { Textarea } from "../ui/Textarea";

interface NotesAreaProps {
  jobBoardEntry: JobBoardEntry | null;
  notes: Note[];
  loading: boolean;
  onNoteAdded: (note: Note) => void;
}

const NotesArea = ({ jobBoardEntry, notes, loading, onNoteAdded }: NotesAreaProps) => {
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  const handleAddNote = () => {
    if (!jobBoardEntry) {
      return
    };

    setIsAddingNote(true);
    void createNote(jobBoardEntry.id, newNoteContent)
      .then((response) => {
        onNoteAdded(response.note);
        setNewNoteContent("");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add note");
      })
      .finally(() => setIsAddingNote(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (newNoteContent.trim().length > 0) handleAddNote();
            }
          }}
          placeholder="Add a note"
          disabled={isAddingNote}
          className="flex-7 min-h-10"
          rows={1}
        />

        <Button 
          onClick={handleAddNote} 
          disabled={isAddingNote || newNoteContent.trim().length === 0} 
          className="flex-1"
        >
          {isAddingNote ? "..." : "Add"}
          {isAddingNote ? null : <PlusIcon className="size-4" />}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <Card key={note.id} className="bg-muted">
            <CardContent className="text-sm flex flex-col gap-2">
              <p>{note.content}</p>

              <div className="flex justify-end items-center">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(note.createdAt), "MM/dd/yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
};

export default NotesArea;