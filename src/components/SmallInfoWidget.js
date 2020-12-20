import React from "react";
import {Card, CardContent} from '@material-ui/core/';

const SmallInfoWidget = ({topColor, bottomColor, topText, bottomText}) => {
    return (
        <> 
            <Card variant="outlined">
                <CardContent>
                    <span style={{
                        color:topColor,
                        fontFace:"Verdana",
                        fontSize:"28px",
                        fontWeight:"bold",
                        textAlign:"center"
                    }}
                    >{topText}</span><br />
                    
                    <span style={{
                        color:bottomColor,
                        fontSize:"14px",
                        width:"160px",
                        textAlign:"center"
                    }}>{bottomText}</span>
                </CardContent>
            </Card>
        </>
    );
}

export default SmallInfoWidget;