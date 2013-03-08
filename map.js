/*
  Copyright (c) 2012-2013 IrelandOffline
*/

var currentLayer = null;
var lyrDSL = null;
var lyrUnderlays = null;
var lyrMobile = null;
var lyrWISPs = null;
var marker = "null"
var circle = null;
var crosshair = null;
var wispsArray = []

function initialize() {
	var athlone = new google.maps.LatLng(53.5, -7.5);
	map = new google.maps.Map(document.getElementById('dvMap'), {
		center: athlone,
		zoom: 7,
		mapTypeId: 'roadmap'
	});

	circle = new google.maps.Circle({
		map: map,
		radius: 3500, // 3.5 kms
		strokeWeight: 0,
		stokeOpacity: 0
	});

	crosshair = new google.maps.MarkerImage('marker.png',
		new google.maps.Size(10, 10),
		new google.maps.Point(0, 0),
		new google.maps.Point(5, 5)
	);

	marker = new google.maps.Marker({
		icon: crosshair,
		map: map,
		position: new google.maps.LatLng(53.5, -10.5),
		draggable: true,
		title: 'Drag to your location 3.5 kms'
	});

	circle.bindTo('center', marker, 'position');
}
//Function brings circle marker to centre of screen
function fetchMarker() {
	marker.position = map.getCenter(),
	circle.bindTo('center', marker, 'position');
	marker.setMap(map);
}

//SECTION ON WIRELESS
//Function to create fusion tables layer from drop down option
function getWISPGroup(sel) {

  var sql = "'Group' = "+ sel.value;
  
	currentLayer = lyrWISPs;
	clearLayer();
	lyrWISPs = null;
  

  		lyrWISPs = new google.maps.FusionTablesLayer({
  			query: {
  			  select: 'Low_Res_Poly',
  			  from: '1g4848Z90Y2cd1xXcPfJzadguwP2JHzqE-Ip5dLE',
  			  where: sql

    		},
    	});
    	
	stackLayers();
	currentLayer = lyrWISPs;
}

//Function to load High Resolution Map from drop down list
function getHRMap(sel) {
  
  switch(sel.value)
  {
	  case "0":
 	  	deleteOverlays()
 	  	break;
 	  	
	  case "1":
	  	deleteOverlays();
	  	newLayer(52.17259, 51.27235, -8.3619661, -10.12707, 0.9, "overlays/digital-forge.png")
		break;
		
	  case "2":
	  	deleteOverlays();
	  	newLayer(52.744606, 51.949345, -9.118652, -10.721283, 0.8, "overlays/kerry-broadband.png")
		break;
		
	  case "3":
	  	deleteOverlays();	  	
	  	newLayer(54.52309, 53.17326, -8.289186, -10.29116, 0.5, "overlays/westnet.png")
		break;
		
	  case "4":
	  	deleteOverlays();	  	
	  	newLayer(55.462214, 51.351278, -5.904817, -10.821576, 1.0, "overlays/NBScoverage.png")
		break;
		

  }
}

// SECTION ON MOBILE NETWORKS AND PLATFORMS
// Function to create SQL query string from checked boxes of a form FormNo
function getGSMNetworks() {
	txt = "";
	if( document.getElementById( 'idNetVoda' ).checked ) txt = "'Vodafone'";
	if( document.getElementById( 'idNetO2' ).checked ) {
		if( txt != "" ) txt += ", ";
		txt += "'O2'";
	}
	if( document.getElementById( 'idNetMet' ).checked ) {
		if( txt != "" ) txt += ", ";
		txt += "'Meteor'";
	}
	if( document.getElementById( 'idNet3' ).checked ) {
		if( txt != "" ) txt += ", ";
		txt += "'3'";
	}
	return txt;
}
function getGSMTechnology() {
	txt = "";
	if( document.getElementById( 'idPlatGSM' ).checked ) txt = " AND GSM='X'";
	if( document.getElementById( 'idPlat3G' ).checked ) txt += " AND UMTS='X'";
	return txt;
}
function getDSLTechnology() {
	txt = "";
	if( document.getElementById( 'idEirDSL' ).checked ) txt = "'y'";
	if( document.getElementById( 'idEirNoDSL' ).checked ) {
		if( txt != "" ) txt += ", ";
		txt += "'n'";
	}
	return txt;
}

// Function combines Network, Platform queries of the Mobile Sites Fusion table.
function MakeQuery() {
	var sql = getGSMNetworks();

	currentLayer = lyrMobile;
	clearLayer();
	lyrMobile = null;
	
	if( sql != "" ) {
		sql = "'Network' IN (" + sql + ")" + getGSMTechnology();
		lyrMobile = new google.maps.FusionTablesLayer({
  			query: {
  			  select: 'Location',
  			  from: '1BUwTpYWcd3McCpjHpbOZvuspJWu4pAIGUuTW0Pw',
  			  where: sql
  					},
  	});
		}
	stackLayers();
	currentLayer = lyrMobile;
}

// Function queries the Eircom exchanges Fusion Table
function compQuery() {
	currentLayer = lyrDSL;
	clearLayer();
	lyrDSL = null;

	var dslTech = getDSLTechnology();
	if( dslTech != "" ) {
	  	dslTech = "'Enabled' IN( " + dslTech + " )";
		lyrDSL = new google.maps.FusionTablesLayer({
  			query: {
  			  select: 'Location',
  			  from: '1xvObXKsemrYIBklXMSoRfQ17sfl9W-6JSua0PGQ',
  			  where: dslTech

  					},
  	});

	}
	stackLayers();
	currentLayer = lyrDSL;
}

//SECTION ON UNDERLAYS
// Function sets underlay based on radio button choice of Form AreaOverlay
function overlay(layerNo, dataset, querytxt) {
	currentLayer = layerNo;
	clearLayer();
	lyrUnderlays = new google.maps.FusionTablesLayer(dataset, { query: querytxt });
	stackLayers();
	currentLayer = layerNo;
}
function displayOverlay( el, dataSetID, useAdditionalqueryOptions,querytext, kmlColName ) {
	currentLayer = lyrUnderlays;
	clearLayer();
	lyrUnderlays = null;

	if(el ) {
		var _kmlColName = "KML";
		if( kmlColName && kmlColName != "" ) _kmlColName = kmlColName;
		var sql = "";
		if( useAdditionalqueryOptions ) sql += querytxt;

		lyrUnderlays = new google.maps.FusionTablesLayer({
  			query: {
  			  select: _kmlColName,
  			  from: dataSetID,
  			  where:querytext

  					},
  	});
	}
	stackLayers();
	currentLayer = lyrUnderlays;
}

//SECTION ON MANAGING LAYERS
function stackLayers() {
	if (lyrUnderlays != null) lyrUnderlays.setMap(map);
	if (lyrWISPs != null) lyrWISPs.setMap(map);	
	if (lyrDSL != null) lyrDSL.setMap(map);
	if (lyrMobile != null) lyrMobile.setMap(map);
}
function clearAllLayers() {
	if (lyrDSL) lyrDSL.setMap(null);
	if (lyrWISPs) lyrWISps.setMap(null);
	if (lyrUnderlays) lyrUnderlays.setMap(null);
	if (lyrMobile) lyrMobile.setMap(null);
}
function clearLayer() {
	if (currentLayer != null) currentLayer.setMap(null);
}

//SECTION ON GROUNDOVERLAYS FOR FWAs AND WISPS
// Creates overlay. Updates the overlay array.
function newLayer(North, South, East, West, vis, overLayLink) {
	var imageBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(South, West),
		new google.maps.LatLng(North, East));
	var overlayOpts = {
		opacity: vis
	}
	var wisp = new google.maps.GroundOverlay(
					overLayLink, imageBounds, overlayOpts);
	wispsArray.push(wisp);
	wisp.setMap(map);
}
//Checks whether FWA checkbox is ticked
function checkedState() {
	if (document.getElementById("idWISPs").checked) {
		loadGroundOverlays();
	}
	else {
		clearOverlays();
	}
}
// Loads all overlays onto map
function loadGroundOverlays() {
	newLayer(52.17259, 51.27235, -8.3619661, -10.12707, 0.9, "overlays/digital-forge.png");
	newLayer(54.52309, 53.17326, -8.289186, -10.29116, 0.5, "overlays/westnet.png");
	newLayer(52.744606, 51.949345, -9.118652, -10.721283, 0.8, "overlays/kerry-broadband.png");
}
// Sets the map on all overlays in the array.
function setAllMap(map) {
	for (var i = 0; i < wispsArray.length; i++) {
		wispsArray[i].setMap(map);
	}
}
// Removes the overlays from the map, but keeps them in the array.
function clearOverlays() {
	setAllMap(null);
}
// Shows any overlays currently in the array.
function showOverlays() {
	setAllMap(map);
}
// Deletes all overlays in the array by removing references to them.
function deleteOverlays() {
	clearOverlays();
	wispsArray = [];
}

