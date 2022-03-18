import React from 'react'
import LegendItems from './LegendItems'
import { Grid } from '@mui/material'


const Legend = ({ colors, stats, smallScreen }) => {
  return (
    <Grid container className='legend'>
      <LegendItems smallScreen={smallScreen} range={stats.ranges[0]} bColor={colors[0]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[1]} bColor={colors[1]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[2]} bColor={colors[2]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[3]} bColor={colors[3]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[4]} bColor={colors[4]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[5]} bColor={colors[5]} />
      <LegendItems smallScreen={smallScreen} range={stats.ranges[6]} bColor={colors[6]} />
    </Grid>
  )
}

export default Legend