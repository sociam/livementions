'''
Created on 6 Oct 2014

@author: petros
'''
#from twisted.internet  import reactor, protocol, defer
from autobahn.twisted.websocket import WebSocketServerProtocol, WebSocketServerFactory

class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))
    def onOpen(self):
        print("WebSocket connection open.")
    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))
            ## echo back message verbatim
            self.sendMessage(payload, isBinary)
    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))
    
if __name__ == '__main__':
    import sys
    from twisted.python import log
    from twisted.internet import reactor
    log.startLogging(sys.stdout)
    factory = WebSocketServerFactory("ws://localhost:1234", debug = False)
    factory.protocol = MyServerProtocol
    reactor.listenTCP(1234, factory)
    reactor.run()