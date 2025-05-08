'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

function PerfilLink({ label, href, icon }) {
    const pathname = usePathname()

    return (
        <Link
            href={href}
            className={`peer-not-checked:hidden flex gap-2 items-center p-4 rounded-full text-lg font-semibold active:bg-amber-700  hover:bg-slate-600 hover:text-white transition duration-300 ${pathname.startsWith(href) && 'bg-slate-300 text-black'}`}>
            {icon} <span> {label}</span>
        </Link>
    );
}

export default PerfilLink
