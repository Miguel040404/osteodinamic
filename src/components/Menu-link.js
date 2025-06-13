'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";


function MenuLink({ label, href, icon }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl transition-colors duration-200
        ${isActive
          ? 'bg-[#4d4037] text-[#f9faf5] shadow-lg'
          : 'bg-gray-100 text-[#4d4037] hover:bg-[#a57551] hover:text-[#f9faf5]'}
      `}
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
        {icon}
      </div>
      <span className="mt-1 text-xs sm:text-sm font-medium">{label}</span>
    </Link>
  );
}

export default MenuLink;