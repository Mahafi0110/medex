export default function PhoneFrame({ appName = "App" }: { appName?: string }) {
  return (
    <div className="mx-auto h-72 w-40 rounded-[28px] border-[3px] border-blue-dark bg-blue-dark p-1.5 shadow-lg">
      <div className="flex h-full w-full flex-col rounded-[20px] bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-blue-dark">{appName}</span>
          <span className="h-2 w-2 rounded-full bg-pink-light" />
        </div>
        <div className="mt-3 h-3 w-3/4 rounded bg-surface" />
        <div className="mt-2 h-2 w-1/2 rounded bg-surface" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-blue-light" />
          ))}
        </div>
        <div className="mt-auto flex justify-between pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-1.5 w-4 rounded-full bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}