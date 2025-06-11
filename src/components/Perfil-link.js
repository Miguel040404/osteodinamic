'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

function PerfilLink({ label, href, icon, onClick }) {
  const pathname = usePathname();

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      href={href || "#"}
      onClick={handleClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border border-[#b9b59c] bg-white text-[#30251e] hover:bg-[#eee6e1] transition ${pathname.startsWith(href) ? "border-slate-300 bg-slate-50 font-semibold" : ""
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default PerfilLink;
