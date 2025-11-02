export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-8 min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}