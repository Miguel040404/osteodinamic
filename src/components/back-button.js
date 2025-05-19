'use client'

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // IMPORTANTE: No importar desde next/router

function BackButton() {
    const { back } = useRouter()
    return (
        <div onClick={back} className="w-fit bg-indigo-400 p-2 rounded-full ">
            <ArrowLeftIcon className="size-4 text-white" />
        </div>
    );
}

export default BackButton;