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
//    $.response.setBody(value1.toString());
//    $.response.status = $.net.http.OK;
    return value1;
  }
  catch(ex) {
//    $.response.setBody(ex.message.toString());
//    $.response.status = $.net.http.BAD_REQUEST;
    return 'error';
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

