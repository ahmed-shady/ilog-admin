import React, { useState, useRef, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './EmojiPicker.scss';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Common emojis for quick access
  const commonEmojis = [
    '😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯',
    '👏', '🙏', '💪', '🎯', '✅', '⚡', '🌟', '💡',
    '📝', '📌', '🏥', '💊', '🩺', '🧬', '🔬', '⚕️'
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        triggerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };



    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Adjust picker position to stay within viewport
  useEffect(() => {
    if (isOpen && pickerRef.current && triggerRef.current) {
      const picker = pickerRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const pickerRect = picker.getBoundingClientRect();

      // Reset styles
      picker.style.left = '';
      picker.style.right = '';
      picker.style.top = '';
      picker.style.bottom = '';

      // Calculate horizontal position
      let leftPosition = rect.left;
      
      // Check if picker would overflow right edge
      if (leftPosition + pickerRect.width > window.innerWidth - 16) {
        // Align to right edge of trigger or viewport
        const rightPosition = window.innerWidth - rect.right;
        picker.style.right = `${Math.max(8, rightPosition)}px`;
        picker.style.left = 'auto';
      } else {
        picker.style.left = `${Math.max(8, leftPosition)}px`;
        picker.style.right = 'auto';
      }

      // Calculate vertical position
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow >= pickerRect.height + 8 || spaceBelow > spaceAbove) {
        // Position below trigger
        picker.style.top = `${rect.bottom + 8}px`;
        picker.style.bottom = 'auto';
      } else {
        // Position above trigger
        picker.style.bottom = `${window.innerHeight - rect.top + 8}px`;
        picker.style.top = 'auto';
      }
    }
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    // setIsOpen(false);
  };

  return (
    <div className="emoji-picker-wrapper">
      <OverlayTrigger placement="top" overlay={<Tooltip>Insert Emoji</Tooltip>}>
        <button
          ref={triggerRef}
          type="button"
          className="emoji-trigger btn btn-outline-secondary btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          😊
        </button>
      </OverlayTrigger>

      {isOpen && (
        <div ref={pickerRef} className="emoji-picker">
          <div className="emoji-picker-header">
            <span>Select Emoji</span>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="emoji-grid">
            {commonEmojis.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                className="emoji-btn"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
