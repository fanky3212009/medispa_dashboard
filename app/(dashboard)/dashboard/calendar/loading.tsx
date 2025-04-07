import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between p-4 border-b">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Skeleton className="h-24 w-full" />
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex border-b min-h-[100px]">
              <Skeleton className="w-20 h-full" />
              <div className="flex-1 p-2">
                <Skeleton className="h-16 w-full mb-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

