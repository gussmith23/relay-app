import RFID
import signal
import time

rdr = RFID.RFID()

print "test1"

while True:
    print "test"
    #Request tag
    (error,data) = rdr.request() # This line is crashing
    #if not error:
    #    (error, uid) = rdr.anticoll()
    #    if not error:
            #Print UID
    #        print uid
        
            #time.sleep(1)
