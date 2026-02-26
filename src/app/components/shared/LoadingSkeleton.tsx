import { Card, CardContent } from '../ui/card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-24" />
              </div>
              <div className="h-2 bg-slate-200 rounded w-full" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-slate-200 rounded" />
                <div className="h-16 bg-slate-200 rounded" />
                <div className="h-16 bg-slate-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
