import {SkinGoal, SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import url from "url";
import apiRequest, {HttpMethod} from "@/app/lib/api";
import TextField from "@mui/material/TextField";
import {useState} from "react";

interface GenerateReportInput {
    email: string
    skinType: SkinType
    skinGoals: SkinGoal[]
    products: {
        product: number
        reactions: number[]
    }[]
}

export default function Summary() {
    const {skinType, skinGoals, products, navigateTo} = useSurvey();

    const [email, setEmail] = useState("")
    const [emailValidationError, setEmailValidationError] = useState("")
    const [reportSent, setReportSent] = useState(false)

    const submitSurvey = async () => {
        setEmailValidationError("")

        const mappedProducts = products.map(p => ({
            product: p.id,
            reactions: []
        }))

        console.log("is this getting called?")

        if (!email) {
            setEmailValidationError("Required: Invalid email")
            return
        }

        const body: GenerateReportInput = {
            email: email.trim(),
            skinType: skinType!,
            skinGoals: skinGoals,
            products: mappedProducts
        }

        console.log(body)

        try {
            await apiRequest(HttpMethod.POST, '/Report/GenerateReport', {}, body)
            setReportSent(true)
        } catch (err) {
            // render err
        }
    }

    return (
        <>
            <Grid container alignContent={"space-evenly"} disableEqualOverflow>
                <Grid display="flex" xs={12}>
                    <Typography variant="h6" gutterBottom component="div">
                        Skin Type
                    </Typography>
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">

                    <Stack direction="row" spacing={1} alignItems="center"
                           textAlign="center">
                        <Typography
                            className="MuiTypography-alignMiddle">{skinType}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">
                    <Typography variant="h6" gutterBottom component="div">
                        Skin Goals
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" textAlign="center">
                        {skinGoals.map((goal) => (
                            <>
                                <Typography
                                    className="MuiTypography-alignMiddle">
                                    {goal}
                                </Typography>
                            </>
                        ))}
                    </Stack>
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">
                    <Typography variant="h6" gutterBottom component="div">
                        Products
                    </Typography>
                    <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
                        {products.map((product) => {
                            const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', product.thumbnail)

                            return (
                                <>
                                    <Stack direction="row" spacing={1} alignItems="center" textAlign="center">
                                        <a href={thumbnailUrl} target="_blank">
                                            <img
                                                width={75}
                                                height={75}
                                                src={thumbnailUrl}
                                                alt={product.description}/>
                                        </a>
                                        <Typography
                                            className="MuiTypography-alignMiddle">
                                            {product.name}
                                        </Typography>
                                    </Stack>
                                </>
                            )
                        })}
                    </Stack>
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">
                    <TextField
                        type="email"
                        required
                        error={!!emailValidationError}
                        helperText={emailValidationError ? emailValidationError : null}
                        placeholder={"Email"}
                        fullWidth
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">
                    <Button onClick={() => submitSurvey()} disabled={reportSent} variant={"contained"}>
                        <Typography
                            className="MuiTypography-alignMiddle">
                            Generate Report!
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};