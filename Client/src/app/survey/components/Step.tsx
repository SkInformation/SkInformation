import Grid from "@mui/material/Unstable_Grid2";

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
                        <Grid container justifyContent={"center"}>
                            <h1>{title}</h1>
                        </Grid>
                        {children}
                    </> :
                    <></>
            }
        </>
    );
}