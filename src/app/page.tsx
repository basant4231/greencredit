import Hero from "@/component/hero";
import AboutUs from "@/component/AboutUs";
import Features from "@/component/Feature";
import StatsRibbon from "@/component/Ribbon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user?.email);

  return (
    <>
      <Hero isLoggedIn={isLoggedIn} />
      <AboutUs />
      <StatsRibbon />
      <Features isLoggedIn={isLoggedIn} />
    </>
  );
}
