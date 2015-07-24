/////////////////* GOOGLE MAP */////////////////////////

function googlemap() {
    "use strict";
    var latlng = new google.maps.LatLng(40.714353, -74.005973);
    
    var stylez = [
    {
      featureType: "all",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    }
];

    var myMapOptions = {
        zoom: 17,
        scrollwheel: false,
        disableDefaultUI: true,
        mapTypeControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.MEDIUM,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        center: latlng,
        mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
    }
    };
    
    var map = new google.maps.Map(document.getElementById("google-map"), myMapOptions);
    
    var mapType = new google.maps.StyledMapType(stylez, { name:"Grayscale" });    
    map.mapTypes.set('tehgrayz', mapType);
    map.setMapTypeId('tehgrayz');
    var image = 'images/icons/pin.png';

    var marker = new google.maps.Marker({
        draggable: false,
        animation: google.maps.Animation.DROP,
        icon: image,
        map: map,
        position: latlng
    });
}