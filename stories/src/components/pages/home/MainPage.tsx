import '@/index.css';
import { Button } from '@/components/';
import { Plus } from 'lucide-react';
import { ThemeLayout } from '@/components/';
import { ScrollArea, ScrollBar } from '@/components/';
import { Header } from '@/components/';
import { useEffect, useRef, useState } from 'react';
import { CreateStoryDialog } from './CreateStoryDialog';
import { StoryPortal } from './StoryPortal';
import type { Story } from '@/model';

function MainPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(
    null
  );
  const [storyDom, setStoryDom] = useState<DOMRect | null>(null);

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);

  const storiesRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const localStorageStories: Story[] = JSON.parse(
      localStorage.getItem('stories') ?? '[]'
    );

    if (stories.length < localStorageStories.length) {
      setStories(localStorageStories);
    } else {
      localStorage.setItem('stories', JSON.stringify(stories));
    }
  }, [stories]);

  const handleCreateStory = () => {
    setIsOpenCreateDialog(true);
  };

  const handleOpenStory = (storyIndex: number) => {
    const ref = storiesRefs.current[storyIndex];
    if (ref == null) {
      return;
    }

    setStoryDom(ref.getBoundingClientRect());
    setIsStoryOpen(true);
    setCurrentStoryIndex(storyIndex);
  };

  return (
    <ThemeLayout>
      <Header />
      <main className="h-full w-full">
        <div className="max-w-5xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <ScrollArea className="max-w-3xl border-2 p-2 rounded-2xl min-w-0 w-full mx-4 md:mx-0 bg-card">
            <div className="flex gap-2 ">
              <Button
                variant="outline"
                className="w-20 h-20 rounded-full"
                onClick={handleCreateStory}
              >
                <Plus size={50} strokeWidth={1} className="" />
              </Button>
              {stories.map((story, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-20 h-20 rounded-full overflow-hidden p-0"
                  onClick={() => handleOpenStory(index)}
                  ref={(elem) => {
                    storiesRefs.current[index] = elem;
                  }}
                >
                  <img
                    src={`${story.url}`}
                    alt="Converted from Base64"
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2 px-1" />
          </ScrollArea>
        </div>
        <CreateStoryDialog
          isOpen={isOpenCreateDialog}
          setIsOpen={setIsOpenCreateDialog}
          setStories={setStories}
        />
      </main>
      {storyDom && isStoryOpen && currentStoryIndex !== null && (
        <StoryPortal
          setIsOpen={setIsStoryOpen}
          storyIndex={currentStoryIndex}
          stories={stories}
          setStoryIndex={setCurrentStoryIndex}
          storyDom={storyDom}
        />
      )}
    </ThemeLayout>
  );
}

export default MainPage;
