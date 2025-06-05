
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojiCategories = {
    "Sourires": ["😊", "😀", "😁", "😄", "😆", "🥰", "😍", "🤩", "😘", "😗"],
    "Gestes": ["👋", "👍", "👎", "👌", "🤝", "🙏", "💪", "✊", "👏", "🤞"],
    "Coeurs": ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "💖", "💝"],
    "Objets": ["📱", "💻", "⌚", "📞", "📧", "📦", "💰", "💳", "🛒", "🎁"],
    "Activité": ["🔥", "⭐", "✨", "💫", "⚡", "💎", "🎉", "🎊", "🏆", "🥇"]
  };

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Smile size={16} className="mr-2" />
          Émojis
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Émojis populaires</h4>
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div key={category}>
              <h5 className="text-xs font-medium text-muted-foreground mb-2">{category}</h5>
              <div className="grid grid-cols-10 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                    onClick={() => handleSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
