import { LoadingSpinner } from "./LoadingSpinner";

export function SubmitButton({ isSubmitting, children }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${isSubmitting
          ? 'bg-[#a57551cc] cursor-not-allowed'
          : 'bg-[#a57551] hover:bg-[#8d6040] shadow-sm hover:shadow-md'
        } text-white`}
    >
      {isSubmitting ? (
        <>
          <LoadingSpinner className="-ml-1 mr-3" />
          Publicando...
        </>
      ) : (
        children
      )}
    </button>
  )
}