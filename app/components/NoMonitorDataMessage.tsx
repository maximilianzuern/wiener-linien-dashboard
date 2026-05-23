export const NoMonitorDataMessage = ({ stopIds }: { stopIds: number[] }) => (
  <div
    className="mb-3 border-l-4 border-yellow-500 bg-yellow-100 p-3 text-base text-yellow-700"
    role="alert"
  >
    No monitor data for stopID(s): <strong>{stopIds.join(", ")}</strong>. They may be invalid, or
    currently have no realtime departures.
  </div>
);
