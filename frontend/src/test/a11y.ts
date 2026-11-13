import axe from 'axe-core';

/**
 * Runs axe-core with the WCAG 2.2 A/AA rule set (the level banks and governments target).
 * Colour contrast is off: jsdom has no layout or computed colours, so it can't be judged
 * here. Check contrast in a real browser instead.
 */
export async function findA11yViolations(node: Element): Promise<axe.Result[]> {
  const results = await axe.run(node, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
    resultTypes: ['violations'],
  });
  return results.violations;
}

/** Readable summary for a failing assertion: rule, impact, and the offending elements. */
export function describeViolations(violations: axe.Result[]): string {
  return violations
    .map((v) => {
      const targets = v.nodes.slice(0, 5).map((n) => `    ${n.target.join(' ')}`).join('\n');
      const more = v.nodes.length > 5 ? `\n    …and ${v.nodes.length - 5} more` : '';
      return `${v.id} (${v.impact}): ${v.help}\n${targets}${more}`;
    })
    .join('\n');
}

/** Fails with a readable list if `node` has any WCAG A/AA violations. */
export async function expectNoA11yViolations(node: Element): Promise<void> {
  const violations = await findA11yViolations(node);
  if (violations.length > 0) {
    throw new Error(`Accessibility violations:\n${describeViolations(violations)}`);
  }
}
