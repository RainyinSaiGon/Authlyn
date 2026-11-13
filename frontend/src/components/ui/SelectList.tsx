import type { ReactNode } from 'react';

interface SelectListProps<T> {
  /** Names the list for screen readers, e.g. "Roles". */
  label: string;
  items: readonly T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getKey: (item: T) => string;
  renderItem: (item: T, selected: boolean) => ReactNode;
  /** Draw a divider between items. */
  separated?: boolean;
  itemClassName?: string;
}

/**
 * The left-hand list of a list/detail layout. Every item is a real `<button>` (focusable,
 * Enter/Space work), and the chosen one carries `aria-current` so screen readers announce it.
 */
export function SelectList<T>({
  label,
  items,
  selectedIndex,
  onSelect,
  getKey,
  renderItem,
  separated = true,
  itemClassName = '',
}: SelectListProps<T>) {
  return (
    <ul aria-label={label} className="m-0 p-0 list-none">
      {items.map((item, index) => {
        const selected = index === selectedIndex;
        const divider = separated && index < items.length - 1 ? 'border-b border-b-border' : 'border-b-0';
        return (
          <li key={getKey(item)}>
            <button
              type="button"
              aria-current={selected ? 'true' : undefined}
              onClick={() => onSelect(index)}
              className={`w-full text-left bg-transparent text-inherit font-[inherit] cursor-pointer border-t-0 border-r-0 border-l-2 ${divider} ${
                selected ? 'bg-[rgba(248,125,73,0.06)] border-l-accent' : 'border-l-transparent'
              } ${itemClassName}`}
            >
              {renderItem(item, selected)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
