interface Props {
  message?: string | null;
}

export function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <p
      role="alert"
      aria-live="assertive"
      className="border-destructive/40 bg-destructive/10 text-destructive rounded-sm border px-3 py-2 font-mono text-[11px] tracking-[0.5px]"
    >
      {message}
    </p>
  );
}
