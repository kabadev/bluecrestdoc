import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-5 w-24 bg-muted rounded-md animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded-md animate-pulse mb-2" />
              <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Direction Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded-md animate-pulse mb-2" />
              <div className="h-4 w-48 bg-muted rounded-md animate-pulse" />
            </CardHeader>
            <CardContent className="flex justify-around">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse mx-auto mb-2" />
                <div className="h-8 w-16 bg-muted rounded-md animate-pulse mx-auto mb-2" />
                <div className="h-4 w-20 bg-muted rounded-md animate-pulse mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse mx-auto mb-2" />
                <div className="h-8 w-16 bg-muted rounded-md animate-pulse mx-auto mb-2" />
                <div className="h-4 w-20 bg-muted rounded-md animate-pulse mx-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded-md animate-pulse mb-2" />
              <div className="h-4 w-48 bg-muted rounded-md animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted rounded-md animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File Type Distribution Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md animate-pulse mb-2" />
          <div className="h-4 w-56 bg-muted rounded-md animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                </div>
                <div className="h-2 w-full bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Letters Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md animate-pulse mb-2" />
          <div className="h-4 w-56 bg-muted rounded-md animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 border border-border rounded-lg"
              >
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-muted rounded-md animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
