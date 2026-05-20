export function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="surface-card p-5">
      <p className="heading-display text-3xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{label}</p>
      {accent ? <p className="mt-2 text-xs font-semibold text-primary">{accent}</p> : null}
    </div>
  );
}
