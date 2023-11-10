import Image from 'next/image'
import styles from './page.module.css'
import Survey from "@/app/survey/Survey";

export default function Home() {
  return (
    <main className={styles.main}>
      <Survey />
    </main>
  )
}
