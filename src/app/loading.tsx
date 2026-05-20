export default function Loading() {
  return (
    <div className="section-padding">
      <div className="container-width space-y-4">
        <div className="skeleton h-12 rounded-md bg-surface" />
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-64 rounded-md bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
