import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import SearchBox from './SearchBox';

/** Modal search opened from the header or with Ctrl/⌘ + K. Uses the native <dialog> for focus trapping. */
export default function SearchDialog({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="search-dialog" aria-label="Search" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className="search-dialog__inner">
        {open && <SearchBox variant="dialog" autoFocus onDone={onClose} />}
        <button className="icon-btn search-dialog__close" onClick={onClose} aria-label="Close search"><X /></button>
      </div>
    </dialog>
  );
}
