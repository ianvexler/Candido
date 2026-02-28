"use client";

import { useState } from "react";
import Title from "../../common/Title";
import Description from "../../common/Description";
import { XIcon } from "lucide-react";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Button } from "../../ui/Button";

export interface LinkModalState {
  text: string;
  url: string;
  isEditing: boolean;
  from?: number;
  to?: number;
}

interface LinkFormContentProps {
  initialState: LinkModalState;
  onSubmit: (text: string, url: string, from?: number, to?: number) => void;
  onClose: () => void;
  onRemove?: (from?: number, to?: number) => void;
}

const LinkFormContent = ({
  initialState,
  onSubmit,
  onClose,
  onRemove,
}: LinkFormContentProps) => {
  const [text, setText] = useState(initialState.text);
  const [url, setUrl] = useState(initialState.url);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const normalizeUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) {
      return trimmed;
    }
    
    if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const handleInsert = () => {
    setFormSubmitted(true);
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    const absoluteUrl = normalizeUrl(trimmedUrl);
    onSubmit(text.trim() || absoluteUrl, absoluteUrl, initialState.from, initialState.to);
    onClose();
  };

  const isUrlValid = url.trim().length > 0;

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div>
          <Title>{initialState.isEditing ? "Edit link" : "Insert link"}</Title>
          <Description>
            {initialState.isEditing
              ? "Update the link text and URL"
              : "Add a link with optional custom text"}
          </Description>
        </div>

        <div
          className="cursor-pointer flex flex-col items-center justify-start hover:opacity-50"
          onClick={onClose}
        >
          <XIcon className="size-6" />
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Link text (optional)</Label>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Click here"
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to use the URL as the link text
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Label>URL*</Label>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={formSubmitted && !isUrlValid ? "border-red-500" : ""}
          />
          {formSubmitted && !isUrlValid && (
            <p className="text-sm text-red-500">URL is required</p>
          )}
        </div>

        <div className="flex flex-row gap-2 mt-6">
          {initialState.isEditing && onRemove && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onRemove(initialState.from, initialState.to);
                onClose();
              }}
              className="mr-auto"
            >
              Remove link
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" disabled={!isUrlValid} onClick={handleInsert}>
              {initialState.isEditing ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkFormContent;
