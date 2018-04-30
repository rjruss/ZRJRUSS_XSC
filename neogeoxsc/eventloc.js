var lat = window.lat;
var lon = window.lon;

window.app = {};
var app = window.app;

function read(key) {
	//https://stackoverflow.com/questions/13011313/storing-ajax-response-array-into-a-variable-for-later-usage
	var tok_url = 'secureTokens.xsjs?cmd=read&key=' + key;
	var key1 = $.ajax({
		url: tok_url,
		async: false
	}).responseText; // This will wait until you get a response from the ajax request.
	return key1;
}

app.Drag = function() {

	ol.interaction.Pointer.call(this, {
		handleDownEvent: app.Drag.prototype.handleDownEvent,
		handleDragEvent: app.Drag.prototype.handleDragEvent,
		handleMoveEvent: app.Drag.prototype.handleMoveEvent,
		handleUpEvent: app.Drag.prototype.handleUpEvent
	});

	this.coordinate_ = null;
	this.cursor_ = 'pointer';
	this.feature_ = null;
	this.previousCursor_ = undefined;

};
ol.inherits(app.Drag, ol.interaction.Pointer);
app.Drag.prototype.handleDownEvent = function(evt) {
	var map = evt.map;

	var feature = map.forEachFeatureAtPixel(evt.pixel,
		function(feature, layer) {
			return feature;
		});

	if (feature) {
		this.coordinate_ = evt.coordinate;
		this.feature_ = feature;
	}

	return !!feature;
};

app.Drag.prototype.handleDragEvent = function(evt) {
	var map = evt.map;

	var feature = map.forEachFeatureAtPixel(evt.pixel,
		function(feature, layer) {
			return feature;
		});

	var deltaX = evt.coordinate[0] - this.coordinate_[0];
	var deltaY = evt.coordinate[1] - this.coordinate_[1];

	var geometry = /** @type {ol.geom.SimpleGeometry} */
		(this.feature_.getGeometry());
	geometry.translate(deltaX, deltaY);

	this.coordinate_[0] = evt.coordinate[0];
	this.coordinate_[1] = evt.coordinate[1];
};

app.Drag.prototype.handleMoveEvent = function(evt) {
	if (this.cursor_) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
				return feature;
			});
		var element = evt.map.getTargetElement();
		if (feature) {
			if (element.style.cursor != this.cursor_) {
				this.previousCursor_ = element.style.cursor;
				element.style.cursor = this.cursor_;
			}
		} else if (this.previousCursor_ !== undefined) {
			element.style.cursor = this.previousCursor_;
			this.previousCursor_ = undefined;
		}
	}
};

app.Drag.prototype.handleUpEvent = function(evt) {
	this.coordinate_ = null;
	this.feature_ = null;
	return false;
};

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		alert("Geolocation is not supported by this browser.");
	}

}

function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	//	lat = 37.398489;
	//	lon = -122.14573;
	moveme();
}

function openDialog(t) {
	var oDialog1 = new sap.ui.commons.Dialog();
	oDialog1.setTitle("Where Are You Robert");
	var oText = new sap.ui.commons.TextView({
		//oTextField1.getValue()
		text: 'Location Submitted Successfuly for event :' + t
	});
	oDialog1.addContent(oText);
	oDialog1.addButton(new sap.ui.commons.Button({
		text: "OK",
		press: function() {
			oDialog1.close();
		}
	}));
	oDialog1.open();
}

function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML = "User denied the request for Geolocation."
			//
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable."
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred."
			break;
	}
	lat = 49.3008;
	lon = 8.6442;
	alert("no Location available so sending you to Walldorf, you can manually change this. ");
	moveme();

}

function moveme() {

	var here_id = read('app_id');
	var here_code = read('app_code');

	var textcheck = "Enter event name here";
	var textcheck2 = "Enter link here";

	var oTextField1 = new sap.ui.commons.TextField("TF1", {
		value: textcheck,
		tooltip: "edit me",
		width: "300px",
		setDesign: sap.ui.commons.TextViewDesign.H3
	});
	oTextField1.setMaxLength(90);

	var oIPE1 = new sap.ui.commons.InPlaceEdit("IPE1", {
		content: oTextField1
	}).placeAt("uiArea");

	var oTextField2 = new sap.ui.commons.TextField("TF2", {
		value: textcheck2,
		tooltip: "edit me",
		width: "300px",
		setDesign: sap.ui.commons.TextViewDesign.H3
	});
	oTextField2.setMaxLength(90);

	var oIPE2 = new sap.ui.commons.InPlaceEdit("IPE2", {
		content: oTextField2
	}).placeAt("uiArea");

	var oButton2 = new sap.ui.commons.Button("button2", {
		text: "Submit/Update your location",
		press: function() {
			finalanswer();
		}
	});

	oButton2.placeAt("uiArea");

	var oTextView1 = new sap.ui.commons.TextView({
		text: 'Location: Lat: ' + lat,
		wrapping: true,
		width: '300px',
		semanticColor: sap.ui.commons.TextViewColor.Positive
	});

	oTextView1.placeAt("ui2");

	var oTextView2 = new sap.ui.commons.TextView({
		text: 'Lon: ' + lon,
		wrapping: true,
		width: '300px',
		semanticColor: sap.ui.commons.TextViewColor.Positive
	});

	oTextView2.placeAt("ui2");

	jQuery.sap.require("sap.ui.core.IconPool");

	var pointFeature = new ol.Feature(new ol.geom.Point([lon, lat]).transform('EPSG:4326', 'EPSG:3857'));
	var coordinate = pointFeature.getGeometry().getCoordinates();
	var coordinate1 = ol.proj.toLonLat(pointFeature.getGeometry().getCoordinates(), 'EPSG:3857');

	var hereURL = 'https://{1-4}.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=' + here_id +
		'&app_code=' + here_code + '&lg=eng';

	var raster = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: hereURL
		})
	});

	function finalanswer() {

		coordinate1 = ol.proj.toLonLat(pointFeature.getGeometry().getCoordinates(), 'EPSG:3857');

		lon = coordinate1[0];
		lat = coordinate1[1];

		var putrequestin = "./services/eventputbin.xsjs?"
		var dataputin = "sevent=" + encodeURIComponent(oTextField1.getValue()) + "&link=" + encodeURIComponent(oTextField2.getValue()) + "&lat=" +
			lat + "&lon=" + lon;
		var finalreq = putrequestin + dataputin;
		$.get(finalreq, function(data, status) {
			if (status === 'success') {
				openDialog(oTextField1.getValue());
			} else {
				console.log('Something went wrong with the DB update!! check the logs');
				alert('Sorry, failed to update');
			}
		}).fail(function() {
			alert('Sorry, failed to update');
		});
		oTextView1.setText('Location: Lat: ' + lat);
		oTextView2.setText('Lon: ' + lon);

	}

	window.document.getElementById("Loading").innerHTML = "";

	var map = new ol.Map({
		interactions: ol.interaction.defaults().extend([new app.Drag()]),
		layers: [
raster,
    new ol.layer.Vector({
				source: new ol.source.Vector({
					features: [pointFeature]
				}),
				style: new ol.style.Style({
					image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						opacity: 0.95,
						src: 'data/scnmarker1.png'
					})),
					stroke: new ol.style.Stroke({
						width: 3,
						color: [255, 0, 0, 1]
					}),
					fill: new ol.style.Fill({
						color: [0, 0, 255, 0.6]
					})
				})
			})
  ],
		target: 'map',
		view: new ol.View({
			center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
			zoom: 15
		})
	});
}

getLocation();