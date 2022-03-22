import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';


const CovidMap = ({ covidGeoJSON, colors, stats:{ranges}, smallScreen }) => {
    let geoRef = useRef(null);

    const highlightState = (e) => {
        let layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    const resetHighlight = (e) => {
        geoRef.current.resetStyle(e.target)
    }

    const zoomToFeature = (e) => {
        e.target._map.flyToBounds(e.target.getBounds());
    }

    const createPopup = (state, layer) => {
        layer.on({
            mouseover: highlightState.bind(this),
            mouseout: resetHighlight,
            click: zoomToFeature,
        });
        let name = state.properties.NAME;
        let covidCount = state.properties.covidCountDeci;
        layer.bindPopup(`<p>name: ${name} <br/> covidCount: ${covidCount}</p>`).openPopup();
    }

    const getColor = (covidCount, colors) => {
        for (let i = 0; i < ranges.length; i++) {
            if (covidCount >= ranges[i][0] && covidCount <= ranges[i][1]) {
                return colors[i]
            }
        }
        return 1;
    }

    const stateStyle = (state) => {
        let covidCount = state.properties.covidCount
        // TODO: DELETE IF STATEMENT AFTER FIXING BUG
        if (state.properties.NAME === "Vermont"){
            const color = getColor(covidCount, colors)
        }
        return {
            fillColor: getColor(covidCount, colors),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }
    return (
        <MapContainer className="covid-map" style={{ backgroundColor: '#25282D', height: '90%', width: '100%' }}
            smallScreen={smallScreen}
            center={[39.162497380360634, -94.83672007881789]}
            zoom={5}
            whenReady={(map) => {
                let { _zoomInButton, _zoomOutButton } = map.target.zoomControl
                _zoomInButton.style.color = 'red';
                console.log(_zoomInButton, _zoomOutButton)
                map.target.zoomControl.setPosition('topright')
                map.target.zoomControl._container.style = 'margin-top:2rem; margin-right:2rem;'
            }}
        >
            <GeoJSON ref={geoRef} style={stateStyle} data={covidGeoJSON} onEachFeature={createPopup.bind(this)}></GeoJSON>
        </MapContainer>
    )
}

export default CovidMap