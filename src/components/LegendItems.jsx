import { Grid, Typography } from '@mui/material'
import React from 'react'

const LegendItems = ({ range, bColor }) => {

  let from = range[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  let to = range[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (
    <Grid item container sx={
      {
        backgroundColor: bColor,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }
    }>
      <Typography fontSize="1rem" textAlign="center" variant="p">{`${from} - ${to}`}
        <br />
        Cases
      </Typography>
    </Grid>
  )
}

export default LegendItems