'''
Created on 6 Oct 2014

@author: petros

Simple http server over port 1234.
Sends a timestamp every 2 seconds.
Uses html/javascript through template index.html.
'''
from twisted.protocols import basic
from twisted.internet  import reactor, protocol, defer
import datetime
 
class WebPUSH(basic.LineReceiver):
    logTemplate = '''
      <script type="text/javascript">
         pushHandler.addLi('%s')
      </script>
    '''
    def __init__(self):
        self.gotRequest = False
 
    def lineReceived(self, line):
        if not self.gotRequest:
            self.startResponse()
            self.gotRequest = True
             
    def startResponse(self):
        self.sendLine('HTTP/1.1 200 OK')
        self.sendLine('Content-Type: text/html; charset=utf-8')
        self.sendLine('')
        with open('index.html', 'r') as f:
            self.transport.write( ''.join(f.read()) )
         
        self.logTime()
 
    def logTime(self):
        self.sendLine( self.logTemplate % datetime.datetime.now() )
        reactor.callLater(2, self.logTime)
 
if __name__ == '__main__':
    f = protocol.ServerFactory()
    f.protocol = WebPUSH
    reactor.listenTCP(1234, f)
    reactor.run()