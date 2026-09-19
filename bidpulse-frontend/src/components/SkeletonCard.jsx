export default function SkeletonCard() {
  return (
    <article className="glass-card overflow-hidden animate-pulse">
      {/* Aspect-Ratio Locked Image Placeholder */}
      <div className="relative aspect-[4/3] bg-black/40 border-b border-white/5">
        <div className="absolute top-4 right-4 w-20 h-6 bg-white/10 rounded-full"></div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Title Placeholder */}
        <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-white/10 rounded w-1/2 mb-6"></div>
        
        {/* Current Bid Placeholder */}
        <div className="mt-auto flex justify-between items-end mb-6">
          <div>
            <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
            <div className="h-8 bg-white/10 rounded w-32"></div>
          </div>
        </div>

        {/* Timer Placeholder */}
        <div className="mb-6 py-3 px-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center">
           <div className="h-6 bg-white/10 rounded w-3/4"></div>
        </div>

        {/* Button Placeholder */}
        <div className="w-full h-12 bg-white/10 rounded-xl"></div>
      </div>
    </article>
  );
}
