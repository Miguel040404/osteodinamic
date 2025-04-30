import Header from "@/components/header";
import Footer from "@/components/footer";

function Perfil() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Perfil</h1>
                <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </main>

            <Footer />
        </div>
    );
}

export default Perfil;

