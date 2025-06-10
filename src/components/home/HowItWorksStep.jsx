export const HowItWorksStep = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-[#e4b4a0c2] rounded-full w-16 h-16 flex items-center justify-center mb-3">
      <span className="text-[#4d4037] text-2xl font-bold">{number}</span>
    </div>
    <h3 className="!text-gray-700 font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);