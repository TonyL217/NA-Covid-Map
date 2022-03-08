import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  { field: 'state', headerName: 'State', width: 90 },
  { field: 'covidCount', headerName: 'Covid Count', width: 90 },
  { field: 'percentByPop', headerName: 'Percent By Population', width: 90 }
]

const rows = [
  { id: 1, state: 'Muerica', covidCount: 1, percentByPop: '5%' }
]

const CovidDataGrid = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1}}>
        <DataGrid
          rows={rows}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default CovidDataGrid