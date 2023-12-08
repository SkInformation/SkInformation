import Grid from "@mui/material/Unstable_Grid2";
import {getSkinGoalName, SkinGoal, useSurvey} from "@/app/context/SurveyContext";
import {Button, Typography} from "@mui/material";
import styles from "@/app/survey/page.module.css";
import {getSkinGoalImageSrc} from "@/app/survey/components/helper";

export default function SkinGoals() {
    const {skinGoals, setSkinGoals} = useSurvey()

    function handleClick(selectedGoal: string) {
        // Access the name attribute of the clicked button
        const goal = SkinGoal[selectedGoal as keyof typeof SkinGoal]

        if (skinGoals.includes(goal)) {
            setSkinGoals(skinGoals.filter(x => x !== goal))
        } else {
            setSkinGoals([...skinGoals, goal])
        }
    }

    return (
        <>
            <Grid display="flex" xs={12}>
                <Typography variant="body1">
                    In order to best help you, please select all of the goals that you have in mind for improving your
                    skin care routine!
                </Typography>
            </Grid>
            <Grid container spacing={{xs: 2, sm: 3}} columns={{xs: 2, sm: 3}} disableEqualOverflow
                  justifyContent={"space-evenly"} className={styles.survey}>
                {
                    Object.keys(SkinGoal).filter(key => isNaN(Number(key))).map(goal => {
                        const goalName = getSkinGoalName(SkinGoal[goal as keyof typeof SkinGoal])
                        return (
                            <Grid key={goal} display="flex" xs={1}>
                                <Button name={goal} onClick={() => handleClick(goal)}
                                        className={`
                                        ${styles.survey_big_button}
                                        ${skinGoals.includes(SkinGoal[goal as keyof typeof SkinGoal]) ? styles.selected : ""}
                                    `}
                                >
                                    <div className={`${styles.imageContainer}`}>
                                        <img src={getSkinGoalImageSrc(SkinGoal[goal as keyof typeof SkinGoal])}
                                             alt={`${goalName} skin goal button image`}
                                             style={{width: '100%', height: 'auto'}}/>
                                        <Typography className={`${styles.overlayText}`}>{goalName}</Typography>
                                    </div>
                                </Button>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    );
}
