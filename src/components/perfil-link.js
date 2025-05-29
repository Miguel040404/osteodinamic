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

<<<<<<< HEAD
  return (
    <Link
      href={href || "#"}
      onClick={handleClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border bg-white text-gray-700 hover:bg-slate-100 transition ${
        pathname.startsWith(href) ? "border-slate-300 bg-slate-50 font-semibold" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
=======
    return (
        <Link
            href={href || "#"}
            onClick={handleClick}
            className={`peer-not-checked:hidden flex gap-2 items-center p-4 rounded-full text-lg font-semibold active:bg-amber-700 hover:bg-slate-600 hover:text-white transition duration-300 ${pathname.startsWith(href) && 'bg-slate-300 text-black'
                }`}
        >
            {icon} <span>{label}</span>
        </Link>
    );
>>>>>>> 7508182c224d935fe67bd522edc67d0f573480d4
}

export default PerfilLink;


// 'use client'
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// function PerfilLink({ label, href, icon, onClick }) {
//     const pathname = usePathname();

//     const handleClick = (e) => {
//         if (onClick) {
//             e.preventDefault(); // evitar navegación automática
//             onClick();
//         }
//     };

//     return (
//         <Link
//             href={href || "#"}
//             onClick={handleClick}
//             className={`peer-not-checked:hidden flex gap-2 items-center p-4 rounded-full text-lg font-semibold active:bg-amber-700 hover:bg-slate-600 hover:text-white transition duration-300 ${
//                 pathname.startsWith(href) && 'bg-slate-300 text-black'
//             }`}
//         >
//             {icon} <span>{label}</span>
//         </Link>
//     );
// }

// export default PerfilLink;

