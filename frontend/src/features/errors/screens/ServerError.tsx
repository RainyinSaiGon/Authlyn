import { Button } from '@/components/ui/Button';

export function ServerError() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-5 px-6">
        <div className="font-mono text-[80px] font-medium text-danger leading-none tracking-[-0.04em]">500</div>
        <div>
          <h1 className="m-0 text-[24px] font-semibold">Something went wrong</h1>
          <p className="m-0 mt-[8px] text-fg-3 text-[14px] max-w-[360px]">
            An unexpected error occurred on our end. The team has been notified.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => window.location.reload()}>Refresh page</Button>
          <Button onClick={() => window.history.back()}>Go back</Button>
        </div>
      </div>
    </div>
  );
}
