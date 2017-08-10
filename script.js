  var map;
  var is_mobile = false;
  
   function init(){
    if( $('.mobile-hide').css('display')==='none') {
        is_mobile = true;       
    }

    if (is_mobile === true) {
        // initiate leaflet map
        device_depending_center = [47.5560, 7.591];
        device_depending_zoom = 13;

      } else {

        device_depending_center = [47.5560, 7.62];
        device_depending_zoom = 13;
    }

    map = new L.Map('map', { 
          center: device_depending_center,
          zoom: device_depending_zoom
        })
    

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmVsaXhtaWNoZWwiLCJhIjoiZWZrazRjOCJ9.62fkOEqGMxFxJZPJuo2iIQ', {
          attribution: 'MapBox'
        }).addTo(map);
  
  var layerUrl = 'https://felixmichel.carto.com/api/v2/viz/f5eb1f56-33b8-4e8f-8535-6faa567efffa/viz.json';

  var sublayers = [];

  cartodb.createLayer(map, layerUrl, { legends: false })
  .addTo(map)
  .on('done', function(layer) {
    // change the query for the first layer
    var subLayerOptions = {
      sql: "SELECT * FROM stwep_verkaeufe_2017"
    }

    var sublayer = layer.getSubLayer(0);

    sublayer.set(subLayerOptions);
	sublayer.setInteraction(true);

    sublayers.push(sublayer);
  }).on('error', function() {
    //log the error
  });
  

var LayerActions = {
  all: function(){
    sublayers[0].setSQL("SELECT * FROM stwep_verkaeufe_2017");
    return true;
  },
  sanierung: function(){
    sublayers[0].setSQL("SELECT * FROM stwep_verkaeufe_2017 WHERE weiterverwendung IN ('Sanierung')");
    return true;
  },
  san_bruch: function(){
    sublayers[0].setSQL("SELECT * FROM stwep_verkaeufe_2017 WHERE weiterverwendung='Sanierung' OR weiterverwendung='Abbruch und Neubau'");
    return true;
  },
  abbruch: function(){
    sublayers[0].setSQL("SELECT * FROM stwep_verkaeufe_2017 WHERE weiterverwendung IN ('Abbruch und Neubau')");
    return true;
  },
  andere: function(){
    sublayers[0].setSQL("SELECT * FROM stwep_verkaeufe_2017 WHERE weiterverwendung IN ('Andere')");
    return true;
  }

}

$('.filter').click(function() {
  console.log('clicked');
      $('.filter').removeClass('active');
      $(this).addClass('active');
      LayerActions[$(this).attr('data-id')]();
   });

var mapbox = $('.mapbox');

$('input').on('click',function () {
        if (mapbox.is(':checked')) {
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();
          map.keyboard.enable();
          
        } else {
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();
          map.keyboard.disable();
        }
    });
}




