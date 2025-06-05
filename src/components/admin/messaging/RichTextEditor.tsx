
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Type,
  Quote
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Rédigez votre email..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkMode, setIsLinkMode] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertLink = () => {
    const url = prompt('Entrez l\'URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeTextColor = () => {
    const color = prompt('Entrez une couleur (ex: #FF0000 ou red):');
    if (color) {
      execCommand('foreColor', color);
    }
  };

  const changeFontSize = (size: string) => {
    execCommand('fontSize', size);
  };

  const insertVariable = (variable: string) => {
    const selection = window.getSelection();
    if (selection && editorRef.current) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'bg-blue-100 text-blue-800 px-1 rounded text-sm font-medium';
      span.textContent = variable;
      range.deleteContents();
      range.insertNode(span);
      range.collapse(false);
      updateContent();
    }
  };

  const variables = [
    '{{nom}}', '{{email}}', '{{entreprise}}', '{{produit}}', 
    '{{prix}}', '{{remise}}', '{{lien}}', '{{date}}'
  ];

  return (
    <div className="border rounded-lg">
      {/* Barre d'outils */}
      <div className="border-b p-2 flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold size={14} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic size={14} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline size={14} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <select
          onChange={(e) => changeFontSize(e.target.value)}
          className="px-2 py-1 text-sm border rounded"
          defaultValue="3"
        >
          <option value="1">Très petit</option>
          <option value="2">Petit</option>
          <option value="3">Normal</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Énorme</option>
        </select>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={changeTextColor}
          className="h-8 w-8 p-0"
        >
          <Palette size={14} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft size={14} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter size={14} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          className="h-8 w-8 p-0"
        >
          <AlignRight size={14} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List size={14} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered size={14} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          className="h-8 w-8 p-0"
        >
          <Quote size={14} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
        >
          <Link size={14} />
        </Button>
      </div>

      {/* Variables */}
      <div className="border-b p-2">
        <div className="text-xs text-muted-foreground mb-1">Variables disponibles :</div>
        <div className="flex flex-wrap gap-1">
          {variables.map((variable) => (
            <Button
              key={variable}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertVariable(variable)}
              className="h-6 text-xs"
            >
              {variable}
            </Button>
          ))}
        </div>
      </div>

      {/* Éditeur avec direction LTR forcée */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-48 p-4 focus:outline-none rich-text-editor"
        style={{ 
          whiteSpace: 'pre-wrap',
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'embed'
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={updateContent}
        onKeyUp={updateContent}
        data-placeholder={placeholder}
        dir="ltr"
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: embed !important;
          }
          .rich-text-editor:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
            direction: ltr;
            text-align: left;
          }
          .rich-text-editor * {
            direction: ltr !important;
            text-align: left !important;
          }
        `
      }} />
    </div>
  );
};
