import type { Story } from '@/model';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { createPortal } from 'react-dom';
import './StoryPortal.css';

interface StoryPortalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  stories: Story[];
  storyIndex: number;
  setStoryIndex: Dispatch<SetStateAction<number | null>>;
  storyDom: DOMRect;
}

const DURATION = 5000;

export function StoryPortal({
  setIsOpen,
  stories,
  storyIndex,
  setStoryIndex,
  storyDom,
}: StoryPortalProps) {
  const [visible, setVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const scaleX = storyDom.width / window.innerWidth;
  const scaleY = storyDom.height / window.innerHeight;
  const translateX = storyDom.left + storyDom.width / 2 - window.innerWidth / 2;
  const translateY =
    storyDom.top + storyDom.height / 2 - window.innerHeight / 2;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    el.style.animation = 'none';

    el.style.transform = 'scaleX(0)';

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.offsetHeight;

    el.style.animation = `story-progress ${DURATION}ms linear forwards`;
    el.style.animationPlayState = 'running';

    const onEnd = () => handleNextStory();
    el.addEventListener('animationend', onEnd);

    return () => {
      el.removeEventListener('animationend', onEnd);
    };
  }, [storyIndex]);

  const handleCloseStory = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleNextStory = () => {
    if (storyIndex + 1 < stories.length) {
      setStoryIndex(storyIndex + 1);
    } else {
      handleCloseStory();
    }
  };

  const pauseTime = useRef(0);

  const pause = () => {
    progressRef.current!.style.animationPlayState = 'paused';
  };

  const resume = () => {
    progressRef.current!.style.animationPlayState = 'running';
  };

  return createPortal(
    <div
      onClick={handleCloseStory}
      className="fixed inset-0 z-1000 bg-black/70 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (pauseTime.current < 300) {
            handleNextStory();
          }
        }}
        onMouseDown={() => {
          pauseTime.current = Date.now();
          pause();
        }}
        onMouseUp={() => {
          pauseTime.current = Date.now() - pauseTime.current;
          resume();
        }}
        onTouchStart={pause}
        onTouchEnd={resume}
        className="max-w-md h-full py-10 mx-auto bg-black transition-transform duration-200 rounded-2xl relative"
        style={{
          transform: visible
            ? 'translate(0px, 0px) scale(1)'
            : `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        }}
      >
        <div className="absolute top-7 left-0 w-full px-2">
          <div className="h-1 w-full bg-white/30 rounded overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-white story-progress"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>

        <img
          src={stories[storyIndex].url}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
    </div>,
    document.getElementById('portal')!
  );
}
