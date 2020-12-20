import React, { useState } from "react";
import {json}  from "d3-fetch";
import MaterialTable from "material-table"

const DATA_SOURCE = "https://disease.sh/v3/covid-19/historical/usacounties/state?lastdays=1";

function formatData(countyData) {
    const formattedData = [];
    let id = 0;

    for (let c of countyData) {   
        if (c.county.startsWith("out of") === false && c.county !== 'unassigned') {
            formattedData.push({
                id: id,
                county_name: c.county.charAt(0).toUpperCase() + c.county.slice(1),
                cases: Object.values(c.timeline.cases)[0],
                deaths: Object.values(c.timeline.deaths)[0],
            });
            id++;
        }
    }

    return formattedData;
}

const CaseByCountyTable = ({ USAState }) => {
    const [data, setData] = useState([]);
    let formattedData;

    if (!USAState) {
        return null;
    }

    if (data.length === 0) {
        json(DATA_SOURCE.replace("state", USAState.toLowerCase())).then(function (covidData) {
            let sortedData = [];

            for (let entry of covidData) {
                sortedData.push(entry);
            }

            setData(sortedData);
        });
    }

    formattedData = formatData(data);

    return (
      <MaterialTable
        options={{
        rowStyle: {
          fontSize:14,
        },
        headerStyle: {
          fontSize:16,
        }}}
        columns={[
            { title: 'County', field: 'county_name' },
            { title: 'Cases', field: 'cases', type: 'numeric' },
            { title: 'Deaths', field: 'deaths', type: 'numeric' },
        ]}
        data={formattedData}
        title=""
    />
    );
}

export default CaseByCountyTable;