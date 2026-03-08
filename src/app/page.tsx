import Hero from "@/component/hero";
import Features from "@/component/Feature";
import FeaturedArticle from "@/component/Featuredarticle";
import StatsRibbon from "@/component/Ribbon";
export default function Home() {
  return (
    <>
      <Hero />
       <FeaturedArticle />
       <StatsRibbon />
      <Features />
      
      {/* You can add more sections like 'Features' or 'About' here later */}
    </>
  );
}