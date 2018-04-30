//http://scn.sap.com/community/developer-center/hana/blog/2013/07/01/sap-hana-sps6--various-new-developer-features
//http://scn.sap.com/docs/DOC-33902
//https://help.sap.com/saphelp_hanaplatform/helpdata/en/20/9ddefe75191014ac249bf78ba2a1e9/content.htm?frameset=/en/d2/2ecca9d2951014850492e8c88d498c/frameset.htm&current_toc=/en/2e/1ef8b4f4554739959886e55d4c127b/plain.htm&node_id=140&show_children=true#jump140
var rs = null;
var statement = null;
var conn = $.db.getConnection();
var sevent = $.request.parameters.get("sevent");
var link = $.request.parameters.get("link");
var lat = $.request.parameters.get("lat");
var lon = $.request.parameters.get("lon");
if (sevent) {
	var pstmt;
	var query =
		'UPSERT "RJRUSSLOC"."rjruss.neogeoxsc::LOCATION" ' +
		'VALUES(?, ?, ?, ?) ' +
		'WHERE "EVENT"   = ? ';
	pstmt = conn.prepareStatement(query);
	pstmt.setString(1, sevent);
	pstmt.setString(2, link);
	pstmt.setString(3, lat);
	pstmt.setString(4, lon);
	pstmt.setString(5, sevent);
	pstmt.executeUpdate();
	pstmt.close();
	conn.commit();
	conn.close();
}