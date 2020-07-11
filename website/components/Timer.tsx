import React from 'react'
import Countdown, { zeroPad } from 'react-countdown';
import {
    Typography,
    CardContent,
    CardHeader,
    Card
} from "@material-ui/core";

export default function Timer(props) {
    console.log(props)
    const renderer = ({ days, hours, minutes, seconds }) => {

        return (
            <span>
                <Card style={{
                    marginBottom: 30
                }}>
                    <CardHeader
                        style={{ textAlign: "center" }}
                        title={props.message}>

                    </CardHeader>
                    <CardContent>
                        <Typography style={{ textAlign: "center" }}>
                            <h1>
                                {zeroPad(days, 3)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
                            </h1>
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
