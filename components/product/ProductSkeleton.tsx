export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-h-[350px] w-full">
      <div className="animate-pulse bg-gray-200 h-48 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="animate-pulse bg-gray-200 h-4 rounded w-full" />
        <div className="animate-pulse bg-gray-200 h-3 rounded w-full" />
        <div className="animate-pulse bg-gray-200 h-3 rounded w-full" />
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="animate-pulse bg-gray-200 h-6 rounded w-3/4" />
        <div className="animate-pulse bg-gray-200 h-8 rounded-full w-8" />
      </div>
    </div>
  );
}