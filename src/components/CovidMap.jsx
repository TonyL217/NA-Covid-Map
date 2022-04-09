import React, { useCallback, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CovidMap = ({ setSelectionModel, setGeoRef, geoRef, covidGeoJSON, colors, stats: { ranges }, smallScreen }) => {
    const [hover,setHover] = useState(null)
    const highlightState = (e) => {
        let layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        setHover(layer.feature.properties.covidCountDeci)
        controlInfo.update();



        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    const resetHighlight = (e) => {
        if (geoRef) {
            geoRef.resetStyle(e.target);
        }
    }

    const zoomToFeature = (e) => {
        setSelectionModel([e.target.feature.properties.id])
    }

    const createPopup = (state, layer) => {
        layer.on({
            mouseover: highlightState,
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
                return colors[i];
            }
        }
        return 1;
    }

    const stateStyle = (state) => {
        let covidCount = state.properties.covidCount
        return {
            fillColor: getColor(covidCount, colors),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }

    const getGeoRef = useCallback((node) => {
        setGeoRef(node);
        geoRef = node;
    }, []);

    L.Control.Info = L.Control.extend({
        onAdd: function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            console.log('v2')
            return this._div;
        },

        // method that we will use to update the control based on feature properties passed
        update: function () {

            this._div.innerHTML = '<h4>US Population Density</h4>' + (hover ?
                '<b>' + hover+ '</b><br />' + hover+ ' people / mi<sup>2</sup>'
                : 'Hover over a state');
        },
    });

    let controlInfo = null;

    let ControlHook = createControlComponent(props => {
        controlInfo = new L.Control.Info(props)
        return controlInfo;
    });


    //
    return (
        <MapContainer className="covid-map" style={{ backgroundColor: '#25282D', height: '90%', width: '100%' }}
            smallScreen={smallScreen}
            center={[39.162497380360634, -94.83672007881789]}
            zoom={5}
            whenReady={(map) => {
                map.target.zoomControl.setPosition('topright');
                map.target.zoomControl._container.style = 'margin-top:2rem; margin-right:2rem;';
            }}
        >
            <GeoJSON ref={getGeoRef} style={stateStyle} data={covidGeoJSON} onEachFeature={createPopup}></GeoJSON>
            <ControlHook>
            </ControlHook>
        </MapContainer>
    )
}

export default CovidMap;