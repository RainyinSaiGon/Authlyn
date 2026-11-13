import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountShell } from '@/components/layout/AccountShell';
import { signOut } from '@/features/auth/api/accountApi';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { InputField } from '@/components/ui/InputField';

interface Identity {
  provider: string;
  icon: IconName;
  sub: string;
  linked: boolean;
}

const IDENTITIES: Identity[] = [
  { provider: 'Google', icon: 'google', sub: 'maya.tran@pagoda.dev · primary', linked: true  },
  { provider: 'GitHub', icon: 'github', sub: 'mayatran · 2 repos',              linked: true  },
  { provider: 'Slack',  icon: 'slack',  sub: 'Pagoda workspace',                linked: false },
];

const SINCE_FORMAT = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

function ProfileHeader() {
  const current = useCurrentUser();

  if (current.status === 'loading') {
    return (
      <div aria-busy="true">
        <p className="eye">PROFILE</p>
        <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2">Loading your profile…</h1>
      </div>
    );
  }

  if (current.status === 'error') {
    return (
      <div>
        <p className="eye">PROFILE</p>
        <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2">Your profile</h1>
        <p role="alert" className="text-danger-soft text-[12.5px] mt-1 mb-0">
          We couldn't load your profile. Refresh the page to try again.
        </p>
      </div>
    );
  }

  const { user } = current;
  return (
    <div>
      <p className="eye">PROFILE</p>
      <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2">{user.displayName ?? user.email}</h1>
      <div className="text-fg-3 text-[12.5px] font-mono mt-1">
        {user.email}
        {!user.emailVerified && ' (unverified)'} — since {SINCE_FORMAT.format(new Date(user.createdAt))}
      </div>
    </div>
  );
}

function SignOutButton() {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  return (
    <Button
      variant="ghost"
      icon="x"
      disabled={signingOut}
      onClick={async () => {
        setSigningOut(true);
        await signOut();
        navigate('/auth/sign-in', { replace: true });
      }}
    >
      {signingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}

export function Profile() {
  return (
    <AccountShell active="profile">
      <div className="flex justify-between items-end mb-6">
        <ProfileHeader />
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon="edit">Edit profile</Button>
          <SignOutButton />
        </div>
      </div>

      <div className="glass p-6 grid grid-cols-[120px_1fr] gap-7">
        <div className="flex flex-col items-start">
          <Avatar name="Maya Tran" size="xl" />
          <Button variant="link" size="xs" className="mt-[10px] !px-0">Change</Button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Display name" value="Maya Tran"                    onChange={() => {}} />
          <InputField label="Pronouns"     value="she/her"                      onChange={() => {}} />
          <InputField label="Email"        value="maya.tran@pagoda.dev" mono    onChange={() => {}} />
          <InputField label="Phone"        value="+84 90 123 4567"     mono     onChange={() => {}} />
          <InputField label="Time zone"    value="Asia/Ho_Chi_Minh · UTC+7" mono onChange={() => {}} />
          <InputField label="Language"     value="English (US)"                 onChange={() => {}} />
        </div>
      </div>

      <h2 className="text-[18px] font-semibold mt-8 mb-[14px]">Linked identities</h2>
      <div className="glass p-[6px]">
        {IDENTITIES.map((x) => (
          <div key={x.provider} className="flex items-center justify-between px-[18px] py-[14px] border-b border-border last:border-b-0">
            <div className="flex items-center gap-[14px]">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-white/[0.04] border border-border flex items-center justify-center shrink-0">
                <Icon name={x.icon} size={16} />
              </div>
              <div>
                <div className="text-[14px] font-medium">{x.provider}</div>
                <div className="text-[12px] text-fg-3 font-mono">{x.sub}</div>
              </div>
            </div>
            {x.linked
              ? <Button variant="ghost" size="sm">Unlink</Button>
              : <Button variant="ghost" size="sm" icon="plus">Connect</Button>
            }
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
