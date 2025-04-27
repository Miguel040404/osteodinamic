import Footer from "@/components/footer";
import Header from "@/components/header";
import Main from "@/components/main";
import Link from "next/link";

export default function Home() {
    return (
        <div className="h-screen flex flex-col w-full">
            <Header />
            <Main/>
            <Footer />
        </div>
    );
}
