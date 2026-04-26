import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-5 px-6">
        <div className="font-mono text-[80px] font-medium text-fg-3 leading-none tracking-[-0.04em]">404</div>
        <div>
          <h1 className="m-0 text-[24px] font-semibold">Page not found</h1>
          <p className="m-0 mt-[8px] text-fg-3 text-[14px] max-w-[320px]">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}
