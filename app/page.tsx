import HomeHero from "@/components/home/HomeHero";
import LiveSection from "@/components/home/LiveSection";
import SkillsSection from "@/components/home/SkillsSection";
import MotivationSection from "@/components/home/MotivationSection";
import FaqSection from "@/components/home/FaqSection";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <SkillsSection />
      <LiveSection />
      <MotivationSection />
      <FaqSection />
    </main>
  );
}
