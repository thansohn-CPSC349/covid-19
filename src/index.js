import React, { useState }from "react";
import ReactDOM from "react-dom";

import {AppBar, Toolbar, Typography} from '@material-ui/core';

import MapChart from "./components/MapChart";
import SmallInfoWidget from "./components/SmallInfoWidget";
import LargeInfoWidget from "./components/LargeInfoWidget";

import {json} from 'd3-fetch';

import "./styles.css";

function App() {
  const [usState, setUsState] = useState("");
  const [data, setData] = useState("");

  if (data.length === 0) {
    json("https://disease.sh/v3/covid-19/countries/USA?yesterday=true&strict=true&allowNull=false").then(function (covidData) {
        setData(covidData);
    });
  }

  let cases = data.cases ? data.cases.toLocaleString() : "";
  let deaths = data.deaths ? data.deaths.toLocaleString(): "";
  let recovered = data.recovered ? data.recovered.toLocaleString(): "";
  let critical = data.critical ? data.critical.toLocaleString(): "";
  let percent_survived = ((data.recovered / data.cases) * 100).toFixed(1) + "%";

  return (
    <>
      <AppBar position="static" style={{ background: '#4d4d4d' }}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            COVID-19 Data for United States - {new Date().toLocaleDateString()}
          </Typography>
        </Toolbar>
      </AppBar>
      <br/>
      <div className="info-container" align="center">
        <div className="info-div1">
          <SmallInfoWidget 
          topText={cases}
          topColor="#FF8C00"
          bottomText="Total Confirmed COVID-19 Cases in the USA"
          bottomColor="#000000"
          />
        </div>    
        <div className="info-div2">
          <SmallInfoWidget 
          topText={deaths}
          topColor="#B22222"
          bottomText="Total Confirmed COVID-19 Deaths in the USA"
          bottomColor="#000000"
          />
        </div>
        <div className="info-div3">
          <SmallInfoWidget 
          topText={recovered}
          topColor="#6495ED"
          bottomText="Total COVID-19 Victims Who Recovered"
          bottomColor="#000000"
          />
        </div> 
        <div className="info-div4">
          <SmallInfoWidget 
          topText={critical}
          topColor="#FF4500"
          bottomText="Total COVID-19 Victims In Critical Condition"
          bottomColor="#000000"
          />
        </div> 
        <div className="info-div5">
          <SmallInfoWidget 
          topText={percent_survived}
          topColor="#32CD32"
          bottomText="Estimated US Recovery Rate"
          bottomColor="#000000"
          />
        </div> 
      </div><br/>
      <div className="map-container">
        <div className="map-div">
          <MapChart 
            setSelectedState={setUsState}
          />
        </div>
        <div className="large-info-div">
          <LargeInfoWidget USAState={usState} nationalData={{ cases: data.cases, deaths: data.deaths, recovered: data.recovered}} />
        </div>
      </div>
      <div className="footer">
        <div className="footer-div">
            <p>
              - By Tyler Hansohn - Data source used: <a href="http://disease.sh/">disease.sh</a> - Libraries used: bizCharts, d3, material-table, 
              Material-UI, React.JS, react-simple-maps, react-tooltip - Data may take a few seconds to load -
            </p>
        </div>
      </div>
   </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
