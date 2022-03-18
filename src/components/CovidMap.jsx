import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


const CovidMap = ({ covidGeoJSON, colors, stats, smallScreen }) => {
    const [controlContainer, setControlContainer] = useState(null);

    useEffect(() => {
        if (controlContainer) {
            console.log(controlContainer);
            // if (smallScreen) {
            //     controlContainer.style = 'position:absolute; top:40px; right:75px;';
            // } else {
            //     controlContainer.style = '';
            // }
        }
    }, [smallScreen])


    const hoverState = (e) => {
        console.log(e.sourceTarget.feature.properties.NAME);
    }

    const createPopup = (state, layer) => {
        layer.on({
            mouseover: hoverState,
        });
        let name = state.properties.NAME;
        let covidCount = state.properties.covidCountDeci;
        layer.bindPopup(`<p>name: ${name} <br/> covidCount: ${covidCount}</p>`).openPopup();
    }

    const getColor = (covidCount, colors, { ranges }) => {
        for (let i = 0; i < ranges.length; i++) {
            if (covidCount >= ranges[i][0] && covidCount <= ranges[i][1]) {
                return colors[i]
            }
        }
        return 1;
    }

    const stateStyle = (state) => {
        let covidCount = state.properties.covidCount
        return {
            fillColor: getColor(covidCount, colors, stats),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }
    return (
        <MapContainer className="covid-map" style={{ backgroundColor: '#2b2f31', height: '90%', width: '100%' }}
            smallScreen={smallScreen}
            center={[39.162497380360634, -94.83672007881789]}
            zoom={5}
            whenReady={(map) => {
                map.target.zoomControl.setPosition('topright')
                map.target.zoomControl._container.style = 'margin-top:2rem; margin-right:2rem;'
                setControlContainer(map.target._controlContainer)
            }}
        >
            <GeoJSON style={stateStyle} data={covidGeoJSON} onEachFeature={createPopup}></GeoJSON>
        </MapContainer>
    )
}

export default CovidMap