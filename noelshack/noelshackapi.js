loadQtBindings('qt.core', 'qt.network');

var NoelShack = {};

NoelShack.netManager = new QNetworkAccessManager();

NoelShack.replyFinished = function(reply) {
    NoelShack.queryFinished = true;
};

NoelShack.replyError = function(networkError) {
    print(networkError.errorString);
    NoelShack.queryError = true;
};

NoelShack.netManager.finished.connect(NoelShack.replyFinished);

NoelShack.uploadImage = function(name, image) {
    var url = new QUrl('http://www.noelshack.com/api.php');
    var request = new QNetworkRequest(url);

    var bytes = new QByteArray();
    bytes.append('--onche\r\n');
    bytes.append('Content-Disposition: form-data; name="fichier"; filename="' + name + '"\r\n');
    bytes.append('Content-Type: application/octet-stream\r\n');
    bytes.append('\r\n');
    bytes.append(image);
    bytes.append('\r\n');
    bytes.append('--onche--\r\n');

    request.setHeader(QNetworkRequest.ContentTypeHeader, 'multipart/form-data; boundary=onche');
    request.setHeader(QNetworkRequest.ContentLengthHeader, bytes.length());

    var reply = NoelShack.netManager.post(request, bytes);

    reply.error.connect(NoelShack.replyError);
    NoelShack.queryFinished = false;
    NoelShack.queryError = false;

    var eventLoop = new QEventLoop();

    while (!NoelShack.queryFinished) {
       eventLoop.processEvents(QEventLoop.WaitForMoreEvents);
    }

    var replyText = NoelShack.bytesToString(reply.readAll());

    if (NoelShack.queryError || replyText === '') {
        return false;
    }

    return replyText.replace(/www\.noelshack\.com\/(\d+)-(\d+)-(.+)/, 'image.noelshack.com/fichiers/$1/$2/$3');
};

NoelShack.bytesToString = function (bytes) {
    var string = '';

    for (var i = 0, length = bytes.length(); i < length; i++) {
        string += String.fromCharCode(bytes.at(i));
    }

    return string;
};
