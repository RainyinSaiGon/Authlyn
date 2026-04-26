import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

export function ResetPassword() {
  return (
    <AuthShell head="Choose a new password" centered>

      <InputField
        label="New password"
        type="password"
        value="··············"
        onChange={() => {}}
      />
      <InputField label="Confirm password" type="password" value="··············" onChange={() => {}} />

      <Button className="justify-center w-full" onClick={() => {}}>
        Update password
      </Button>
    </AuthShell>
  );
}
