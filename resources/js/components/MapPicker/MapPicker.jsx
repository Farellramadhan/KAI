import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapPicker.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom markers
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function LocationMarker({ position, onLocationSelect, category }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  const getIconFromCategory = (category) => {
    const types = {
      stasiun: greenIcon,
      kantor: redIcon,
      gudang: yellowIcon,
      pjl: blueIcon
    }
    return types[category] || greenIcon
  }

  return position ? (
    <Marker position={position} icon={getIconFromCategory(category)} />
  ) : null
}

function MapPicker({ latitude, longitude, onLocationChange, category = 'stasiun' }) {
  // Default center (Yogyakarta)
  const defaultCenter = [-7.7956, 110.3695]
  
  // Use provided coordinates if available, otherwise use default
  const initialPosition = latitude && longitude 
    ? [parseFloat(latitude), parseFloat(longitude)]
    : null

  const [position, setPosition] = useState(initialPosition)
  const [center] = useState(initialPosition || defaultCenter)

  const handleLocationSelect = (lat, lng) => {
    setPosition([lat, lng])
    // Update parent component with new coordinates
    onLocationChange(lat.toFixed(6), lng.toFixed(6))
  }

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      const newPos = [parseFloat(latitude), parseFloat(longitude)]
      setPosition(newPos)
    }
  }, [latitude, longitude])

  return (
    <div className="map-picker-container">
      <div className="map-picker-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Klik pada peta untuk menentukan lokasi</span>
      </div>
      <div className="map-picker-wrapper">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            onLocationSelect={handleLocationSelect}
            category={category}
          />
        </MapContainer>
      </div>
      {position && (
        <div className="map-picker-coordinates">
          <div className="coordinate-display">
            <span className="coordinate-label">Lat:</span>
            <span className="coordinate-value">{position[0].toFixed(6)}</span>
          </div>
          <div className="coordinate-display">
            <span className="coordinate-label">Lng:</span>
            <span className="coordinate-value">{position[1].toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapPicker
