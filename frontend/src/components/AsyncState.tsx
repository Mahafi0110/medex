export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-muted">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-line border-t-red" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-red/30 bg-pink-light px-6 py-10 text-center text-sm text-red-dark">
      Something went wrong loading this content: {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
      {message}
    </div>
  );
}
