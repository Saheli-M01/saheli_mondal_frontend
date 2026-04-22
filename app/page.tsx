import HomeHero from "@/components/home/HomeHero";
import LiveSection from "@/components/home/LiveSection";
import SkillsSection from "@/components/home/SkillsSection";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <SkillsSection />
      <LiveSection />
    </main>
  );
}
