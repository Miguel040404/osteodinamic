export default function NormasPageHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-[#e8d7c3] p-3 rounded-lg">
        {icon}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037]">{title}</h1>
    </div>
  )
}