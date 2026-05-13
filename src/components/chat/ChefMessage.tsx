'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ChefMessageProps {
  message: string | React.ReactNode;
}

export default function ChefMessage({ message }: ChefMessageProps) {
  return (
    <div className="flex items-start gap-4 mb-8">
      {/* Avatar Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-16 h-16 rounded-full border-2 border-brand-primary/20 bg-white shadow-sm flex items-center justify-center overflow-hidden">
          {/* Placeholder for Chef Avatar */}
          <div className="text-brand-primary">
            <User size={32} />
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-primary">Chef Lucas</span>
      </motion.div>

      {/* Speech Bubble */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="relative bg-white border-2 border-brand-dark rounded-2xl rounded-tl-none p-6 shadow-[4px_4px_0px_0px_rgba(5,20,18,1)] max-w-[80%]"
      >
        {/* Triangle pointer */}
        <div className="absolute top-[-2px] left-[-10px] w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-brand-dark border-b-[10px] border-b-transparent"></div>
        <div className="absolute top-[0px] left-[-8px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>

        <div className="text-lg md:text-xl font-medium leading-relaxed text-brand-dark">
          {message}
        </div>
      </motion.div>
    </div>
  );
}
