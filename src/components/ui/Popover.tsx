import { useState, useRef, useEffect, type ReactNode, useLayoutEffect, useCallback } from 'react';
import { Portal } from './Portal';
import { useEditorConfig } from '../editor/EditorConfig';

const GAP = 8;
const VIEWPORT_MARGIN = 8;

interface PopoverProps {
  trigger: ReactNode;
  content: (close: () => void) => ReactNode;
  className?: string;
  matchTriggerWidth?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Popover = ({ 
  trigger, 
  content, 
  className = '', 
  matchTriggerWidth = true,
  disabled = false,
  fullWidth = false,
}: PopoverProps) => {
  const { theme } = useEditorConfig();
  const [isOpen, setIsOpen] = useState(false);
  // ... (rest of the component)
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [ready, setReady] = useState(false);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = popoverRef.current?.offsetHeight ?? 0;

    const spaceBelow = window.innerHeight - VIEWPORT_MARGIN - triggerRect.bottom;
    const spaceAbove = triggerRect.top - VIEWPORT_MARGIN;

    const need = popoverHeight + GAP;

    let newPlacement: 'top' | 'bottom' = 'bottom';
    if (popoverHeight > 0) {
      if (spaceBelow >= need) {
        newPlacement = 'bottom';
      } else if (spaceAbove >= need) {
        newPlacement = 'top';
      } else {
        newPlacement = spaceAbove > spaceBelow ? 'top' : 'bottom';
      }
    }

    const top =
      newPlacement === 'bottom'
        ? triggerRect.bottom + GAP
        : triggerRect.top - popoverHeight - GAP;

    const measuredWidth = matchTriggerWidth
      ? triggerRect.width
      : Math.max(popoverRef.current?.offsetWidth ?? 0, triggerRect.width);

    const clampedLeft = Math.max(
      VIEWPORT_MARGIN,
      Math.min(triggerRect.left, window.innerWidth - measuredWidth - VIEWPORT_MARGIN)
    );

    setPlacement(newPlacement);
    setCoords({
      top,
      left: clampedLeft,
      width: triggerRect.width,
    });
    setReady(true);
  }, [isOpen, matchTriggerWidth]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const rafId = requestAnimationFrame(() => {
      updatePosition();
    });

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset readiness when popover closes
      setReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (disabled && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync closed state when disabled
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both trigger and popover content
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-fit'} inline-block ${className}`} ref={triggerRef}>
      <div
        onClick={handleToggle}
        className={`${fullWidth ? 'w-full' : 'w-fit'} ${disabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        role="button"
      >
        {trigger}
      </div>
      {isOpen && (
        <Portal>
          <div 
            ref={popoverRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ 
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: matchTriggerWidth ? `${coords.width}px` : 'auto',
              zIndex: 9999,
              pointerEvents: 'auto',
              opacity: ready ? 1 : 0,
              transform: ready ? 'scale(1)' : 'scale(0.95)',
              transition: ready ? 'opacity 150ms ease-out, transform 150ms ease-out' : 'none',
              transformOrigin: placement === 'top' ? 'bottom' : 'top',
            }}
            className={`${!matchTriggerWidth ? 'md:w-max' : ''} ${theme === 'dark' ? 'dark' : ''}`}
          >
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
              {content(() => setIsOpen(false))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
