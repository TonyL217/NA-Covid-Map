import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  { field: 'state', headerName: 'State', width: 90 },
  { field: 'covidCount', headerName: 'Covid Count', width: 90 },
  { field: 'percentByPop', headerName: 'Percent By Population', width: 90 }
]

const rows = [
  //{ id: 1, state: 'Muerica', covidCount: 1, percentByPop: '5%' }
]

const CovidDataGrid = ({ covidGeoJSON, colors, stats }) => {

  let row = {};
  let state;
  for (let i = 0; i < covidGeoJSON.length; i++) {
    row = {};
    state = covidGeoJSON[i]
    row.id = i;
    row.state = state.properties.NAME;
    row.covidCount = state.properties.covidCount;
    row.percentByPop = (row.covidCount / stats.totalCounts) * 100;
    rows.push(row);
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default CovidDataGrid