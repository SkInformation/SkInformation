import {SkinGoal, SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import url from "url";
import apiRequest, {HttpMethod} from "@/app/lib/api";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import Image from 'next/image'
import {getSkinTypeImageSrc, getSkinTypeReadableName} from "@/app/survey/components/helper";

interface GenerateReportInput {
    skinType: SkinType
    skinGoals: SkinGoal[]
    products: {
        productId: number
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

        const mappedProducts = Object.values(products).map(p => ({
            productId: p.id,
            reactions: p.reactions || []
        }))

        if (!email) {
            setEmailValidationError("Required: Invalid email")
            return
        }

        const body: GenerateReportInput = {
            skinType: skinType!,
            skinGoals: skinGoals,
            products: mappedProducts
        }

        try {
            await apiRequest(HttpMethod.POST, '/Report/Generate', {}, body)
            setReportSent(true)
        } catch (err) {
            // render err
        }
    }

    return (
        <>
            <Grid container disableEqualOverflow>
                <Grid display="flex" xs={12}>
                    <Typography variant="h5" gutterBottom component="div">
                        Skin Type
                    </Typography>
                </Grid>
                <Grid display="flex" xs={12}>
                    <Stack direction="row" spacing={1}>
                        <img src={getSkinTypeImageSrc(skinType!)}
                             alt={`${skinType} skin image`}
                             style={{minWidth: '75px', height: 'auto', maxWidth: '150px'}}/>
                        <Typography>
                            {getSkinTypeReadableName(skinType!)}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid display="flex" xs={12}>
                    <Typography variant="h5" gutterBottom component="div">
                        Skin Goals
                    </Typography>
                    <Stack direction="row" spacing={1}>
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
                <Grid display="flex" xs={12}>
                    <Typography variant="h5" gutterBottom component="div">
                        Products
                    </Typography>
                </Grid>
                <Grid display="flex" xs={12}>
                    {Object.values(products).map((product) => {
                        const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', product.thumbnail)

                        return (
                            <>
                                <Stack key={product.id} direction="row" spacing={1}>
                                    <a href={thumbnailUrl} target="_blank">
                                        <Image
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
                </Grid>
                <Grid display="flex" xs={12} justifyContent="center">
                    <TextField
                        type="email"
                        required
                        error={!!emailValidationError}
                        helperText={emailValidationError ? emailValidationError : null}
                        placeholder={"Email"}
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
