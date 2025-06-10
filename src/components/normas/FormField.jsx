export const FormField = ({
  name,
  label,
  textarea = false,
  defaultValue = '',
  ...props
}) => (
  <div className="space-y-2">
    <label className="text-[#4d4037] font-medium">{label}</label>
    {textarea ? (
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-white border border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none"
        {...props}
      />
    ) : (
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-white border border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition"
        {...props}
      />
    )}
  </div>
)