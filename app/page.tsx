"use client";

import HomeHero from "@/components/home/HomeHero";
import LiveSection from "@/components/home/LiveSection";
import GitHubActivitySection from "@/components/home/GitHubActivitySection";
import SkillsSection from "@/components/home/SkillsSection";
import MotivationSection from "@/components/home/MotivationSection";
import FaqSection from "@/components/home/FaqSection";
import { useViewMode } from "@/context/ViewModeContext";

export default function Home() {
  const { viewMode } = useViewMode();
  const isRecruiterView = viewMode === "recruiter";

  return (
    <main>
      <HomeHero />
      <SkillsSection />
      <LiveSection />
      <GitHubActivitySection username="Saheli-M01" />
      {!isRecruiterView && <MotivationSection />}
      {!isRecruiterView && <FaqSection />}
    </main>
  );
}
