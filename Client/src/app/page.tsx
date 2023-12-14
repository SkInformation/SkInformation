// Import necessary modules
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import {Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Link from 'next/link';

// Wrap the component with dynamic to disable SSR
const NoSSRButton = dynamic(() => import('@mui/material/Button'), {
    ssr: false,
});

export default function Home() {
    return (
        <Grid className={styles.main}>
            <Grid display="flex" justifyContent="center">
                <Typography variant="h1" className={styles.title_logo}>SkI</Typography>
            </Grid>
            <Grid display="flex" justifyContent="center">
                <Link href="/survey">
                    {/* Use the NoSSRButton component instead of Button */}
                    <NoSSRButton variant="contained" color="primary">
                        Start Survey
                    </NoSSRButton>
                </Link>
            </Grid>
        </Grid>
    );
}