import React from 'react';

interface BlockquoteProps  {
    content: string;
    type: string;
};

const Blockquote: React.FC<BlockquoteProps > = ({ content, type }) => {
    return (
        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparent">
            <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">{content}</p>
            <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>{type}</p>
        </blockquote>
    );
}

export default Blockquote;
