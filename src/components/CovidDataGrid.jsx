import React, { useEffect, useRef, useState } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { Box } from '@mui/system'

const deciComparator = (v1, v2) => {
  return parseInt(v2.replaceAll(',', '')) - parseInt(v1.replaceAll(',', ''));
}

const percentComparator = (v1, v2) => {
  return parseFloat(v2.replaceAll('%', '')) - parseFloat(v1.replaceAll('%', ''));
}

const columns = [
  { field: 'id', headerName: 'ID', hide: true },
  { field: 'bounds', headerName: 'Bounds', hide: true },
  { field: 'state', headerName: 'State', flex: 1 },
  { field: 'covidCount', headerName: 'Covid Count', sortComparator: deciComparator, flex: 0.8 },
  { field: 'percentByPop', headerName: ' % by Pop', sortComparator: percentComparator, flex: 0.65 }
];

// const rows = [
// row example template
// { id: 1, state: 'Muerica', covidCount: 1, percentByPop: '5%' }
// 

const CovidDataGrid = ({ geoRef, covidGeoJSON, colors, stats, smallScreen }) => {
  const [GridRows, setGridRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  let ref = useRef();
  let GridRef = useGridApiRef([]);

  const onRowClick = (params) => {
    const map = geoRef._map;
    map.flyToBounds(params.row.bounds, { maxZoom: map._zoom })
  }

  const onStateChange = (gridState)=>{
    //select a row initially to demonstrate to the user that rows are selectable;
    const rowIds = gridState.sorting.sortedRows;
    if (rowIds.length && !selectionModel.length && gridState.rows.idRowsLookup.hasOwnProperty('0')){
      const rowId = rowIds[0];
      const bounds = gridState.rows.idRowsLookup[rowId].bounds;
      const map = geoRef._map;
      setSelectionModel([rowId]);
      map.flyToBounds(bounds, { maxZoom: map._zoom })
      console.log(gridState);
    }
  }

  useEffect(() => {
    let row;
    let rows = [];
    let state;
    for (let i = 0; i < covidGeoJSON.length; i++) {
      row = {};
      state = covidGeoJSON[i];
      row.id = i;
      row.bounds = state.properties.bounds;
      row.state = state.properties.NAME;
      row.covidCount = state.properties.covidCountDeci;
      row.percentByPop = ((state.properties.covidCount / stats.totalCounts) * 100).toPrecision(2) + "%";
      rows.push(row);
    }
    setGridRows(rows);
  }, [stats, covidGeoJSON]);
  useEffect(() => {
    if (ref) {
      //TODO: figure out what this was for
      //console.log(ref);
    }
  })

  return (
    <Box sx={{
      backgroundColor: '#181a1b',
      display: 'flex',
      flex: 1,
      padding: '1rem',
      paddingTop: smallScreen ? '3rem' : '1rem',
      height: '100%',
      width: '100%',
    }}>
      <DataGrid
        sx={{
          mt: smallScreen ? '5rem' : '0',
          color: '#e7e5e2',
          height: smallScreen ? '90%' : '100%',
          width: '100%',
        }}
        rows={GridRows}
        columns={columns}
        onRowClick={onRowClick}
        onStateChange={onStateChange}
        selectionModel={selectionModel}
        initialState={{
          sorting: {
            sortModel: [{ field: 'state', sort: 'asc' }],
          },
        }}
        ref={ref}
      />
    </Box>
  )
}

export default CovidDataGrid;