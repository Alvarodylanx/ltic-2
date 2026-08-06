export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="h-4 w-48 bg-muted rounded" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Image skeleton */}
          <div className="space-y-3">
            <div className="aspect-square w-full bg-muted rounded-2xl" />
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-16 h-16 bg-muted rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-5">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-6 w-1/2 bg-muted rounded" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
              <div className="h-4 w-4/6 bg-muted rounded" />
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 flex-1 bg-muted rounded-xl" />
              <div className="h-11 w-11 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
