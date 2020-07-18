import React from 'react'
import Countdown, { zeroPad } from 'react-countdown';
import {
    Typography,
    CardContent,
    Card
} from "@material-ui/core";

export default function Timer(props) {
    console.log(props)
    const renderer = ({ days, hours, minutes, seconds }) => {

        return (
            <span>
                <Card style={{ padding: "0px", margin: "0 auto" }}>

                    <CardContent>
                        <Typography style={{ textAlign: "center", margin: "0 auto", padding: "0", textTransform: "uppercase" }}>
                            <h4>
                                This contest ends in : {zeroPad(days, 3)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
                            </h4>
                        </Typography>
                    </CardContent>
                </Card>
            </span>)

    };



    return (

        <Countdown
            date={new Date(props.time)}
            intervalDelay={1}
            renderer={renderer}
        />
    )

}
