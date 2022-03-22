import { Box, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
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
      <Typography variant="p" sx={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        width: '100%',
        height: '100%',
        fontSize: {
          xs: '0.8rem',
          sm: '1rem',
          md: '1.4rem',
        }

      }}>
        {from}
        <Box sx={{width:'100%'}}> - </Box>
        {to}
      </Typography>

    </Grid>
  )
}

export default LegendItems