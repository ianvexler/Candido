import './../styles.scss';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { simpleMenuBarStateSelector } from './SimpleMenuBarState';
import classNames from 'classnames';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo2,
  Redo2,
} from 'lucide-react';
import AddLinkModal from '../AddLinkModal/AddLinkModal';
import type { LinkModalState } from '../AddLinkModal/LinkFormContent';

interface SimpleMenuBarProps {
  editor: Editor | null;
}

const SimpleMenuBar = ({ editor }: SimpleMenuBarProps) => {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalState, setLinkModalState] = useState<LinkModalState>({
    text: '',
    url: '',
    isEditing: false,
  });

  const editorState = useEditorState({
    editor: editor as Editor,
    selector: simpleMenuBarStateSelector,
  });

  const handleLinkSubmit = (text: string, url: string, from?: number, to?: number) => {
    if (!editor) return;
    const escapeAttr = (s: string) => s.replace(/"/g, '&quot;');
    const escapeText = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const content = `<a href="${escapeAttr(url)}">${escapeText(text)}</a>`;
    if (from !== undefined && to !== undefined) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContentAt(from, content)
        .run();
    } else {
      editor.chain().focus().insertContent(content).run();
    }
  };

  const handleLinkRemove = (from?: number, to?: number) => {
    if (!editor || from === undefined || to === undefined) return;
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .unsetLink()
      .run();
  };

  const handleLinkClick = () => {
    if (!editor) return;
    if (editorState.isLink) {
      editor.chain().focus().extendMarkRange('link').run();
      const { href } = editor.getAttributes('link');
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setLinkModalState({ text, url: href || '', isEditing: true, from, to });
    } else {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setLinkModalState({ text, url: '', isEditing: false, from, to });
    }
    setLinkModalOpen(true);
  };

  if (!editor) {
    return null;
  }

  const iconSize = 16;

  return (
    <div className="simple-menu-bar">
      {/* Text formatting */}
      <div className="simple-menu-bar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={classNames('simple-menu-bar__btn', editorState.isBold && 'is-active')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={classNames('simple-menu-bar__btn', editorState.isItalic && 'is-active')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={classNames('simple-menu-bar__btn', editorState.isStrike && 'is-active')}
          title="Strikethrough"
        >
          <Strikethrough size={iconSize} />
        </button>
      </div>

      <div className="simple-menu-bar__divider" />

      {/* Block types */}
      <div className="simple-menu-bar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={classNames('simple-menu-bar__btn', editorState.isHeading1 && 'is-active')}
          title="Heading 1"
        >
          <Heading1 size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={classNames('simple-menu-bar__btn', editorState.isHeading2 && 'is-active')}
          title="Heading 2"
        >
          <Heading2 size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={classNames('simple-menu-bar__btn', editorState.isHeading3 && 'is-active')}
          title="Heading 3"
        >
          <Heading3 size={iconSize} />
        </button>
      </div>

      <div className="simple-menu-bar__divider" />

      {/* Lists & blocks */}
      <div className="simple-menu-bar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={classNames('simple-menu-bar__btn', editorState.isBulletList && 'is-active')}
          title="Bullet list"
        >
          <List size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={classNames('simple-menu-bar__btn', editorState.isOrderedList && 'is-active')}
          title="Numbered list"
        >
          <ListOrdered size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={classNames('simple-menu-bar__btn', editorState.isBlockquote && 'is-active')}
          title="Blockquote"
        >
          <Quote size={iconSize} />
        </button>
        <button
          type="button"
          onClick={handleLinkClick}
          className={classNames('simple-menu-bar__btn', editorState.isLink && 'is-active')}
          title="Insert link"
        >
          <Link2 size={iconSize} />
        </button>
      </div>

      <div className="simple-menu-bar__divider" />

      <div className="simple-menu-bar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="simple-menu-bar__btn"
          title="Undo"
        >
          <Undo2 size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="simple-menu-bar__btn"
          title="Redo"
        >
          <Redo2 size={iconSize} />
        </button>
      </div>

      <AddLinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        initialState={linkModalState}
        onSubmit={handleLinkSubmit}
        onRemove={
          linkModalState.isEditing &&
          linkModalState.from !== undefined &&
          linkModalState.to !== undefined
            ? handleLinkRemove
            : undefined
        }
      />
    </div>
  );
};

export default SimpleMenuBar;
