import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

const STEPS = ['Tenant', 'Branding', 'First app', 'Integrate', 'Invite'];

const CLIENT_ID = 'app_01HZXQK4M7RB9TP';

export function Onboarding() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[520px]">
        <div className="flex items-center gap-1 mb-[32px] overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              {i > 0 && <div className={`h-px w-[20px] ${i <= step ? 'bg-accent' : 'bg-border'}`} />}
              <div className="flex items-center gap-[6px]">
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                  i < step   ? 'bg-accent text-white' :
                  i === step ? 'bg-accent text-white' :
                               'bg-white/[0.06] text-fg-3'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[12px] whitespace-nowrap ${i === step ? 'text-fg-bright font-medium' : 'text-fg-3'}`}>{s}</span>
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
                <h2 className="m-0 text-[20px] font-semibold">Brand your workspace</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Customize how your login pages look for end users.</p>
              </div>
              <div>
                <div className="cap mb-[8px]">LOGO</div>
                <div className="glass xs p-[16px] flex items-center justify-center border-dashed border-border rounded-[12px] text-fg-3 text-[13px] cursor-pointer">
                  Drop an image or click to upload
                </div>
              </div>
              <InputField label="Brand color" placeholder="#f87d49" />
              <InputField label="Support email" type="email" placeholder="support@company.com" />
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Register your first app</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Connect your application to start issuing tokens.</p>
              </div>
              <InputField label="App name" placeholder="My App" />
              <InputField label="App type" placeholder="SPA · PKCE" />
              <InputField label="Redirect URI" placeholder="https://myapp.com/callback" />
              <InputField label="Post-signout URL" placeholder="https://myapp.com" />
              <div>
                <div className="cap mb-[6px]">CLIENT ID</div>
                <div className="glass xs p-[8px_12px] flex items-center justify-between">
                  <span className="font-mono text-[12px] text-accent-soft">{CLIENT_ID}</span>
                  <span className="text-fg-3 text-[11px] cursor-pointer">Copy</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Integrate the SDK</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Add authentication to your app in minutes.</p>
              </div>
              <div>
                <div className="cap mb-[8px]">INSTALL</div>
                <pre className="codeblock text-[12px] leading-[1.6]">npm install @authlyn/js</pre>
              </div>
              <div>
                <div className="cap mb-[8px]">INITIALIZE</div>
                <pre className="codeblock text-[12px] leading-[1.6] whitespace-pre-wrap">{`import { Authlyn } from '@authlyn/js';

const auth = new Authlyn({
  clientId: '${CLIENT_ID}',
  redirectUri: 'https://myapp.com/callback',
});`}</pre>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <h2 className="m-0 text-[20px] font-semibold">Invite your team</h2>
                <p className="m-0 mt-[6px] text-fg-3 text-[13.5px]">Add colleagues now or skip and do it later.</p>
              </div>
              <InputField label="Email address" type="email" placeholder="colleague@company.com" />
              <InputField label="Role" placeholder="Admin" />
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
