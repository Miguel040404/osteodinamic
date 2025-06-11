export const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#f9faf5] bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a57551] mx-auto"></div>
      <p className="mt-4 text-lg text-[#4d4037] flex justify-center">
        Cargando
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);