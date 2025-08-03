
import React from 'react';
import { motion } from 'framer-motion';
import CheckIcon from '../icons/CheckIcon';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(({ id, checked, onCheckedChange, className }, ref) => {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      ref={ref}
      className={`relative h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-transparent'} ${className}`}
    >
      <motion.div
        initial={false}
        animate={{ scale: checked ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex items-center justify-center h-full w-full"
      >
        <CheckIcon className="h-3.5 w-3.5 text-primary-foreground" />
      </motion.div>
    </button>
  );
});
Checkbox.displayName = "Checkbox";

export default Checkbox;
