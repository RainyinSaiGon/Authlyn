import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';
import { Toggle } from './Toggle';
import { Segmented } from './Segmented';
import { SelectList } from './SelectList';
import { expectNoA11yViolations } from '@/test/a11y';

describe('Tabs', () => {
  function TabsHarness() {
    const [tab, setTab] = useState('Overview');
    return (
      <Tabs label="User details" options={['Overview', 'Sessions', 'Roles']} value={tab} onChange={setTab}>
        <p>{tab} content</p>
      </Tabs>
    );
  }

  it('exposes a labelled tablist with the selected tab and its panel', async () => {
    const { container } = render(<TabsHarness />);
    expect(screen.getByRole('tablist', { name: 'User details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview content');
    await expectNoA11yViolations(container);
  });

  it('is one tab stop; arrow keys, Home and End move and select', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Sessions' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Sessions' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Sessions content');

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Roles' })).toHaveFocus();
    await user.keyboard('{ArrowRight}'); // wraps to the first tab
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}'); // wraps to the last tab
    expect(screen.getByRole('tab', { name: 'Roles' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    // Only the selected tab is in the Tab order.
    expect(screen.getAllByRole('tab').filter((t) => t.tabIndex === 0)).toHaveLength(1);
  });
});

describe('Toggle', () => {
  function ToggleHarness() {
    const [on, setOn] = useState(false);
    return <Toggle label="Require MFA" on={on} onChange={setOn} />;
  }

  it('is a named switch that Space and Enter toggle', async () => {
    const user = userEvent.setup();
    render(<ToggleHarness />);
    const toggle = screen.getByRole('switch', { name: 'Require MFA' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('can be named by visible text', () => {
    render(
      <>
        <span id="lbl">Force password change</span>
        <Toggle labelledBy="lbl" />
      </>
    );
    expect(screen.getByRole('switch', { name: 'Force password change' })).toBeInTheDocument();
  });
});

describe('Segmented', () => {
  it('is a labelled group whose selected option is pressed', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [v, setV] = useState('14d');
      return <Segmented label="Time range" options={['24h', '14d', '30d']} value={v} onChange={setV} />;
    }
    const { container } = render(<Harness />);

    expect(screen.getByRole('group', { name: 'Time range' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '14d' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '30d' }));
    expect(screen.getByRole('button', { name: '30d' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '14d' })).toHaveAttribute('aria-pressed', 'false');
    await expectNoA11yViolations(container);
  });
});

describe('SelectList', () => {
  it('uses real buttons and marks the current item', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [i, setI] = useState(0);
      return (
        <SelectList
          label="Roles"
          items={['Owner', 'Admin', 'Member']}
          selectedIndex={i}
          onSelect={setI}
          getKey={(r) => r}
          renderItem={(r) => r}
        />
      );
    }
    render(<Harness />);

    expect(screen.getByRole('list', { name: 'Roles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Owner' })).toHaveAttribute('aria-current', 'true');

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Admin' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Admin' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Owner' })).not.toHaveAttribute('aria-current');
  });
});
