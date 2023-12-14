import {SkinGoal, SkinType, SurveyStep, useSurvey} from "@/app/context/SurveyContext";
import {Button, Chip, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import url from "url";
import apiRequest, {HttpMethod} from "@/app/lib/api";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import Image from 'next/image'
import {useRouter} from 'next/navigation';

import {
    getSkinGoalReadableName,
    getSkinTypeReadableName,
    skinGoalDescriptions,
    skinTypeDescriptions
} from "@/app/survey/components/helper";

interface GenerateReportInput {
    email: string
    skinType: SkinType
    skinGoals: SkinGoal[]
    products: {
        productId: number
        reactions: number[]
    }[]
}

export default function Summary() {
    const {skinType, skinGoals, products, navigateTo, clearContext} = useSurvey();

    const [email, setEmail] = useState("")
    const [emailValidationError, setEmailValidationError] = useState("")
    const [reportSent, setReportSent] = useState(false)

    const router = useRouter();


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
            email,
            skinType: skinType!,
            skinGoals: skinGoals,
            products: mappedProducts
        }

        type GenerateResponse = {
            id: number
        }

        try {
            const {id} = await apiRequest<GenerateResponse>(HttpMethod.POST, '/Report/Generate', {}, body)
            router.push(`/report/${id}`)

            setReportSent(true)
        } catch (err) {
            // render err
        } finally {
            clearContext()
        }
    }

    return (
        <Grid container disableEqualOverflow margin={"1em"}>
            <Grid display="flex" xs={12} alignItems="center">
                <Stack direction="column">
                    <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <Typography variant="h4" component="div">
                                Skin Type
                            </Typography>
                        </Grid>
                        <Grid>
                            <Chip onClick={() => navigateTo(SurveyStep.SkinType)} label="Edit"/>
                        </Grid>
                    </Stack>
                    <Stack spacing={4} direction="row" alignItems="center" paddingLeft={"2em"}>
                        <Grid display={"flex"} xs={3}>
                            <Typography id="selectedSkinType" fontWeight="bold" fontSize={"1.2em"}>
                                {getSkinTypeReadableName(skinType!)}
                            </Typography>
                        </Grid>
                        <Grid display={"flex"} xs={9}>
                            <Typography>
                                {skinTypeDescriptions[skinType!]}
                            </Typography>
                        </Grid>
                    </Stack>
                </Stack>
            </Grid>
            <Grid display="flex" xs={12} alignItems="center">
                <Stack direction="column">
                    <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <Typography variant="h4" component="div">
                                Skin Goals
                            </Typography>
                        </Grid>
                        <Grid>
                            <Chip onClick={() => navigateTo(SurveyStep.SkinType)} label="Edit"/>
                        </Grid>
                    </Stack>
                    {skinGoals.map((goal) => (
                        <Stack spacing={4} direction="row" alignItems="center" paddingLeft={"2em"} key={goal}>
                            <Grid display={"flex"} xs={3}>
                                <Typography id="selectedSkinType" fontWeight="bold" fontSize={"1.2em"}>
                                    {getSkinGoalReadableName(goal)}
                                </Typography>
                            </Grid>
                            <Grid display={"flex"} xs={9}>
                                <Typography>
                                    {skinGoalDescriptions[goal!]}
                                </Typography>
                            </Grid>
                        </Stack>
                    ))}
                </Stack>
            </Grid>
            <Grid display="flex" xs={12} paddingTop={"1em"}>
                <Stack direction="column">
                    <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                        <Grid>
                            <Typography variant="h4" component="div">
                                Products
                            </Typography>
                        </Grid>
                        <Grid>
                            <Chip onClick={() => navigateTo(SurveyStep.SkinType)} label="Edit"/>
                        </Grid>
                    </Stack>
                    {Object.values(products).map((product) => {
                        const thumbnailUrl = url.resolve(process.env.NEXT_PUBLIC_API_URL ?? '', product.thumbnail)

                        return (
                            <Stack key={product.id} direction="row" spacing={2} justifyContent="center"
                                   alignItems={"center"}>
                                <Grid display="flex" xs={"auto"}>
                                    <a href={thumbnailUrl} target="_blank">
                                        <Image
                                            width={150}
                                            height={150}
                                            src={thumbnailUrl}
                                            alt={product.description}/>
                                    </a>
                                </Grid>
                                <Grid display="flex" xs={9}>
                                    <Typography variant={"h5"}>
                                        {product.name}
                                    </Typography>
                                </Grid>
                            </Stack>
                        )
                    })}
                </Stack>
            </Grid>
            <Grid display="flex" xs={8} xsOffset={2} justifyContent="center" paddingTop={"1em"}>
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
            <Grid display="flex" xs={12} justifyContent="center" paddingTop={"1em"}>
                <Button onClick={() => submitSurvey()} disabled={reportSent} variant={"contained"}>
                    <Typography
                        className="MuiTypography-alignMiddle">
                        {reportSent ? "Generating..." : "Generate Report!"}
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
};
