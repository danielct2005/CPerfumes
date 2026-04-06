'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

export default function Toast({ show, message, onClose }: ToastProps) {
  if (onClose && show) {
    setTimeout(onClose, 2500);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium tracking-wide z-50 border border-zinc-800"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}