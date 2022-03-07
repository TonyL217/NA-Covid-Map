import React, { useEffect, useState } from 'react';
import { CovidMap, Loading, Legend } from './components/'
import { loadData, getRanges, colorMap } from './data/FormatData';
import './styles.css'

const Covid19 = () => {
  const [covidGeo, setCovidGeo] = useState([]);
  const [styles, setStyles] = useState({});

  const loadGeo = () => {
    loadData(setCovidGeo, setStyles)
  }

  const loadRanges = () => {
    getRanges(setStyles, styles, covidGeo)
  }

  useEffect(loadGeo, [])
  useEffect(loadRanges, [covidGeo])

  //TODO ADD RANGE
  return (
    <div id='app'>
      <div id="data-grid">
      </div>
      <div id="map-container">
        {covidGeo.length ? <CovidMap covidGeoJSON={covidGeo} styles={styles} /> : <Loading />}
        {styles.hasOwnProperty('ranges') ? <Legend covidGeoJSON={covidGeo} styles={styles} /> : <Loading />}
      </div>
    </div>
  )
}

export default Covid19