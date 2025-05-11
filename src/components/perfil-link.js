// 'use client'
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// function PerfilLink({ label, href, icon }) {
//     const pathname = usePathname()

//     return (
//         <Link
//             href={href}
//             className={`peer-not-checked:hidden flex gap-2 items-center p-4 rounded-full text-lg font-semibold active:bg-amber-700  hover:bg-slate-600 hover:text-white transition duration-300 ${pathname.startsWith(href) && 'bg-slate-300 text-black'}`}>
//             {icon} <span> {label}</span>
//         </Link>
//     );
// }

// export default PerfilLink


'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

function PerfilLink({ label, href, icon, onClick }) {
    const pathname = usePathname();

    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault(); // evitar navegación automática
            onClick();
        }
    };

    return (
        <Link
            href={href || "#"}
            onClick={handleClick}
            className={`peer-not-checked:hidden flex gap-2 items-center p-4 rounded-full text-lg font-semibold active:bg-amber-700 hover:bg-slate-600 hover:text-white transition duration-300 ${
                pathname.startsWith(href) && 'bg-slate-300 text-black'
            }`}
        >
            {icon} <span>{label}</span>
        </Link>
    );
}

export default PerfilLink;
