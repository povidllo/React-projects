import { Button } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Story } from '@/model';
import { useState } from 'react';

interface CreateStoryDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

export function CreateStoryDialog({
  isOpen,
  setIsOpen,
  setStories,
}: CreateStoryDialogProps) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string | null>(null);

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file?.type.startsWith('image/')) {
      setError('File is not image');
      return;
    }
    if (file?.size > 1048576) {
      setError('File bigger then 1mb');
      return;
    }
    setError(null);
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      return;
    }
    const filePromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });

    try {
      const result = await filePromise;
      const newStory: Story = { url: result as string, date: Date.now() };
      if (typeof result === 'string') {
        const newStory: Story = { url: result, date: Date.now() };
        setStories((prev) => [...prev, newStory]);
      } else {
        setError('File reading failed');
      }
      setIsOpen(false);
      setFile(undefined);
    } catch {
      setError('Failed to convert file');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your story</DialogTitle>
        </DialogHeader>
        <Input type="file" onChange={handleChangeFile} />
        {error && <div className="text-red-700">{error}</div>}
        <Button onClick={handleSubmit}>submit</Button>
      </DialogContent>
    </Dialog>
  );
}
