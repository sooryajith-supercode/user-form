import Image from "next/image";
import styles from "./page.module.css";
import RegisterPage from "./register/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <RegisterPage/>
      </main>
    </div>
  );
}
