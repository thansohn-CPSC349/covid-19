import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { json } from "d3-fetch";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const colorScale = scaleQuantize()
  .domain([0, 1700000])
  .range([
    "#FFA9A1",
    "#FF968F",
    "#FF837D",
    "#FF706B",
    "#FF5E5A",
    "#FF4B48",
    "#FF3836",
    "#FF2524",
    "#FF1312"
  ]);


const PROJECTION_CONFIG = {
    scale: 650,
};

const MapChart = ( {setSelectedState} ) => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  
  if (data.length === 0) {
    json("https://disease.sh/v3/covid-19/states?sort=cases&yesterday=true&").then(function (covidData) {
        let sortedData = [];

        for (let entry of covidData) {
          sortedData.push(entry);
        }

        setData(sortedData);
    });
  }
  return (
    <>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <ComposableMap data-tip="" projectionConfig={PROJECTION_CONFIG} width={660} height={300} projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const cur = data.find((s) => s.state.toUpperCase() === geo.properties.name.toUpperCase());
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.cases : "#000")}
                  onMouseEnter={ () => {setTooltipContent(
                  <>
                    <b><u>{geo.properties.name}</u></b><br />
                    Cases: {cur.cases.toLocaleString()}<br />
                    Deaths: {cur.deaths.toLocaleString()}<br />
                    Recovered: {cur.recovered.toLocaleString()}<br />
                  </>);}}
                  onMouseLeave={ () => {setTooltipContent(""); }}
                  onClick={() => {setSelectedState(geo.properties.name)}}
                  style={{
                    default: {
                      outline: "none"
                    },
                    hover: {
                      cursor: "pointer",
                      outline: "none"
                    },
                    pressed: {
                      outline: "none"
                    }}}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </>
  );
};

export default MapChart;
