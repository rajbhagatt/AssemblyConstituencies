	var zoom=7;
	var latstart=11;
	var longstart=78.5;
	
	
	function SearchFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('ConstText');
  filter = input.value.toUpperCase();
  ul = document.getElementById("ConstUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
	
   var origviz={
	    
		weight: 1.5,
        opacity: 1,
		stroke: true,
		smoothFactor:0,
        color: "red",
        dashArray: '0',
        fillOpacity: 0,
		zindex: 99
		}
	function vizstyle(feature) {
	
	return origviz;
	
	}
	
	var alterviz={weight: 3,
	fillColor: 'yellow',
        opacity: 1,
		stroke: true,
		smoothFactor:0,
        color: "red",
        dashArray: '0',
        fillOpacity: 0.3,
		zindex: 99
		};
	
	info = L.control({position: "topright"});
	info.update = function (props) { 	
    this._div.innerHTML =  (props ? 'Constituency : <b>' + props["Const_Name"] + '</b><br> Number: <b>' + props["ACNo"] +'</b><br> Category: <b>' + props["Category"] + '</b><br> District: <b>' + props["District"] +'</b><br> Parliamentary Constituency: <b>' + props["Parl_Const"]: ' ');
	
	
	};
	info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'hover'); // create a div with a class "info"
    this.update();
    return this._div;
	};
	
	function highlightFeature(e) {
	//When the users hover over the polygons, they are highlighted
    var layer = e.target;
    info.update(layer.feature.properties);
	}

	function resetHighlight(e) {
	//When the users hover out of the polygon,the highlight is removed
	info.update();
	}
	var prevLayerClicked = null;
	var prevStyle=origviz;

	function ClickF(e) {
		var layer = e.target;
		
	if (prevLayerClicked==layer)
		
		{ 
		if (prevStyle==origviz)
			{s2=alterviz; prevStyle=alterviz}
		else 
			{s2=origviz; prevStyle=origviz}
		}
	else
		{s2=alterviz; prevStyle=alterviz}

      if (prevLayerClicked !== null) {
          // Reset style
        prevLayerClicked.setStyle(origviz);
      }
	  
	  
      map.fitBounds(e.target.getBounds());
      
      layer.setStyle(s2);
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      //info.update(layer.feature.properties.availability);
      prevLayerClicked = layer;
    };
	
	function onEachFeature(feature,layer) {
	layer.on({	
        mouseover: highlightFeature,
        mouseout: resetHighlight,
		click: ClickF
	});
	}
	
	
	
	var map = L.map('map').setView([latstart, longstart], zoom);
	info.addTo(map);
	var googleLayer = new L.Google('HYBRID');
	map.addLayer(googleLayer,true);

	
		gJ=L.geoJson(TN_AC, {style: vizstyle, onEachFeature: onEachFeature }).addTo(map);
	

		
var searchControl = new L.Control.Search({
layer: gJ,  // Determines the name of variable, which includes our GeoJSON layer!
propertyName: 'Const_Name',
marker: false,
moveToLocation: function(latlng, title, map) {
    //map.fitBounds( latlng.layer.getBounds() );
    var zoom = map.getBoundsZoom(latlng.layer.getBounds());
    map.setView(latlng, zoom); // access the zoom
    }
});

searchControl.on('search:locationfound', function(e) {
e.layer.setStyle(alterviz);
if(e.layer._popup)
    e.layer.openPopup();
}).on('search:collapsed', function(e) {
gJ.eachLayer(function(layer) {   //restore feature color
    gJ.resetStyle(layer);
}); 
});

map.addControl( searchControl ); 




	
