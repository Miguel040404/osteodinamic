import { auth } from "@/auth";
import { redirect } from "next/navigation";


function page() {
    const session = auth()

    if (!session) {
        redirect('/auth/login')
    }
    if (session) {
        redirect('/home')
    }
}

export default page;