import L from 'leaflet'

export default {
  skyrim: L.icon({
    iconUrl: '/img/mapicons/skyrim_map_icon.png',
    iconSize: [30, 50],
    iconAnchor: [15, 48]
  }),
  dev: L.icon({
    iconUrl: '/img/mapicons/dev.png',
    iconSize: [32, 48],
    iconAnchor: [16, 47]
  }),
  devBug: L.icon({
    iconUrl: '/img/mapicons/dev_bug.png',
    iconSize: [32, 48],
    iconAnchor: [16, 47]
  }),
  devOk: L.icon({
    iconUrl: '/img/mapicons/dev_ok.png',
    iconSize: [32, 48],
    iconAnchor: [16, 47]
  }),
  flagBlack: L.icon({
    iconUrl: '/img/mapicons/flag_black.png',
    iconSize: [32, 48],
    iconAnchor: [16, 47]
  }),
  relayRack: L.icon({
    iconUrl: '/img/mapicons/relay_rack.png',
    iconSize: [32, 48],
    iconAnchor: [16, 47]
  })
}
