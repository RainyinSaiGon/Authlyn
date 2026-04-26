import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

const STEPS = ['Create tenant', 'Invite team', 'Set up app'];

export function Onboarding() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        <div className="flex items-center gap-2 mb-[32px]">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-[24px] ${i <= step ? 'bg-accent' : 'bg-border'}`} />}
              <div className="flex items-center gap-[6px]">
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold ${
                  i < step  ? 'bg-accent text-white' :
                  i === step ? 'bg-accent text-white' :
                               'bg-white/[0.06] text-fg-3'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[12.5px] ${i === step ? 'text-fg-bright font-medium' : 'text-fg-3'}`}>{s}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-[32px] flex flex-col gap-[22px]">
          {step === 0 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Create your tenant</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Your tenant is a private workspace for your team and apps.</p>
              </div>
              <InputField label="Workspace name" placeholder="Acme Corp" />
              <InputField label="Slug" placeholder="acme-corp" />
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Invite your team</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Add colleagues now or skip and do it later.</p>
              </div>
              <InputField label="Email address" type="email" placeholder="colleague@company.com" />
              <InputField label="Role" placeholder="Admin" />
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Register your first app</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Connect your application to start issuing tokens.</p>
              </div>
              <InputField label="App name" placeholder="My App" />
              <InputField label="Callback URL" placeholder="https://myapp.com/callback" />
            </>
          )}

          <div className="flex items-center justify-between pt-[4px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button size="sm">Finish setup</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
