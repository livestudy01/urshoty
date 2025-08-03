import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownMenu');
  }
  return context;
};

const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
};

const DropdownMenuTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children, asChild = false }) => {
  const { open, setOpen } = useDropdown();
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement<{ onClick?: (event: React.MouseEvent<HTMLElement>) => void }>(child)) {
      return React.cloneElement(child, {
        ref: triggerRef,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          setOpen((prev) => !prev);
          if (child.props.onClick) {
            child.props.onClick(event);
          }
        },
      });
    }
  }

  return (
    <button ref={triggerRef} onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
};

const DropdownMenuContent: React.FC<{ children: React.ReactNode; className?: string; align?: 'start' | 'end' }> = ({ children, className, align = 'start' }) => {
  const { open, setOpen } = useDropdown();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  const alignmentClass = align === 'end' ? 'right-0' : 'left-0';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`absolute ${alignmentClass} z-10 mt-2 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DropdownMenuItem: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const { setOpen } = useDropdown();
  const handleClick = () => {
    if (onClick) onClick();
    setOpen(false);
  };
  return (
    <button
      onClick={handleClick}
      className={`block w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-secondary ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  );
};

const DropdownMenuLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`px-4 py-2 text-sm text-muted-foreground ${className}`}>
    {children}
  </div>
);

const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`border-t border-border my-1 ${className}`} />
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
