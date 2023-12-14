import Grid from "@mui/material/Unstable_Grid2";
import styles from '@/app/survey/page.module.css'

interface StepProps {
    children: React.ReactNode;
    hidden: boolean;
    title: string;
}

export function Step({
    children,
    hidden = false,
    title
}: StepProps) {
    return (
        <>
            {
                !hidden ?
                    <>
                        <Grid container justifyContent={"center"} sx={{textAlign: 'center'}}>
                            <h1 className={styles.stepHeader}>{title}</h1>
                        </Grid>
                        {children}
                    </> :
                    <></>
            }
        </>
    );
}