import React, { useEffect, useRef, useState } from 'react'
import { DataGrid} from '@mui/x-data-grid'
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

const CovidDataGrid = ({ selectionModel, setSelectionModel, geoRef, covidGeoJSON, colors, stats, smallScreen }) => {
  const [gridRows, setGridRows] = useState([]);
  let ref = useRef();

  const onRowClick = (params) => {
    setSelectionModel([params.row.id]);
  }

  const onStateChange = (gridState) => {
    //select a row initially to demonstrate to the user that rows are selectable;
    const rowIds = gridState.sorting.sortedRows;

    if (selectionModel[0] < 0 && rowIds.length && gridState.rows.idRowsLookup.hasOwnProperty('1')) {
      setSelectionModel([gridState.sorting.sortedRows[0]]);
    }
  }

  useEffect(() => {
    let row;
    let rows = [];
    let state;
    for (let i = 0; i < covidGeoJSON.length; i++) {
      row = {};
      state = covidGeoJSON[i];
      row.id = state.properties.id;
      row.bounds = state.properties.bounds;
      row.state = state.properties.NAME;
      row.covidCount = state.properties.covidCountDeci;
      row.percentByPop = ((state.properties.covidCount / stats.totalCounts) * 100).toPrecision(2) + "%";
      rows.push(row);
    }
    setGridRows(rows);
  }, [stats, covidGeoJSON]);

  useEffect(() => {
    let index = gridRows.findIndex((elem) => (elem.id === selectionModel[0]));
    if (selectionModel[0] >= 0) {
      const map = geoRef._map;
      const bounds = gridRows[index].bounds;
      map.flyToBounds(bounds, { maxZoom: map._zoom })
    }
  }, [selectionModel])

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
        rows={gridRows}
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