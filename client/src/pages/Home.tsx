/* 
  Design Philosophy: "Comparador Premium" — Modern Editorial + Tech Gradient
  - Background: warm cream (#FAF8F5) as base
  - Primary gradient: cyan (#00D4E8) → purple (#A855F7)
  - Dark sections: blue-slate (#1E2A4A)
  - Typography: Sora (bold display) + Inter (body)
  - Animations: Framer Motion staggered fade-ins
  
  Section order:
  1. Navbar
  2. Hero (creme)
  3. Categories (escuro)
  4. Plans - Internet (creme)
  5. Celular (creme)
  6. Streaming (escuro)
  7. Providers (escuro)
  8. Award (creme)
  9. HowItWorks (escuro)
  10. WhyUs (creme)
  11. Links (escuro)
  12. CTA (gradiente)
  13. Footer (escuro)
*/
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import PlansSection from "@/components/PlansSection";
import CelularSection from "@/components/CelularSection";
import StreamingSection from "@/components/StreamingSection";
import ProvidersSection from "@/components/ProvidersSection";
import AwardSection from "@/components/AwardSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyUsSection from "@/components/WhyUsSection";
import LinksSection from "@/components/LinksSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import RegionalPlansFilter from "@/components/RegionalPlansFilter";
import PlanNotificationsWidget from "@/components/PlanNotificationsWidget";
import Footer from "@/components/Footer";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF8F5" }}>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <PlansSection />
        <CelularSection />
        <StreamingSection />
        <ProvidersSection />
        <AwardSection />
        <HowItWorksSection />
        <WhyUsSection />
        <LinksSection />
        <CTASection />
        <ContactSection />
        <RegionalPlansFilter />
        <PlanNotificationsWidget />
      </main>
      <Footer />
    </div>
  );
}
