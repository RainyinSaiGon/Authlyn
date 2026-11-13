import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

type TabOption = string | { value: string; label: string };

const valueOf = (o: TabOption) => (typeof o === 'string' ? o : o.value);
const labelOf = (o: TabOption) => (typeof o === 'string' ? o : o.label);

interface TabsProps {
  /** Names the tab list for screen readers, e.g. "User details". */
  label: string;
  options: TabOption[];
  value: string;
  onChange?: (value: string) => void;
  /** The content of the selected tab. Rendered in a tabpanel labelled by that tab. */
  children?: ReactNode;
}

/**
 * WAI-ARIA tabs with automatic activation: one tab stop for the whole list,
 * arrow keys move between tabs (wrapping), Home/End jump to the ends.
 */
export function Tabs({ label, options, value, onChange, children }: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = (v: string) => `${baseId}-tab-${v}`;
  const panelId = `${baseId}-panel`;
  const selectedIndex = Math.max(0, options.findIndex((o) => valueOf(o) === value));

  const select = (index: number) => {
    const wrapped = (index + options.length) % options.length;
    const option = options[wrapped];
    if (!option) return;
    onChange?.(valueOf(option));
    tabRefs.current[wrapped]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: selectedIndex + 1,
      ArrowLeft: selectedIndex - 1,
      Home: 0,
      End: options.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={label}>
        {options.map((o, index) => {
          const v = valueOf(o);
          const selected = index === selectedIndex;
          return (
            <button
              key={v}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId(v)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={children === undefined ? undefined : panelId}
              tabIndex={selected ? 0 : -1}
              className={selected ? 'active' : ''}
              onClick={() => onChange?.(v)}
              onKeyDown={onKeyDown}
            >
              {labelOf(o)}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div role="tabpanel" id={panelId} aria-labelledby={tabId(valueOf(options[selectedIndex] ?? ''))}>
          {children}
        </div>
      )}
    </>
  );
}
