import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EmojiPicker from './EmojiPicker';
import './RichTextEditor.scss';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  isInvalid?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  rows = 5,
  maxLength,
  onBlur,
  isInvalid = false
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `editor-content ${isInvalid ? 'is-invalid' : ''}`,
        style: `min-height: ${rows * 24}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
  };

  const handleEmojiSelect = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  const charCount = editor.getText().length;

  return (
    <div className={`rich-text-editor ${isInvalid ? 'is-invalid' : ''}`}>
      <div className="editor-toolbar">
        <ButtonGroup size="sm" className="me-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Bold</Tooltip>}>
            <Button
              variant={editor.isActive('bold') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <i className="fas fa-bold"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Italic</Tooltip>}>
            <Button
              variant={editor.isActive('italic') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i className="fas fa-italic"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Bullet List</Tooltip>}>
            <Button
              variant={editor.isActive('bulletList') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <i className="fas fa-list-ul"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Numbered List</Tooltip>}>
            <Button
              variant={editor.isActive('orderedList') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <i className="fas fa-list-ol"></i>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Insert Link</Tooltip>}>
            <Button
              variant={editor.isActive('link') ? 'primary' : 'outline-secondary'}
              onClick={setLink}
            >
              <i className="fas fa-link"></i>
            </Button>
          </OverlayTrigger>
        </ButtonGroup>

        <EmojiPicker onEmojiSelect={handleEmojiSelect} />

        {maxLength && (
          <span className={`char-counter ms-auto ${charCount > maxLength ? 'text-danger' : ''}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>

      <EditorContent editor={editor} />

      <div className="editor-hint">
        <small className="text-muted">
          💡 Select text and use toolbar for formatting. Emojis supported! 😊
        </small>
      </div>
    </div>
  );
};

export default RichTextEditor;
