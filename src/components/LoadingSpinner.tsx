interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card-product animate-pulse">
          <div className="h-48 sm:h-56 bg-muted rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-5 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-9 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};