
config = {}
config['oauth_token'] = "2810403113-jjh8vYh8SC6irpNuwRURGKRJjrqisYIAhndzSh3"
config['oauth_token_secret'] = "lT6xkVFlUt9HIutjdZWMcGdhm6EERHzGkJ76rA84yyBpV"
config['key'] = "TAiLy0AYu7LR0P6Xq1Eb9YosO"
config['secret'] = "h404KjmXnx1IqO0ohUXy4WqpUHSJfMnJfAUzGSxkSiyG73IuUJ"

from twitter import *
import datetime
import json
 
class TwitterAuth():
    def getStream(self):
        ts = TwitterStream(
                    auth=OAuth(
                        config['oauth_token'],
                        config['oauth_token_secret'],
                        config['key'],
                        config['secret']
                        )
                    )
#openstream = ts.statuses.filter(track=words)
        openstream = ts.statuses.sample()
        return openstream

if __name__ == '__main__':
    auth = TwitterAuth()
    openstream = auth.getStream()
    for item in openstream:
        tweet = json.dumps(item)
        print tweet

#    print item['user']['screen_name'], datetime.strptime(item['created_at'],'%a %b %d %H:%M:%S +0000 %Y'), item['text']
#    if datetime.now() > stop:
#        print datetime.now().isoformat()
#        break

