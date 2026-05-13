export default function Loading() {
  return (
    <div className="section-padding">
      <div className="container-width space-y-6">
        <div className="skeleton h-16 rounded-[28px] bg-surface" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-72 rounded-[28px] bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
