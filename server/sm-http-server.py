'''
Created on 6 Oct 2014

@author: petros
'''

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
import json
from twitterauth import *

class WebPUSH(basic.LineReceiver):
    def __init__(self):
        self.gotRequest = False
 
    def lineReceived(self, line):
        if not self.gotRequest:
            self.startResponse()
            self.gotRequest = True
             
    def startResponse(self):
        #self.sendLine('HTTP/1.1 200 OK')
        #self.sendLine('Content-Type: application/json')
        #self.sendLine('')

        auth = TwitterAuth()
        openstream = auth.getStream()
        for item in openstream:
            #check connection lost!
            tweetstr = json.dumps(item)
            print (tweetstr)
            self.sendLine(tweetstr)
            
#    def logTime(self):
#        self.sendLine( self.logTemplate % datetime.datetime.now() )
#        reactor.callLater(2, self.logTime)
 
if __name__ == '__main__':
    f = protocol.ServerFactory()
    f.protocol = WebPUSH
    reactor.listenTCP(1234, f)
    reactor.run()