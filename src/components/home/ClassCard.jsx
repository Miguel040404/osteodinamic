import Image from "next/image";
import Link from "next/link";

export const ClassCard = ({
    href,
    imageSrc,
    title,
    count,
    gradientColor = "bg-[#e4b4a0]",
    badgeColor = "bg-[#e39d7f]"
}) => (
    <Link href={href}>
        <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0">
                <Image
                    src={imageSrc}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
            </div>

            <div className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-80 transition-opacity duration-300 group-hover:opacity-70`} />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <div className="flex justify-between items-center">
                    <span className={`${badgeColor} bg-opacity-70 px-3 py-1 rounded-full text-sm`}>
                        {count} clases disponibles
                    </span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="mr-1">Ver</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);