import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import getFeedbackEntries from "@/api/resources/feedbackEntries/getFeedbackEntries";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FeedbackEntry } from "@/lib/types";
import Loader from "../common/Loader";
import { capitalize } from "@/lib/utils";

const FeedbackTable = () => {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getFeedbackEntries().then((response) => {
      setLoading(true);
      setFeedbackEntries(response.feedbackEntries);
    }).catch((error) => {
      console.error(error);
      toast.error("Failed to get feedback entries");
      setFeedbackEntries([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mt-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {feedbackEntries.map((feedbackEntry) => (
          <TableRow key={feedbackEntry.id}>
            <TableCell>{feedbackEntry.title}</TableCell>
            <TableCell>{feedbackEntry.content}</TableCell>
            <TableCell>{capitalize(feedbackEntry.type.toLowerCase())}</TableCell>
            <TableCell>{format(feedbackEntry.createdAt, "MM/dd/yyyy HH:mm")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default FeedbackTable;