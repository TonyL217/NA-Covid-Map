import React from 'react'
import LegendItems from './LegendItems'
import './Legend.css'
import { Grid } from '@mui/material'


const Legend = ({ colors, stats }) => {
  return (
    <Grid container sx={{ height: '10%', flexWrap:'wrap' }} alignItems="stretch" space={0}>
      <LegendItems range={stats.ranges[0]} bColor={colors[0]} />
      <LegendItems range={stats.ranges[1]} bColor={colors[1]} />
      <LegendItems range={stats.ranges[2]} bColor={colors[2]} />
      <LegendItems range={stats.ranges[3]} bColor={colors[3]} />
      <LegendItems range={stats.ranges[4]} bColor={colors[4]} />
      <LegendItems range={stats.ranges[5]} bColor={colors[5]} />
      <LegendItems range={stats.ranges[6]} bColor={colors[6]} />
    </Grid>
  )
}

export default Legend