loadQtBindings('qt.core', 'qt.gui','qt.network');
include('noelshackapi.js');

var format = 'png';

function init() {
    ScreenCloud.setConfigured(true);
}

function loadSettings() {
    format = settings.value('format', 'png').toString();
    ScreenCloud.setConfigured(true);
    ScreenCloud.setFilename('screenshot.' + format);
}

function saveSettings() {
    // No settings for this plugin.
}

function setupSettingsUi(preferencesDialog) {
    QMessageBox.information(preferencesDialog, 'NoelShack plugin', 'This plugin has no settings yet.');
}

function upload(screenshot) {
    var image = new QByteArray();
    var buffer = new QBuffer(image);

    buffer.open(QIODevice.WriteOnly);
    screenshot.save(buffer, format);
    buffer.close();

    var reply = NoelShack.uploadImage(ScreenCloud.getFilename(), image);

    if (reply === false) {
        ScreenCloud.error('Failed to upload the screenshot on NoelShack.');
    } else {
        ScreenCloud.finished(reply);
    }
}
