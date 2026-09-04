import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { SubjectMarquee } from '@/components/landing/SubjectMarquee';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Subjects } from '@/components/landing/Subjects';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTABanner } from '@/components/landing/CTABanner';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SubjectMarquee />
        <Features />
        <HowItWorks />
        <Subjects />
        <Testimonials />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}