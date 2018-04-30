//https://help.sap.com/http.svc/rc/3de842783af24336b6305a3c0223a369/2.0.00/en-US/$.net.http.Client.html
$.import("rjruss.neogeoxsc", "readToken");
var readToken = $.rjruss.neogeoxsc.readToken;
var readBearer = readToken.read('dqm_code');

var destination_package = "rjruss.neogeoxsc.DQM";
var destination_name = "dqm_geo";
//3999 West Chester Pike Newtown Square, PA 19073
//Newtown Square

var ff = decodeURIComponent($.request.parameters.get("sevent"));
var cy = decodeURIComponent($.request.parameters.get("link"));

//3999 West Chester Pike Newtown Square, PA 19073
//Newtown Square
//3410 Hillview Avenue Palo Alto, CA 94304
//Palo Alto
//SAP Palo Alto - SAP Cloud Platform Podcast
//25
//var ff = '3999 West Chester Pike Newtown Square, PA 19073';
//var cy = 'Newtown Square';

var body_geo = '{ "addressInput": { ' +
	//  	'"FreeForm": "3410 Hillview Avenue Palo Alto, CA 94304", ' +
	'"FreeForm": "' + ff + '", ' +
	'"COUNTRY": "US", ' +
	'"BOL": "SAP", ' +
	//    '"CITY": "Palo Alto", ' +
	'"CITY": "' + cy + '", ' +
	'"POSTCODE": "" ' +
	'}, ' +
	'"addressSettings": { ' +
	'"processingMode": "both", ' +
	'"casing": "mixed", ' +
	'"diacritics": "include", ' +
	'"streetFormat": "countryCommonStyle", ' +
	'"postalFormat": "countryCommonStyle", ' +
	'"regionFormat": "countryCommonStyle", ' +
	'"scriptConversion": "none", ' +
	'"minAssignmentLevel": "none", ' +
	'"geoAssign": "best", ' +
	'"suggestionSuppressLevel": "none" ' +
	'}, ' +
	'"configurationName": "GEOwithCITY" ' +
	'}';

/*
var body_geo = {
  addressInput: {
  	FreeForm: '3410 Hillview Avenue Palo Alto, CA 94304',
    COUNTRY: 'US',
    BOL: 'SAP',
    CITY: 'Palo Alto',
    POSTCODE: ''
  },
    addressSettings: {
    processingMode: 'both',
    casing: 'mixed',
    diacritics: 'include',
    streetFormat: 'countryCommonStyle',
    postalFormat: 'countryCommonStyle',
    regionFormat: 'countryCommonStyle',
    scriptConversion: 'none',
    minAssignmentLevel: 'none',
    geoAssign: 'best',
    suggestionSuppressLevel: 'none'
  },
  configurationName: 'GEOwithCITY'
};
*/

var call = '/dq/addressCleanse';

var dest = $.net.http.readDestination(destination_package, destination_name);
var client = new $.net.http.Client();
var req = new $.web.WebRequest($.net.http.POST, call);

var bearer_code = readBearer;
var hb = 'Bearer ' + bearer_code;

req.headers.set('Accept-Language', 'en');
req.headers.set('Content-Type', 'application/json; charset=UTF-8');
req.headers.set('Authorization', hb);
req.setBody(body_geo);

client.request(req, dest);
var response = client.getResponse();
var body = response.body.asString();
var obj = JSON.parse(body);
client.close();
$.response.contentType = "application/json;charset=utf-8";
$.response.setBody(JSON.stringify({
	"LON": obj.LON,
	"LAT": obj.LAT

}));