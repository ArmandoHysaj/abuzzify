import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header/header";
import Portfolio from "./components/portfolio/portfolio";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Portfolio />
      </main>
    </div>
  )
}
