import RFID
import signal
import time
import json
import urllib2
import binascii

rdr = RFID.RFID()

while True:

    #Request tag
    (error,data) = rdr.request()
    
    if not error:
        
        (error, uid) = rdr.anticoll()
        
        if not error:

          # Turn uid into hex string
          uid_string = ''.join('{:02x}'.format(x) for x in uid)

          # Make JSON
          data = {
            'uid' : uid_string,
            #'time' : time.time();
          }
          
          # Print JSON
          print data

          # POST data to Node server.
          req = urllib2.Request('http://127.0.0.1:3000/new-uid')
          req.add_header('Content-Type', 'application/json')
          response = urllib2.urlopen(req, json.dumps(data))
        
          print "Got response code " + str(response.getcode())

          #time.sleep(1)
