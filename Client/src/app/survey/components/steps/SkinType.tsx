import Grid from "@mui/material/Unstable_Grid2";
import {SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button} from "@mui/material";
import styles from '@/app/survey/page.module.css'

export default function SkinTypes() {
    const {skinType, setSkinType} = useSurvey()

    function handleClick(selectedType: string) {
        const type = SkinType[selectedType as keyof typeof SkinType]
        console.log({skinType, selectedType})

        setSkinType(skinType === type ? undefined : type);
    }

    return (
        <>
            <Grid container spacing={{xs: 1, sm: 2}} columns={{xs: 1, sm: 2}} disableEqualOverflow
                  justifyContent={"space-evenly"} className={styles.survey}>
                {
                    Object.keys(SkinType).filter(key => isNaN(Number(key))).map(type => {
                        console.log(styles)
                        return (
                            <Grid key={type} display="flex" xs={1}>
                                <Button name={type} onClick={() => handleClick(type)}
                                        className={`${styles.survey_big_button} ${
                                            skinType === SkinType[type as keyof typeof SkinType] ? styles.selected : ""
                                        } ${styles[type.toLowerCase()]}`}>
                                    <span>{type}</span>
                                </Button>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    );
}
