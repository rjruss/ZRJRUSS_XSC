function store(key, value1) {
  var config = {
    name: key,
    value: value1
  };

  var aStore = new $.security.Store("localGEOStore.xssecurestore");
  aStore.store(config);
  $.response.status = $.net.http.OK;
}

function read(key) {
  var config = {
    name: key.toString()
  };

  try {
    var store1 = new $.security.Store("localGEOStore.xssecurestore");
    var value1 = store1.read(config);
    $.response.setBody(value1.toString());
    $.response.status = $.net.http.OK;
  }
  catch(ex) {
    $.response.setBody(ex.message.toString());
    $.response.status = $.net.http.BAD_REQUEST;
  }
}

function deleteKey(key) {
  var config = {
    name: key
  };

  try {
    var store2 = new $.security.Store("localGEOStore.xssecurestore");
    store2.remove(config);
    $.response.status = $.net.http.OK;
  }
  catch(ex) {
    $.response.setBody(ex.message.toString());
    $.response.status = $.net.http.BAD_REQUEST;
  }
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "store":
      var body = $.request.body.asString();
        var entry = JSON.parse(body);

        var key = encodeURI(entry.key);
        var value = encodeURI(entry.value);
//var key='1';
//var value='a';

        store(key, value);
        break;
    case "read":
        var key2 = $.request.parameters.get('key');
        read(key2);
//        read('twsec');
        break;
    case "delete":
         var key1 = encodeURI($.request.parameters.get('key'));
        deleteKey(key1);
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Invalid Command');
}
