import styles from './page.module.css'
import {Button, Typography} from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
        <Grid>
            <Grid display="flex" justifyContent="center">
                <Typography variant="h1">SkI</Typography>
            </Grid>
            <Grid display="flex" justifyContent="center">
                <Link href="/survey">
                    <Button component="a" variant="contained" color="primary">
                        Start Survey
                    </Button>
                </Link>
            </Grid>
        </Grid>
    </main>
  )
}




