
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Paperclip } from 'lucide-react';

interface FileUploaderProps {
  type: 'image' | 'file';
  onUpload: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  type,
  onUpload,
  accept,
  multiple = true
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        id={`file-upload-${type}`}
        accept={accept || (type === 'image' ? 'image/*' : '*/*')}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
      >
        {type === 'image' ? (
          <ImageIcon size={16} className="mr-2" />
        ) : (
          <Paperclip size={16} className="mr-2" />
        )}
        {type === 'image' ? 'Images' : 'Fichiers'}
      </Button>
    </div>
  );
};
