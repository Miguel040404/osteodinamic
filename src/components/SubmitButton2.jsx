import { LoadingSpinner } from "./LoadingSpinner";

export const SubmitButton2 = ({ 
  isSubmitting, 
  children,
  submittingText = "Procesando..." 
}) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
      isSubmitting 
        ? 'bg-[#c9bfa9] cursor-not-allowed' 
        : 'bg-[#a57551] hover:bg-[#8f5e40] shadow-sm hover:shadow-md'
    } text-white`}
  >
    {isSubmitting ? (
      <>
        <LoadingSpinner className="-ml-1 mr-3" />
        {submittingText}
      </>
    ) : children}
  </button>
)