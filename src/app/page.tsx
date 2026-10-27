import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FullStackFeatures from "@/components/FullStackFeatures";
import UseCases from "@/components/UseCases";
import DesignSection from "@/components/DesignSection";
import MarketingTools from "@/components/MarketingTools";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FullStackFeatures />
        <UseCases />
        <DesignSection />
        <MarketingTools />
        <Testimonial />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
