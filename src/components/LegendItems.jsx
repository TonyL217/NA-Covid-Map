import { Grid, Typography } from '@mui/material'
import React from 'react'

const LegendItems = ({ range, bColor, smallScreen }) => {

  let from = range[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  let to = range[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (
    <Grid item container sx={
      theme => (
        {
          backgroundColor: bColor,
          justifyContent: "center",
          alignItems: "center",
          flexBasis: 1,
          [theme.breakpoints.down(300)]: {
            flexBasis: '25%',
          },
          flexGrow: 1,
        })
    }>
      <Typography sx={{
        textAlign: 'center',
        fontSize: {
          xs: '0.8rem',
          sm: '1rem',
          md: '1.2rem',
        }
      }} fontSize={'1rem'} variant="p">{`${from} - ${to}`}
        <br />
        Cases
      </Typography>
    </Grid>
  )
}

export default LegendItems