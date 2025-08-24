import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Map, { Marker } from 'react-map-gl';
import './util/styles.scss'
import { Country } from '@app/types/Country';
import { CountryState } from '@app/types/CountryState';
import { worldCenter } from './util/MapOptions';
import { useNavigate } from 'react-router-dom';
import { doctorsStatisticsPerCountry, doctorsStatisticsPerCountryState } from '@app/api/StatisticsServic';
import { count } from 'console';

// Your Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJvc2hhZHk0MDQiLCJhIjoiY20wbXlrenNsMDExbDJrc2FxZDNxMWtxbSJ9.bUTleZ3FaohIaUIM-STMqg';

// Egypt bounding box (example)
const egyptBounds = [
  [25.0, 22.0],  // Southwest corner
  [35.0, 31.667] // Northeast corner
];

const randomBounds = [ // Southwest corner
  [35.0, 31.667], // Northeast corner
  [45.0, 45]
];


// Example markers for Cairo and Alexandria
const markers = [
  { id: 1, coords: [31.2357, 30.0444], label: 'Cairo' },
  { id: 2, coords: [29.9187, 31.2001], label: 'Alexandria' }
];

// Custom style to hide all labels
const customMapStyle = 'mapbox://styles/aboshady404/cm102c3kr01cu01qydkm0hix3';  // Use default Mapbox style

const DoctorsMap = () => {
  const [selected, setSelected] = React.useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<CountryState | null>(null);
  const [openedCountry, setOpenedCountry] = useState<Country | null>(null);
  const mapRef = useRef<any>(null);  // Reference to the map instance
  const [map, setMap] = useState<any>();
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<CountryState[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const [viewport, setViewport] = useState(worldCenter);

  useEffect(() => {
    setLoading(true);
    doctorsStatisticsPerCountry()
      .then(countries => {
        setCountries(countries);

      }).finally(() => {
        setLoading(false);
      })
  }, []);

  const countryClick = async () => {
    if (!selected)
      return;

    const states = await doctorsStatisticsPerCountryState(selected.name);
    setStates(states);
    setOpenedCountry(selected);
    close();
    const countryBounds = [
      [selected.bbox[3], selected.bbox[2]],  // Southwest corner
      [selected.bbox[1], selected.bbox[0]] // Northeast corner
    ];

    map && map.fitBounds(countryBounds, { padding: 20 });
    setViewport({ ...viewport, latitude: selected.latitude, longitude: selected.longitude, zoom:5 })

  }

  const countryClick2 = () => {
    if (selected)
      navigate('/doctors', { state: { countries: [selected.name] } });

  }

  const stateClick = () => {
    const country = countries.find(c => c.code === selectedState?.countryCode);
    if (country)
      navigate('/doctors', { state: { countries: [country.name], states: [selectedState?.name] } });

  }

  const close = () => {
    setSelected(null);
    setSelectedState(null);
  }

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      setMap(map);

      // Once the map is loaded
      map.on('load', () => {

      });
    }
  }, []);


  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}> 
      {/* Overlay spinner while map loads */} 
      {!showMap && ( 
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'rgba(52, 58, 64, 0.7)', 
            zIndex: 1000,
            gap: "10px"
          }} 
        > 
          <span style={{color:"white"}}>Loading</span>
          <Spinner animation="border" size='sm' role="status" variant="primary"> 
          </Spinner> 
        </div> 
      )} 
    <Map
      {...viewport}  // Spread the viewState to control map position and zoom
      ref={mapRef}
      initialViewState={viewport}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%', visibility: showMap?"visible": "hidden" }}
      mapStyle={customMapStyle}  // Use custom map style
      onMove={(evt) => setViewport(evt.viewState)}
      onLoad={() => {setLoading(false); setShowMap(true);}}
    >

      {countries.map((country, i) => (
        <Marker
          key={country.id}
          longitude={country.longitude}
          latitude={country.latitude}
          anchor="bottom"
          
        >
          {!selected && !selectedState && <img src="img/map-marker.svg" style={{ cursor: "pointer", width: "40px", height: "auto" }} onClick={() => setSelected(country)} />}
          {selected?.id === country.id &&
            <div style={{ width: '100px', textAlign: "center", color: '#333', fontWeight: 'bold', fontSize: "16px", backgroundColor: 'white' }} className='shadow shadow-lg p-1 rounded'>
              <button type="button" className="close filters-close" onClick={close}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
              <h6 className="text-center">{country.name}</h6>
              <h6>{country.doctorsCount} doctors</h6>
              <div className='d-flex justify-content-between'>
              <Button className="btn btn-secondary"
                style={{ fontSize: "80%", padding: "2px", margin: "0 auto" }}
                size="sm"
                onClick={countryClick}
              >
                states
              </Button>

              <Button className="btn btn-primary"
                style={{ fontSize: "80%", padding: "2px", margin: "0 auto" }}
                size="sm"
                onClick={countryClick2}
              >
                details
              </Button>
              </div>
            </div>}
        </Marker>
      ))}


      {states.map((state, index) => (<Fragment key={state.id}>
        <Marker
          longitude={state.longitude || openedCountry?.longitude || 0}
          latitude={state.latitude || openedCountry?.latitude || 0}
          anchor="bottom"
        >
        {!selectedState && !selected && <img src="img/map-marker-green.svg" style={{ cursor: "pointer", width: "30px", height: "auto", zIndex: 0 }} onClick={() => {setSelectedState(state)}}/>}

        {(selectedState?.id === state.id) &&
          <div style={{ width: '100px', textAlign: "center", color: '#333', fontWeight: 'bold', fontSize: "16px", backgroundColor: 'white', zIndex: 1000 }}
            className='shadow shadow-lg p-1 rounded z-1'
          >
            <button type="button" className="close filters-close" onClick={close}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
            <h6 className="text-center">{state.name}</h6>
            <h6>{state.doctorsCount} doctors</h6>
            <Button className="btn btn-primary"
              style={{ fontSize: "80%", padding: "2px", margin: "0 auto" }}
              size="sm"
              onClick={stateClick}
            >
              details
            </Button>
          </div>
        }

                </Marker>

      </Fragment>
      ))}

    </Map>
    </div>
  );
};

export default DoctorsMap;
