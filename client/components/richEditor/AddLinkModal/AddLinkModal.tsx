"use client";

import { Dialog } from "radix-ui";
import LinkFormContent, { type LinkModalState } from "./LinkFormContent";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, url: string, from?: number, to?: number) => void;
  onRemove?: (from?: number, to?: number) => void;
  initialState: LinkModalState;
}

const AddLinkModal = ({
  isOpen,
  onClose,
  onSubmit,
  onRemove,
  initialState,
}: AddLinkModalProps) => {
  const formKey = isOpen
    ? `open-${initialState.from ?? "new"}-${initialState.to ?? "new"}`
    : "closed";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-101 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg"
          onPointerDownOutside={onClose}
          onEscapeKeyDown={onClose}
        >
          <Dialog.Title asChild>
            <span className="sr-only">
              {initialState.isEditing ? "Edit link" : "Insert link"}
            </span>
          </Dialog.Title>
          <div key={formKey}>
            <LinkFormContent
              initialState={initialState}
              onSubmit={onSubmit}
              onClose={onClose}
              onRemove={onRemove}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddLinkModal;
