import Grid from "@mui/material/Unstable_Grid2";
import {SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button, Container, Typography} from "@mui/material";
import styles from '@/app/survey/page.module.css'
import {getSkinTypeImageSrc} from "@/app/survey/components/helper";

export default function SkinTypes() {
    const {skinType, setSkinType} = useSurvey()

    function handleClick(selectedType: string) {
        const type = SkinType[selectedType as keyof typeof SkinType]

        setSkinType(skinType === type ? undefined : type);
    }

    return (
        <>
            <Container>
                <Grid container spacing={{xs: 1, sm: 2}} columns={{xs: 1, sm: 2}} disableEqualOverflow
                      justifyContent={"space-evenly"} className={styles.survey}>
                    {
                        Object.keys(SkinType).filter(key => isNaN(Number(key))).map(type => {
                            return (
                                <Grid key={type} display="flex" xs={1}>
                                    <Button aria-label={`Select ${type} skin type`}
                                            name={type} onClick={() => handleClick(type)}
                                            className={`
                                            ${styles.survey_big_button} 
                                            ${skinType === SkinType[type as keyof typeof SkinType] ? styles.selected : ""}
                                        `}
                                    >
                                        <div className={`${styles.imageContainer}`}>
                                            <img src={getSkinTypeImageSrc(SkinType[type as keyof typeof SkinType])}
                                                 alt={`${type} skin button image`}
                                                 style={{width: '100%', height: 'auto'}}/>
                                            <Typography
                                                className={`${styles.overlayText}`}>{type.toUpperCase()}</Typography>
                                        </div>
                                    </Button>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </>
    );
}
