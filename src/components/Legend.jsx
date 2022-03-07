import React from 'react'
import LegendItems from './LegendItems'
import './Legend.css'
import { Grid } from '@mui/material'


const Legend = ({ covidGeoJSON, styles}) => {
  return (
    <Grid container sx={{ height: '10%' }} alignItems="stretch" space={0}>
      <LegendItems range={styles.ranges[0]} bColor={styles.colors[0]} />
      <LegendItems range={styles.ranges[1]} bColor={styles.colors[1]} />
      <LegendItems range={styles.ranges[2]} bColor={styles.colors[2]} />
      <LegendItems range={styles.ranges[3]} bColor={styles.colors[3]} />
      <LegendItems range={styles.ranges[4]} bColor={styles.colors[4]} />
      <LegendItems range={styles.ranges[5]} bColor={styles.colors[5]} />
      <LegendItems range={styles.ranges[6]} bColor={styles.colors[6]} />
    </Grid>
  )
}

export default Legend