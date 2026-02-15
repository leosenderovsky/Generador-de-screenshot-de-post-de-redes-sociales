
import React, { forwardRef } from 'react';
import { PostData, Layout, Theme } from '../types';
import PostCard from './PostCard';

interface PreviewCanvasProps {
  background: string;
  postData: PostData;
  layout: Layout;
  theme: Theme;
}

const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  ({ background, postData, layout, theme }, ref) => {
    return (
      <main className="w-full lg:w-2/3 xl:w-3/4 flex-grow flex items-center justify-center p-4 lg:p-10 relative">
        <div ref={ref} className={`p-8 md:p-12 lg:p-16 rounded-xl transition-all duration-300 ${background}`}>
          <PostCard postData={postData} layout={layout} theme={theme} />
        </div>
      </main>
    );
  }
);

PreviewCanvas.displayName = 'PreviewCanvas';

export default PreviewCanvas;
