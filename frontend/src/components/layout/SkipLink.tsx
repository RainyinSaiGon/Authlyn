export const MAIN_CONTENT_ID = 'main-content';

/**
 * First focusable element on pages with navigation. Hidden until focused, it lets keyboard
 * and screen-reader users jump past the sidebar to the page content (WCAG 2.4.1 Bypass Blocks).
 */
export function SkipLink() {
  return (
    <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
      Skip to main content
    </a>
  );
}
