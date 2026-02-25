import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs"
import EntryDocCard from "./EntryDocCard";
import { JobBoardEntry } from "@/lib/types";

interface EntryDocAreaProps {
  entry: JobBoardEntry;
  onUpdateEntry: (entry: JobBoardEntry) => void;
}

const EntryDocArea = ({ entry, onUpdateEntry }: EntryDocAreaProps) => {
  return (
    <Tabs defaultValue="cv" className="w-full">
      <TabsList>
        <TabsTrigger value="cv">CV</TabsTrigger>
        <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
      </TabsList>

      <TabsContent value="cv">
        <EntryDocCard type="CV" entry={entry} onUpdateEntry={onUpdateEntry} />
      </TabsContent>

      <TabsContent value="cover-letter">
        <EntryDocCard type="Cover Letter" entry={entry} onUpdateEntry={onUpdateEntry} />
      </TabsContent>
    </Tabs>
  )
}

export default EntryDocArea;