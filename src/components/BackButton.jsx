import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackButton({ href, children }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-[#a57551] hover:text-[#7b5b3e] mb-4">
      <ArrowLeft className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  )
}