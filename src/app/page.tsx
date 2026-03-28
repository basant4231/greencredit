import Hero from "@/component/hero";
import Features from "@/component/Feature";
import FeaturedArticle from "@/component/Featuredarticle";
import StatsRibbon from "@/component/Ribbon";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return (
    <>
      <Hero isLoggedIn={isLoggedIn} />
      <FeaturedArticle />
      <StatsRibbon />
      <Features isLoggedIn={isLoggedIn} />
    </>
  );
}
