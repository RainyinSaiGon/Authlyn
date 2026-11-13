import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';
import { Button } from './Button';
import { expectNoA11yViolations } from '@/test/a11y';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      {open && (
        <Modal
          title="Invite people"
          subtitle="Links are valid for 72 hours."
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button>Send</Button>
            </>
          }
        >
          <input aria-label="Email" />
        </Modal>
      )}
    </>
  );
}

async function openDialog() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  return user;
}

describe('Modal', () => {
  it('is a named, described modal dialog with no axe violations', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog', { name: 'Invite people' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Links are valid for 72 hours.');
    await expectNoA11yViolations(dialog);
  });

  it('moves focus into the dialog when it opens', async () => {
    await openDialog();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = await openDialog();
    const email = screen.getByRole('textbox', { name: 'Email' });
    const send = screen.getByRole('button', { name: 'Send' });

    await user.tab(); // Cancel
    await user.tab(); // Send
    expect(send).toHaveFocus();
    await user.tab(); // wraps
    expect(email).toHaveFocus();
    await user.tab({ shift: true }); // wraps back
    expect(send).toHaveFocus();
  });

  it('closes on Escape and returns focus to the button that opened it', async () => {
    const user = await openDialog();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open dialog' })).toHaveFocus();
  });
});
