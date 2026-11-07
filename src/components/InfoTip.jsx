import { useEffect, useId, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import './InfoTip.css';

export default function InfoTip({ label, children }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const tipRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!tipRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return <span className={`info-tip${open ? ' info-tip-open' : ''}`} ref={tipRef}>
    <button
      className="info-tip-trigger"
      type="button"
      ref={triggerRef}
      aria-label={`About ${label}`}
      aria-controls={id}
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
    >
      <Info size={13} aria-hidden="true" />
    </button>
    <span className="info-tip-content" id={id} role="dialog" aria-labelledby={`${id}-label`} hidden={!open}>
      <span className="info-tip-heading">
        <strong id={`${id}-label`}>{label}</strong>
        <button
          className="info-tip-close"
          type="button"
          aria-label={`Close ${label} explanation`}
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          <X size={13} aria-hidden="true" />
        </button>
      </span>
      <span>{children}</span>
    </span>
  </span>;
}
