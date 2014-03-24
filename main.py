from PythonQt.QtCore import QFile
from PythonQt.QtGui import QDesktopServices, QMessageBox
import ScreenCloud
from pynoelshack import NoelShack, NoelShackError
import time


class NoelShackUploader():
    def showSettingsUI(self, parentWidget):
        QMessageBox.information(parentWidget,
                                'NoelShack',
                                'This plugin has no settings.')

    def isConfigured(self):
        return True

    def getFilename(self):
        return ScreenCloud.formatFilename('screenshot')

    def upload(self, screenshot, name):
        temp = QDesktopServices.storageLocation(QDesktopServices.TempLocation)
        file = temp + '/' + name

        screenshot.save(QFile(file), ScreenCloud.getScreenshotFormat())

        ns = NoelShack()

        try:
            url = ns.upload(file)
        except NoelShackError as e:
            ScreenCloud.setError(str(e))
            return False

        ScreenCloud.setUrl(url)
        return True
