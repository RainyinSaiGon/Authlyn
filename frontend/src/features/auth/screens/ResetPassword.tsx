import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Icon } from '@/components/ui/Icon';

export function ResetPassword() {
  return (
    <AuthShell subhead="NEW PASSWORD" head="Choose a new password">
      <div className="glass xs flex items-start gap-[10px] p-3 border-[rgba(108,208,176,0.24)] bg-[rgba(108,208,176,0.06)]">
        <Icon name="check" size={14} className="text-mint mt-[2px] shrink-0" />
        <div className="text-[12.5px] leading-[1.5]">
          <div className="text-mint font-medium">Token verified</div>
          <div className="text-fg-2 font-mono text-[11px]">rtk_01HZXQK4…pAJ · exp 27m</div>
        </div>
      </div>

      <InputField
        label="New password"
        type="password"
        value="··············"
        hint="8+ characters"
        onChange={() => {}}
      />
      <InputField label="Confirm password" type="password" value="··············" onChange={() => {}} />

      <Button className="justify-center w-full" onClick={() => {}}>
        Update password
      </Button>
    </AuthShell>
  );
}
