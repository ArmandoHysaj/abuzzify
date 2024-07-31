"use client";

import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Portfolio from "../portfolio/portfolio";

const PortfolioPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/signin");
      }
    };

    fetchSession();
  }, [router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Return null while redirecting
  }

  return <Portfolio session={session} />;
};

export default PortfolioPage;
