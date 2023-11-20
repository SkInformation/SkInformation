import {useEffect} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {SkinType, useSurvey} from "@/app/context/SurveyContext";
import {Button} from "@mui/material";
import ButtonBase from '@mui/material/ButtonBase';
import styles from '@/app/page.module.css'

const images = [
    {
        url: 'assets/images/survey/skin_type/dry.jpg',
        title: 'Dry',
        width: '145px',
    },
    {
        url: 'assets/images/survey/skin_type/normal.jpg',
        title: 'Normal',
        width: '145px',
    },
    {
        url: 'assets/images/survey/skin_type/oily.jpg',
        title: 'Oily',
        width: '145px',
    },    {
        url: 'assets/images/survey/skin_type/combination.jpg',
        title: 'Combination',
        width: '145px%',
    },
];
export default function SkinTypes() {
    const {skinType, setSkinType} = useSurvey()

    useEffect(() => {
        console.log(SkinTypes)
    }, [SkinTypes])

    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // Access the name attribute of the clicked button
        const buttonName = (event.target as HTMLButtonElement).name;
        const type = SkinType[buttonName as keyof typeof SkinType]
        setSkinType([skinType, type])
    }

    return (
        <>
            <Grid container spacing={{xs: 2, sm: 3}} columns={{xs: 2, sm: 3}} disableEqualOverflow
                  justifyContent={"space-evenly"} className={styles.survey}>
                {
                    Object.keys(SkinType).filter(key => isNaN(Number(key))).map(type => {
                        return (
                            <Grid key={type} display="flex" xs={2}>
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
