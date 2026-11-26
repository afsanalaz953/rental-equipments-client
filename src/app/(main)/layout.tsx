import Navbar from "@/components/home/Navbar";
import Footer from "@/components/shared/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}