// Map container style
export const containerStyle = {
    width: '100%',
    height: '500px',
  };
  
export interface GeographicLocation {
    latitude: number,
    longitude: number,
    zoom?: number
}

  //center of Kaaba
  export const worldCenter: GeographicLocation = {
    latitude: 21.4225,
    longitude: 39.826167,
    zoom: 2
  }

 export const mapStyle = [
    {
      "featureType": "administrative.country",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide country names
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels",
      "stylers": [{ "visibility": "on" }]  // Hide city names
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide neighborhood labels
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide land parcel labels
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide road labels
    },
    {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide water body labels (seas, rivers, etc.)
    },
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide points of interest (e.g., parks, landmarks)
    },
    {
      "featureType": "administrative.province",
      "elementType": "labels",
      "stylers": [{ "visibility": "on" }]  // Show state labels
    },
    {
      "featureType": "transit",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide transit labels
    },
    {
      "featureType": "landscape",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]  // Hide landscape labels
    }
  ];
  // Custom map style to show only major states (admin level 1)
//   export const mapStyle = [
//       {
//         "featureType": "administrative",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Show administrative labels
//         ]
//       },
//       {
//         "featureType": "administrative.country",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide country names
//         ]
//       },
//       {
//         "featureType": "administrative.locality",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "on" } // Hide city names
//         ]
//       },
//       {
//         "featureType": "administrative.neighborhood",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide neighborhood names
//         ]
//       },
//       {
//         "featureType": "administrative.province",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Show state labels
//         ]
//       },
//       {
//         "featureType": "road",
//         "elementType": "geometry",
//         "stylers": [
//           { "visibility": "off" } // Hide roads
//         ]
//       },
//       {
//         "featureType": "poi",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide points of interest (shops, etc.)
//         ]
//       },
//       {
//         "featureType": "transit",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide transit stations
//         ]
//       },
//       {
//         "featureType": "landscape",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide landscape labels
//         ]
//       },
//       {
//         "featureType": "water",
//         "elementType": "labels",
//         "stylers": [
//           { "visibility": "off" } // Hide water labels
//         ]
//       }
//     ];