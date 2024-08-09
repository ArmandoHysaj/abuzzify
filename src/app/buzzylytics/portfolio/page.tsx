"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Portfolio from "../portfolio/portfolio";

const PortfolioPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only on the client-side
      if (!session && status !== "loading") {
        router.push("/auth/signin");
      } else {
        setLoading(false);
      }
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Return null while redirecting
  }

  return <Portfolio session={session} />;
};

export default PortfolioPage;
