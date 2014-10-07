'''
Created on 6 Oct 2014

@author: petros
'''

from autobahn.twisted.websocket import WebSocketClientProtocol, \
                                       WebSocketClientFactory

import json, random


class SlowSquareClientProtocol(WebSocketClientProtocol):

    def onMessage(self, payload, isBinary):
        print ("Message received!")
        if not isBinary:
            res = json.loads(payload.decode('utf8'))
            print("Result received: {}".format(res))
            #self.sendClose()

    def onClose(self, wasClean, code, reason):
        if reason:
            print(reason)
        reactor.stop()



if __name__ == '__main__':

    import sys

    from twisted.python import log
    from twisted.internet import reactor

    log.startLogging(sys.stdout)

    factory = WebSocketClientFactory("ws://localhost:1234", debug = False)
    factory.protocol = SlowSquareClientProtocol

    reactor.connectTCP("127.0.0.1", 1234, factory)
    reactor.run()