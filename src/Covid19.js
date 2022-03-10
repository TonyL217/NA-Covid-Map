import React, { useEffect, useState } from 'react';
import { CovidDataGrid, CovidMap, Loading, Legend } from './components/'
import { loadGeoData, loadStatsData } from './data/FormatData';
import './styles.css'

const Covid19 = () => {
  const [covidGeo, setCovidGeo] = useState([]);
  const [stats, setStats] = useState({});
  const colors = ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];


  const loadGeo = () => {
    loadGeoData(setCovidGeo).then((geoData) => {
      setCovidGeo(geoData);
    })
  }

  const loadStats = () => {
    if (covidGeo.length) {
      setStats(loadStatsData(covidGeo))
    }
  }

  useEffect(loadGeo, [])
  useEffect(loadStats, [covidGeo])

  //TODO ADD RANGE
  return (
    <div id='app'>
      {stats.hasOwnProperty('ranges') ? <CovidDataGrid covidGeoJSON={covidGeo} colors={colors} stats={stats} /> : <Loading/>}
      <div id="map-container">
        {stats.hasOwnProperty('ranges') ? <CovidMap covidGeoJSON={covidGeo} colors={colors} stats={stats} /> : <Loading />}
        {stats.hasOwnProperty('ranges') ? <Legend covidGeoJSON={covidGeo} colors={colors} stats={stats} /> : <Loading />}
      </div>
    </div>
  )
}

export default Covid19