import Box from "@mui/material/Box";

interface StepProps {
    children: React.ReactNode;
    hidden: boolean;
}

export function Step({
    children,
    hidden = false,
}: StepProps) {
    return (
        !hidden ?
            <>
                <Box>
                    This is a quiz
                    {children}
                </Box>
            </> :
            <></>
    );
}