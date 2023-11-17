import {useEffect} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {SkinGoal, useSurvey} from "@/app/context/SurveyContext";
import {Button} from "@mui/material";

export default function SkinGoals() {
    const {skinGoals, setSkinGoals} = useSurvey()

    useEffect(() => {
        console.log(skinGoals)
    }, [skinGoals])

    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // Access the name attribute of the clicked button
        const buttonName = (event.target as HTMLButtonElement).name;
        const goal = SkinGoal[buttonName as keyof typeof SkinGoal]

        console.log({buttonName, goal})

        setSkinGoals([...skinGoals, goal])
    }

    return (
        <>
            <Grid container spacing={{xs: 2, sm: 3}} columns={{xs: 2, sm: 3}} disableEqualOverflow
                  justifyContent={"space-evenly"}>
                {
                    Object.keys(SkinGoal).filter(key => isNaN(Number(key))).map(goal => {
                        return (
                            <Grid key={goal} display="flex" xs={1}>
                                <Button name={goal} onClick={handleClick}>{goal}</Button>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    );
}
