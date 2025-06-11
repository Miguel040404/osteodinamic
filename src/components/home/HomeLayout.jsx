import Footer from "../footer";
import Header from "../Header";

export const HomeLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-b bg-[#F2F1E8]">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
      {children}
    </main>
    <Footer />
  </div>
);