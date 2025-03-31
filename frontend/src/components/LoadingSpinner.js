const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
  </div>
);

export default LoadingSpinner; 