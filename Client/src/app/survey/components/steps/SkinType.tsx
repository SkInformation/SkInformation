import {useEffect} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button, ButtonGroup} from "@mui/material";
import ButtonBase from '@mui/material/ButtonBase';
import styles from '@/app/page.module.css'

export default function SkinTypes() {
    const {skinType, setSkinType} = useSurvey()


    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        // Access the name attribute of the clicked button
        const button = (event.target as HTMLButtonElement);
        const buttonName = button.name;
        const type = SkinType[buttonName as keyof typeof SkinType]
        setSkinType(type);
    }

    return (
        <>
            <Grid container spacing={{xs: 1, sm: 2}} columns={{xs: 1, sm: 2}} disableEqualOverflow
                  justifyContent={"space-evenly"} className={styles.survey}>

                {
                    Object.keys(SkinType).filter(key => isNaN(Number(key))).map(type => {
                        return (
                            <Grid key={type} display="flex" xs={1}>
                                <Button name={type} onClick={handleClick}
                                        className={styles.survey_big_button + " " + type.toLowerCase()}>
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
