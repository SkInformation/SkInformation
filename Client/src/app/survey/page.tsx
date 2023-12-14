import Survey from "@/app/survey/Survey";
import styles from "@/app/survey/page.module.css"

export default function Home() {
    return (
        <main className={styles.main}>
            <Survey/>
        </main>
    )
}
