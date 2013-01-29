/*
Copyright (c) 2012-2013 IrelandOffline
*/

var currentLayer = null;
var layer = null;
var layer1 = null;
var layer2 = null;
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

// SECTION ON MOBILE NETWORKS AND PLATFORMS
// Function to create SQL query string from checked boxes of a form FormNo
function formScan(formNo) {
	var i;
	txtOut = "";
	for (i = 0; i < document.forms[formNo].length; i++) {
		if (document.forms[formNo].elements[i].checked) txtOut = txtOut + document.forms[formNo].elements[i].value;
		else txtOut = txtOut + "";
	}
	return txtOut;
}
// Function combines Network, Platform queries of the Mobile Sites Fusion table.
function MakeQuery() {
	CombQry = ""
	CombQry = "'Network' IN (" + formScan(0) + "'f')" + formScan(1);
	currentLayer = layer2
	clearLayer();

	layer2 = new google.maps.FusionTablesLayer(5488684, { query: "SELECT Location FROM 5488684 WHERE " + CombQry });
	stackLayers();
	currentLayer = layer2;
}
// Function queries the Eircom exchanges Fusion Table
function compQuery() {
	currentLayer = layer;
	clearLayer();

	exchQry = "(" + formScan(2) + "'f')";
	layer = new google.maps.FusionTablesLayer(1888694, { query: "SELECT Location FROM 1888694 WHERE 'Enabled' IN" + exchQry });
	stackLayers();
	currentLayer = layer;
}

//SECTION ON UNDERLAYS
// Function sets underlay based on radio button choice of Form AreaOverlay
function overlay(layerNo, dataset, querytxt) {
	currentLayer = layerNo;
	clearLayer();
	layer1 = new google.maps.FusionTablesLayer(dataset, { query: querytxt });
	stackLayers();
	currentLayer = layerNo;
}

//SECTION ON MANAGING LAYERS
function stackLayers() {
	if (layer1 != null) layer1.setMap(map);
	if (layer != null) layer.setMap(map);
	if (layer2 != null) layer2.setMap(map);
}
function clearAllLayers() {
	if (layer) layer.setMap(null);
	if (layer1) layer1.setMap(null);
	if (layer2) layer2.setMap(null);
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

