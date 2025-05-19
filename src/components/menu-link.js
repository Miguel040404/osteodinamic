'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

function MenuLink({ label, href, icon }) {
    const pathname = usePathname()

    const isActive = pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`peer-not-checked:hidden flex flex-col items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-lg transition duration-300 shadow-md
            ${isActive ? 'bg-slate-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-slate-500 hover:text-white'}`}>

            <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center ${isActive ? 'text-white' : 'text-blue-700 hover:text-white'}`}>
                {icon}
            </div>

            <span className="mt-1 sm:mt-2 text-[0.75rem] sm:text-sm font-medium">{label}</span>
        </Link>

    );
}

export default MenuLink;