import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';

const CHIPS = ['oli@pagoda.dev', 'hina.sato@pagoda.dev', 'wes@pagoda.dev'];

interface InviteModalProps {
  onClose: () => void;
}

export function InviteModal({ onClose }: InviteModalProps) {
  return (
    <Modal
      title="Invite to Pagoda"
      subtitle="Each invitee receives a signed link, valid 72 hours. They choose their own password or passkey."
      className="w-[520px]"
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" icon="mail">Send 3 invites</Button>
        </>
      }
    >
      <div className="glass xs p-3 bg-black/25 flex flex-wrap gap-2 min-h-[48px] items-center">
        {CHIPS.map((e) => (
          <span key={e} className="pill flex items-center gap-[6px] bg-[rgba(248,125,73,0.1)] border-[rgba(248,125,73,0.28)]">
            {e}
            <Icon name="x" size={11} />
          </span>
        ))}
        <span className="text-fg-3 text-[13px]">+</span>
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        <InputField label="Organization" value="Pagoda · Eng" onChange={() => {}} />
        <InputField label="Default role" value="Member" onChange={() => {}} />
      </div>

      <div className="flex items-center gap-[10px] text-[12px] text-fg-2">
        <Toggle on />
        Require MFA on first sign-in
      </div>
      <div className="flex items-center gap-[10px] text-[12px] text-fg-2">
        <Toggle />
        Force password change on first sign-in
      </div>
    </Modal>
  );
}
