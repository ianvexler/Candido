"use client";
import { createFeedbackEntry } from "@/api/resources/feedbackEntries/createFeedbackEntry";
import Loader from "@/components/common/Loader";
import PageContainer from "@/components/common/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FeedbackType } from "@/lib/types";
import { MessageSquareIcon, BugIcon, LightbulbIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { SubmitEvent } from "react";
import Title from "@/components/common/Title";
import Description from "@/components/common/Description";

const FeedbackPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState(FeedbackType.OTHER);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await createFeedbackEntry(title, content, type);
      toast.success("Feedback submitted successfully");
      setTitle("");
      setContent("");
      setType(FeedbackType.OTHER);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback");
    } finally {
      setSending(false);
    }
  };

  if (sending) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/50 px-4">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <PageContainer className="flex-1 flex flex-col justify-center min-h-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-6">
          <div>
            <Title>Feedback</Title>
            <Description className="mt-1">
              Your input helps us improve Candido. Share what&apos;s working, what isn&apos;t, or ideas for new features.
            </Description>
          </div>

          <div className="space-y-8 mt-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <BugIcon className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h3 className="font-medium text-sm">Report a bug</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Found something broken? Let us know so we can fix it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <LightbulbIcon className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h3 className="font-medium text-sm">Suggest an improvement</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Have an idea to make Candido better? We&apos;d love to hear it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <MessageSquareIcon className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h3 className="font-medium text-sm">General feedback</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Thoughts, questions, or anything else you&apos;d like to share.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Submit feedback</CardTitle>
            <CardDescription>Fill out the form below and we&apos;ll take a look at it.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="type">Type</Label>

                <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FeedbackType.BUG}>Bug</SelectItem>
                    <SelectItem value={FeedbackType.SUGGESTION}>Suggestion</SelectItem>
                    <SelectItem value={FeedbackType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us more about your feedback..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default FeedbackPage;