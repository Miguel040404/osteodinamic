'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

function MenuLink({ label, href, icon }) {
    const pathname = usePathname()

    return (
        <Link
            href={href}
            className={`peer-not-checked:hidden flex gap-2 items-center p-2 rounded-full active:bg-amber-700  hover:bg-slate-600 hover:text-white transition duration-300 ${pathname.startsWith(href) && 'bg-slate-900 text-white'}`}>
            {icon} <span className='hidden md:block'> {label}</span>
        </Link>
    );
}

export default MenuLink