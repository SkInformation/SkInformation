import Grid from "@mui/material/Unstable_Grid2";
import {SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button, Tooltip, Typography} from "@mui/material";
import styles from '@/app/survey/page.module.css'
import {getSkinTypeImageSrc, skinTypeDescriptions} from "@/app/survey/components/helper";

export default function SkinTypes() {
    const {skinType, setSkinType} = useSurvey()

    function handleClick(selectedType: SkinType) {

        setSkinType(skinType === selectedType ? undefined : selectedType);
    }

    return (
        <>
            <Grid id="skintype" display="flex" className={styles.survey}>
                <Grid container spacing={{xs: 1, md: 2}} columns={{xs: 1, sm: 2}} disableEqualOverflow
                      justifyContent={"space-evenly"}>
                    {
                        Object.keys(SkinType).filter(key => isNaN(Number(key))).map(typeName => {
                            const type = SkinType[typeName as keyof typeof SkinType]
                            return (
                                <Grid key={type} display="flex" xs={1}>
                                    <Tooltip title={skinTypeDescriptions[type]}>
                                        <Button aria-label={`Select ${typeName} skin type`}
                                                name={typeName} onClick={() => handleClick(type)}
                                                className={`
                                                ${styles.survey_big_button} 
                                                ${skinType === type ? styles.selected : ""}
                                            `}
                                        >
                                            <div className={`${styles.imageContainer}`}>
                                                <img src={getSkinTypeImageSrc(type)}
                                                     alt={`${type} skin button image`}
                                                     style={{width: '100%', height: 'auto'}}/>
                                                <Typography
                                                    className={`${styles.overlayText}`}>{typeName.toUpperCase()}</Typography>
                                            </div>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </>
    );
}
