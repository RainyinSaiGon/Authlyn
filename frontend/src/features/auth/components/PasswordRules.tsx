import { PASSWORD_RULES } from '@/features/auth/schemas';
import { Icon } from '@/components/ui/Icon';

/**
 * Live checklist of the password rules plus a strength bar. Each rule says whether it is
 * met in text, not only by colour, so it works for screen readers and colour-blind users.
 */
export function PasswordRules({ password, id }: { password: string; id?: string }) {
  const results = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) }));
  const metCount = results.filter((rule) => rule.met).length;

  return (
    <div id={id} className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-1" aria-hidden="true">
        {results.map((rule, index) => (
          <div
            key={rule.id}
            className={`flex-1 h-[3px] rounded-pill ${index < metCount ? 'bg-mint' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <ul aria-label="Requirements" className="m-0 p-0 list-none grid grid-cols-2 gap-x-3 gap-y-1">
        {results.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-[6px] text-[12px] ${rule.met ? 'text-fg-2' : 'text-fg-3'}`}
          >
            <Icon name={rule.met ? 'check' : 'x'} size={11} className={rule.met ? 'text-mint' : ''} />
            <span>
              {rule.label}
              <span className="sr-only">{rule.met ? ' (met)' : ' (not met)'}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
