import React, { useEffect, useState } from 'react';
import { CovidDataGrid, CovidMap, Loading, Legend } from './components/'
import { loadGeoData, loadStatsData } from './data/FormatData';
import MenuIcon from '@mui/icons-material/Menu';

import './styles.css'

const Covid19 = () => {
  const colors = ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
  const [covidGeo, setCovidGeo] = useState([]);
  const [stats, setStats] = useState({});
  const [open, setOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 1000);
  const [gridClass, setGridClass] = useState('');

  //load geoJSON file that contains the coordinates of the borders of different regions
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


  const smallScreenDetection = () => {
    function smallScreenListener() {
      if (window.innerWidth < 1000) {
        setSmallScreen(true)
      }
      else {
        setSmallScreen(false);
      }
    }
    window.addEventListener('resize', smallScreenListener)
    return () => {
      window.removeEventListener('resize', smallScreenListener)
    }
  }

  useEffect(loadGeo, [])
  useEffect(loadStats, [covidGeo])
  useEffect(() => {
    return smallScreenDetection();
  }, [stats])
  useEffect(() => {
    let classes = ''
    if (smallScreen) {
      if (open) {
        classes += ' openGrid'
      } else {
        classes += ' hideGrid'
      }
    } else {
      classes += 'default'
    }
    setGridClass(classes)
  }
    , [smallScreen, open])

  //TODO ADD RANGE
  return (
    <div className='app'>
      <div className={gridClass}>
        {stats.hasOwnProperty('ranges') ? <CovidDataGrid covidGeoJSON={covidGeo} colors={colors} stats={stats} smallScreen={smallScreen} open={open} /> : <Loading />}
      </div>
      <div className="mapContainer">
        {smallScreen && <MenuIcon
          sx={{
            width:{
              xs:'2.5rem',
              sm:'3.5rem'

            },
            height:{
              xs:'2.5rem',
              sm:'3.5rem'
            },
            backgroundColor: 'white',
            position: 'absolute',
            color: 'red',
            zIndex: 3000,
            mt: '2rem',
            ml: '2rem',
            borderRadius: '0.35rem'
          }}
          onClick={(e) => setOpen(!open)}
        />}
        {stats.hasOwnProperty('ranges') ? <CovidMap covidGeoJSON={covidGeo} colors={colors} stats={stats} smallScreen={smallScreen} /> : <Loading />}
        {stats.hasOwnProperty('ranges') ? <Legend covidGeoJSON={covidGeo} colors={colors} stats={stats} smallScreen={smallScreen} /> : <Loading />}
      </div>
    </div>
  )
}

export default Covid19