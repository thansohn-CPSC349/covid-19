import React, {useState} from "react";
import { Chart, Axis, LineAdvance } from 'bizcharts';

import {json} from 'd3-fetch';

let chartScale = {
  date: {
    alias:"Date"
  },
  cases: {
    alias:"Confirmed COVID-19 Cases"
  }
} 
  
function formatData(data) {
  let formattedData = [];
  let newDate;

  for (let entry of data) {
    newDate = new Date(entry.date);

    if (newDate.getDay() === 1) {
      formattedData.push({cases: entry.cases, date: entry.date});
    }
  }

  return formattedData;  
}

const CasesOverTimeGraph = ({USAState}) => {
  const [data, setData] = useState([]);
  
  if (!USAState) {
    return null;
  }
  
  if (data.length === 0) {
    json(`https://disease.sh/v3/covid-19/nyt/states/${USAState}?lastdays=all`).then(function (covidData) {
      let sortedData = [];

      for (let entry of covidData) {
        sortedData.push(entry);
      }

      setData(formatData(sortedData));
    });

    console.log(data);
  }

  return (
      <Chart padding="auto"
      autoFit
      height={300}
      width={800}
      data={data}
      scale={chartScale}>
        <LineAdvance position="date*cases" />
        <Axis name="cases" title />
        <Axis name="date" title />
      </Chart>
  )
}


export default CasesOverTimeGraph;
