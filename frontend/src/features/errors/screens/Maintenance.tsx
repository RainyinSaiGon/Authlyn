export function Maintenance() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-6 px-6">
        <div className="w-[72px] h-[72px] rounded-[20px] bg-white/[0.04] border border-border flex items-center justify-center">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-fg-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
        </div>

        <div>
          <h1 className="m-0 text-[24px] font-semibold">Under maintenance</h1>
          <p className="m-0 mt-[8px] text-fg-3 text-[14px] max-w-[360px]">
            We're performing scheduled maintenance and will be back shortly. Thanks for your patience.
          </p>
        </div>

        <div className="glass xs px-[20px] py-[12px] flex items-center gap-3">
          <span className="w-[6px] h-[6px] rounded-full bg-warning animate-pulse shrink-0" />
          <span className="text-fg-2 text-[13px]">Estimated time: <span className="font-mono text-fg-bright">~30 min</span></span>
        </div>

        <p className="text-fg-3 text-[12px] m-0">
          Check{' '}
          <a href="#" className="text-accent-soft underline">status.authlyn.io</a>
          {' '}for live updates.
        </p>
      </div>
    </div>
  );
}
