import { getSession } from "next-auth/react";
import Portfolio from "../portfolio/portfolio";

export default function PortfolioPage({ session }: { session: any }) {
  return <Portfolio session={session} />;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
