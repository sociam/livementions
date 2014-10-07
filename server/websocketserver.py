'''
Created on 7 Oct 2014

@author: petros
'''
from autobahn.twisted.websocket import WebSocketServerProtocol, \
                                       WebSocketServerFactory

import json
from twisted.internet.defer import Deferred, \
                                   inlineCallbacks, \
                                   returnValue
from twitterauth import *

def sleep(delay):
    d = Deferred()
    reactor.callLater(delay, d.callback, None)
    return d


class SMServerProtocol(WebSocketServerProtocol):

    #def onConnect(self, request):
    def onOpen(self):
        reactor.callLater(1,self.startStreaming)
    
    def startStreaming(self):
        auth = TwitterAuth()
        openstream = auth.getStream()
        i=0
        for item in openstream:
            if i > 4:
                break
            i = i+1
            #check connection lost!
            tweetstr = json.dumps(item).encode('utf8')
            print (tweetstr)
            self.sendMessage(tweetstr)
        print("All done!")
        self.sendClose(1000)

        
if __name__ == '__main__':

    import sys

    from twisted.python import log
    from twisted.internet import reactor

    log.startLogging(sys.stdout)

    factory = WebSocketServerFactory("ws://localhost:1234")
    factory.protocol = SMServerProtocol

    reactor.listenTCP(1234, factory)
    reactor.run()