"use client";

import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Portfolio from "../portfolio/portfolio";

const PortfolioPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/signin");
      } else {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  if (loading || status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Return null while redirecting
  }

  return <Portfolio session={session} />;
};

export default PortfolioPage;
