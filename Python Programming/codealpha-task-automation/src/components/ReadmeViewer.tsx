import React from 'react';
import Markdown from 'react-markdown';
import { README_CONTENT } from '../data/pythonScript';

export const ReadmeViewer: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6">
      <div className="prose prose-sm max-w-none text-slate-800 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:pb-2 [&_h1]:mb-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-xs [&_ul]:space-y-1 [&_li]:leading-relaxed [&_code]:font-mono [&_code]:text-[11px] [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100">
        <Markdown>{README_CONTENT}</Markdown>
      </div>
    </div>
  );
};
