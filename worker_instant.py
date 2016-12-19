import googlemaps
from datetime import *
#import polyline
import json
import math
import pprint

key = 'AIzaSyB45rLge0qJX25y20ejv_B9iJG-mHLwt5E'
gmaps = googlemaps.Client(key=key)
#print time(9,16,55)
drivers = {
    "Paul": [[40.61862, -74.03071], [40.70609, -73.99686]],
    "Alice": [[40.83275, -72.99247], [40.71278, -74.00594]],
    "Ashwin": [[40.77113, -73.97419], [40.82563, -73.93024]],
    "Prathamesh": [[40.84520, -73.87388], [40.84520, -73.87388]],
    "Harsh": [[40.69462, -73.98563], [40.75901, -73.98447]],
    "Raj": [[40.68418, -73.97517], [40.75901, -73.98447]]
}
driverschedule = {
    "Paul": datetime(2000,1,1,9,16,55),        #hr,min,sec
    "Alice": datetime(2000,1,1,9,16,55),
    "Ashwin": datetime(2000,1,1,9,16,55),
    "Prathamesh": datetime(2000,1,1,9,16,55),
    "Harsh": datetime(2000,1,1,9,16,55),
    "Raj": datetime(2000,1,1,9,16,55)
}
ridername = "Chris"
rider = [[40.63241, -74.02958], [40.69462, -73.98563]]
riderschedule = datetime(2000,1,1,9,30,0)
drivermemo ={}

# Geocoding an address
#geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')
#rint geocode_result

# Look up an address with reverse geocoding
#reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
#now = datetime.now()

def getMiles(i):
    return i * 0.000621371192


matrix = []
pp = pprint.PrettyPrinter(indent=4)
for drivername, drivervalue in drivers.iteritems(): 
    print drivername
    if (drivername not in drivermemo) or (len(drivermemo[drivername])<2):
            origins = [{"lat": drivervalue[0][0],"lng": drivervalue[0][1]},{"lat": drivervalue[1][0],"lng": drivervalue[1][1]}]
            destinations = [{"lat": rider[0][0],"lng": rider[0][1]},{"lat": rider[1][0],"lng": rider[1][1]}]
            matrix = gmaps.distance_matrix(origins, destinations,mode="driving")
            start_distance = getMiles(matrix["rows"][0]["elements"][0]["distance"]["value"])
            start_time = matrix["rows"][0]["elements"][0]["duration"]["value"]
            end_distance = getMiles(matrix["rows"][1]["elements"][1]["distance"]["value"])
            end_time = matrix["rows"][1]["elements"][1]["duration"]["value"]
            #l = ((driverschedule[drivername]+timedelta(seconds=start_time))-riderschedule)
            #print l.total_seconds()
            if((start_distance<=3.0 and abs(((driverschedule[drivername]+timedelta(seconds=start_time))-riderschedule).total_seconds())<=1000) and end_distance<=3.0):
                if(drivername not in drivermemo):
                    drivermemo[drivername] = []
                drivermemo[drivername].append(ridername)
            print(str(start_distance)+" "+str(start_time)+" -> "+str(end_distance)+" "+str(end_time))
            
print drivermemo
            
            