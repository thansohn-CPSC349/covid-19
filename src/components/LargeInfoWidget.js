import React, {useState} from "react";
import {Card, CardContent, Tooltip, withStyles} from '@material-ui/core/';

import CasesOverTimeGraph from "./CasesOverTimeGraph";
import CasesByCountyTable from "./CasesByCountyTable";

import {json} from 'd3-fetch';

const LineGraphTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      maxWidth: 800,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}))(Tooltip);

const DataGridTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      maxWidth: 600,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}))(Tooltip);

function getRatio(min, max) {
    return ((min / max) * 100).toFixed(2);
}

function getProjectedTotal(cases, deaths) {
    let predicted_cases = cases * 10;
    let predicted_deaths = deaths * 1000;

    return `${Math.min(predicted_cases, predicted_deaths).toLocaleString()} - ${Math.max(predicted_cases, predicted_deaths).toLocaleString()}`
}

const LargeInfoWidget = ({USAState, nationalData}) => {
    const [data, setData] = useState([]);
    const [oldUSAState, setOldUSAState] = useState("");

    if (!USAState) {
        return (
            <Card variant="outlined">
                <CardContent>
                    Click a state for more information.
                </CardContent>
            </Card>
        );
    }
    
    if (USAState !== oldUSAState) {
        json(`https://disease.sh/v3/covid-19/states/${USAState}?yesterday=true&allowNull=false`).then(function (covidData) {
            setData(covidData);
        });

        setOldUSAState(USAState);
    }

    return (
        <> 
            <Card variant="outlined">
                <CardContent style={{fontSize:"14px", textAlign:"left"}}>
                    <div style={{fontSize:"20px",fontWeight:"bold"}}><u>{USAState}</u></div><br/>
                    Population: {data.population ? data.population.toLocaleString() : ""}
                    <br/><br/>
                    Total Confirmed Cases: {data.cases ? data.cases.toLocaleString() : "0"}<br />
                    Today's Cases: +{data.todayCases ? data.todayCases.toLocaleString() : "0"}<br/>
                    ({getRatio(data.cases, nationalData.cases)}% of National Cases)<br />
                    ({getRatio(data.cases, data.population)}% of {USAState} Population)<br /><br />
                    Total Confirmed Deaths: {data.deaths ? data.deaths.toLocaleString() : "0"}<br />
                    Today's Deaths: +{data.todayDeaths ? data.todayDeaths.toLocaleString() : "0"}<br/>
                    ({getRatio(data.deaths, nationalData.deaths)}% of National Deaths)<br />
                    ({getRatio(data.deaths, data.population)}% of {USAState} Population)<br /><br />
                    Recovered: {data.recovered ? data.recovered.toLocaleString() : "0"}<br />
                    Today's Recoveries: +{data.todayRecovered ? data.todayRecovered.toLocaleString() : "0"}<br />
                    ({getRatio(data.recovered, nationalData.recovered)}% of National Recoveries)<br />
                    (Estimated Recovery Rate: {getRatio(data.recovered, data.cases)}%)<br /><br />
                    Tested: {data.tests ? data.tests.toLocaleString() : "0"}<br />
                    ({getRatio(data.tests, data.population)}% of State Pop.)<br />
                    <br />
                    Predicted Active Cases: {getProjectedTotal(data.cases, data.deaths)}
                    <br /><br />
                    <DataGridTooltip
                        title={
                        <React.Fragment>
                            <CasesByCountyTable USAState={USAState} />
                        </React.Fragment>
                        }
                        placement="bottom" arrow interactive>
                            <u>TABLE: COVID-19 Cases seperated by {USAState} counties.</u>
                    </DataGridTooltip><br/><br />
    
                    <LineGraphTooltip
                        title={
                        <React.Fragment>
                            <CasesOverTimeGraph USAState={USAState} />
                        </React.Fragment>
                        }
                        placement="bottom" arrow interactive>
                            <u>GRAPH: Confirmed {USAState} COVID-19 cases over time.</u>
                    </LineGraphTooltip>
                </CardContent>
            </Card>
        </>
    );
}

export default LargeInfoWidget;
