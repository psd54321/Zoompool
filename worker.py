import googlemaps
from datetime import *
import polyline
import json
import math
import MySQLdb


key = 'AIzaSyCaiXqS-_gbYOJh9N_SfktWaaqvXI3yl1A'
gmaps = googlemaps.Client(key=key)
db = MySQLdb.connect("zoompooldb.cjofwze7tr75.us-west-2.rds.amazonaws.com","root","ashwin92","dbzpool" )
cursor = db.cursor()
sql = "SELECT c.email, c.homelat, c.homelong, c.worklat, c.worklong, t.ridetype, t.time1, t.time2, t.date, t.allocated,t.tripid FROM customer as c, trip as t where c.email=t.email and t.allocated = 0 order by homelat, homelong, worklat, worklong";
drivers = {}
riders = {} 
driverschedule = {}
riderschedule = {}
driverdate = {}
riderdate = {}
# Execute the SQL command
cursor.execute(sql)
# Fetch all the rows in a list of lists.
results = cursor.fetchall()
for row in results:
  email = row[0]
  #print email
  homelat = float(row[1])
  #print homelat
  homelong = float(row[2])
  #print homelong
  worklat = float(row[3])
  #print worklat
  worklong = float(row[4])
  #print worklong
  ridetype = row[5]
  #print ridetype
  time1 = row[6]
  #print time1
  time2 = row[7]
  #print time2
  date1 = row[8]
  #print date1
  allocated = row[9]
  #print allocated
  tripid = row[10]
  #print date1
  if ridetype == "driver":
        if((datetime.min+time1).time()>time() and date1>=date.today()):
            drivers[str(tripid)] = []
            drivers[str(tripid)].append([homelat,homelong])
            drivers[str(tripid)].append([worklat,worklong])
            driverschedule[str(tripid)] = []
            driverschedule[str(tripid)].append(time1)
            driverschedule[str(tripid)].append(time2)
            driverdate[str(tripid)] = date1
  else:
        if((datetime.min+time1).time()>time() and date1>=date.today()):
            riders[str(tripid)] = []
            riders[str(tripid)].append([homelat,homelong])
            riders[str(tripid)].append([worklat,worklong])
            riderschedule[str(tripid)] = []
            riderschedule[str(tripid)].append(time1)
            riderschedule[str(tripid)].append(time2)
            riderdate[str(tripid)] = date1 

# disconnect from server
#print riderschedule
#print driverschedule

#db.close()
'''drivers = {
    "Paul": [[40.61862, -74.03071], [40.70609, -73.99686]],
    "Alice": [[40.83275, -72.99247], [40.71278, -74.00594]]
}
riders = {
    "Chris": [[40.63241, -74.02958], [40.69462, -73.98563]],
    "Ashwin": [[40.77113, -73.97419], [40.82563, -73.93024]],
    "Prathamesh": [[40.84520, -73.87388], [40.84520, -73.87398]],
    "Harsh": [[40.69462, -73.98563], [40.75901, -73.98447]],
    "Raj": [[40.68418, -73.97517], [40.75901, -73.98447]]
}'''
drivermemo ={}

# Geocoding an address
#geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')
#print geocode_result

# Look up an address with reverse geocoding
#reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
now = datetime.now()

def getMiles(i):
    return i * 0.000621371192

# internal helper functions =========================================
# Convert from geographic to geocentric latitude (radians).
def bdccGeoGeocentricLatitude(geographicLatitude) :
    flattening = 1.0 / 298.257223563  #WGS84
    f = (1.0 - flattening) * (1.0 - flattening) 
    return math.atan((math.tan(geographicLatitude) * f)) 
    
# Returns the two antipodal points of intersection of two great
# circles defined by the arcs geo1 to geo2 and
# geo3 to geo4. Returns a point as a Geo, use .antipode to get the other point

def bdccGeoGetIntersection(geo1, geo2, geo3, geo4) :
    geoCross1 = geo1.crossNormalize(geo2) 
    geoCross2 = geo3.crossNormalize(geo4) 
    return geoCross1.crossNormalize(geoCross2) 
    
def bdccGeoRadiansToMeters(rad) :
    return rad * 6378137.0  # WGS84 Equatorial Radius in Meters

#from Meters to Radians
def bdccGeoMetersToRadians(m) :
    return m / 6378137.0  # WGS84 Equatorial Radius in Meters\

def bdccGeoDistanceToPolyMtrs(poly, lat, lang) :
    d = 999999999
    p = bdccGeo(lat, lang)
    for i in range(0,len(poly) - 1):
        p1 = poly[i] 
        #console.log(p1[0],p1[1]) 
        l1 = bdccGeo(p1[0], p1[1]) 
        p2 = poly[i + 1] 
        l2 = bdccGeo(p2[0], p2[1]) 
        dp = p.distanceToLineSegMtrs(l1, l2) 
        if (dp < d):
            d = dp 
    return d 
    
class bdccGeo:
    def __init__(self, lat, lon):
        theta = (lon * math.pi / 180.0)
        rlat = bdccGeoGeocentricLatitude(lat * math.pi / 180.0)
        c = math.cos(rlat)
        self.x = c * math.cos(theta) 
        self.y = c * math.sin(theta) 
        self.z = math.sin(rlat) 


        # properties =================================================
    def getLatitudeRadians(self) :
        return (bdccGeoGeographicLatitude(math.atan2(self.z, math.sqrt((self.x * self.x) + (self.y * self.y))))) 

    def getLongitudeRadians(self) :
        return (math.atan2(self.y, self.x)) 
        
    def getLatitude(self) :
        return self.getLatitudeRadians() * 180.0 / math.pi 
        
    def getLongitude(self) :
        return self.getLongitudeRadians() * 180.0 / math.pi 
        
        # Methods =================================================
        # Maths
    def dot(self, b):
        return ((self.x * b.x) + (self.y * b.y) + (self.z * b.z)) 
        
        #More Maths
    def crossLength(self, b) :
        x = (self.y * b.z) - (self.z * b.y) 
        y = (self.z * b.x) - (self.x * b.z) 
        z = (self.x * b.y) - (self.y * b.x) 
        return math.sqrt((x * x) + (y * y) + (z * z)) 
        #More Maths
    
    def scale(self,s):
        r = bdccGeo(0, 0) 
        r.x = self.x * s 
        r.y = self.y * s 
        r.z = self.z * s 
        return r 
        #More Maths
    def crossNormalize(self,b) :
        x = (self.y * b.z) - (self.z * b.y) 
        y = (self.z * b.x) - (self.x * b.z) 
        z = (self.x * b.y) - (self.y * b.x) 
        L = math.sqrt((x * x) + (y * y) + (z * z)) 
        r = bdccGeo(0, 0) 
        r.x = x / L 
        r.y = y / L 
        r.z = z / L 
        return r 
    
        #point on opposite side of the world to this point
    def antipode(self) :
        return self.scale(-1.0) 
        
        #distance in radians from this point to point v2
    def distance(self, v2) :
        return math.atan2(v2.crossLength(self), v2.dot(self)) 
        
        #returns in meters the minimum of the perpendicular distance of this point from the line segment geo1-geo2
        #and the distance from this point to the line segment ends in geo1 and geo2 
    def distanceToLineSegMtrs(self,geo1, geo2) :
        #point on unit sphere above origin and normal to plane of geo1,geo2
        #could be either side of the plane
        p2 = geo1.crossNormalize(geo2) 
        #intersection of GC normal to geo1/geo2 passing through p with GC geo1/geo2
        ip = bdccGeoGetIntersection(geo1, geo2, self, p2) 
        #need to check that ip or its antipode is between p1 and p2
        d = geo1.distance(geo2) 
        d1p = geo1.distance(ip) 
        d2p = geo2.distance(ip) 
        #window.status = d + ", " + d1p + ", " + d2p 
        if ((d >= d1p) and (d >= d2p)):
            return bdccGeoRadiansToMeters(self.distance(ip)) 
        else :
            ip = ip.antipode() 
            d1p = geo1.distance(ip) 
            d2p = geo2.distance(ip) 
        if ((d >= d1p) and (d >= d2p)): 
            return bdccGeoRadiansToMeters(this.distance(ip)) 
        else:
            return bdccGeoRadiansToMeters(min(geo1.distance(self), geo2.distance(self))) 
        # distance in meters from GLatLng point to GPolyline or GPolygon poly


for drivername, drivervalue in drivers.iteritems():
    
    #print drivername
    drivermemo[drivername] = []
    waypoint = ""
    for num in range(1,3):
        if(num==1):
            waypoint = ""
        r = ""
        minimum = -1
        coordinates = -1
        #print "++++++++++++++++++++++++++++++"
        for ridername, ridervalue in riders.iteritems():
            #print ridername
            if(riderdate[ridername]==driverdate[drivername]):
                origins = [{"lat": drivervalue[0][0],"lng": drivervalue[0][1]},{"lat": drivervalue[1][0],"lng": drivervalue[1][1]}]
                destinations = [{"lat": ridervalue[0][0],"lng": ridervalue[0][1]},{"lat": ridervalue[1][0],"lng": ridervalue[1][1]}]
                matrix = gmaps.distance_matrix(origins, destinations,mode="driving")
                start_distance = getMiles(matrix["rows"][0]["elements"][0]["distance"]["value"])
                start_time = matrix["rows"][0]["elements"][0]["duration"]["value"]
                end_distance = getMiles(matrix["rows"][1]["elements"][1]["distance"]["value"])
                end_time = matrix["rows"][1]["elements"][1]["duration"]["value"]
                #print str(drivername)+" "+str(ridername)+" "+str(start_distance);
                #print str(drivername)+" "+str(ridername)+" "+str(end_distance);
                newdrivertime1 = driverschedule[drivername][0]+timedelta(seconds=start_time)
                newdrivertime2 = driverschedule[drivername][1]+timedelta(seconds=start_time)
                #print str(drivername)+" "+str(ridername)+" start:"+str(newdrivertime1)+" end:"+str(newdrivertime2)
                #print riderschedule[ridername][0]>=newdrivertime1
                if((riderschedule[ridername][0]>=newdrivertime1 and riderschedule[ridername][0]<=newdrivertime2) or (riderschedule[ridername][0]<=newdrivertime1 and riderschedule[ridername][1]>=newdrivertime2) or (riderschedule[ridername][1]>=newdrivertime1 and riderschedule[ridername][1]<=newdrivertime2)):
                    results = ""
                    if (waypoint == ""):
                        results = gmaps.directions(str(drivers[drivername][0][0]) + "," + str(drivers[drivername][0][1]),
                                             str(drivers[drivername][1][0]) + "," + str(drivers[drivername][1][1]),
                                             mode="driving",
                                             departure_time=now)
                    else:
                        results = gmaps.directions(str(drivers[drivername][0][0]) + "," + str(drivers[drivername][0][1]),
                                             str(drivers[drivername][1][0]) + "," + str(drivers[drivername][1][1]),
                                             mode="driving",
                                             waypoints=[waypoint],
                                             optimize_waypoints=True,
                                             departure_time=now)
                    dbeg = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results[0]['overview_polyline']['points']), riders[ridername][0][0], riders[ridername][0][1]))
                    dend = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results[0]['overview_polyline']['points']), riders[ridername][1][0], riders[ridername][1][1]))

                    dis = []
                    if(dbeg > dend):
                        dis.append(dend)
                    else:
                        dis.append(dbeg)
                    if(dbeg > dend):
                        dis.append(1)
                    else:
                        dis.append(0)

                    if ((dis[0] <= 1 and minimum == -1) or (dis[0] <= 1 and dis[0] < minimum)):
                        minimum = dis[0]
                        r = ridername
                        coordinates = dis[1]
                    #print minimum
                    #print minimum
        if(r in riders):
            drivermemo[drivername].append(str(r)+" "+str(riderschedule[r][0]))
            waypoint = str(riders[r][coordinates][0]) + "," + str(riders[r][coordinates][1])
            riders.pop(r,None)

#print drivermemo
#print str(cursor)
for allocation,allocationlist in drivermemo.iteritems():
    if len(allocationlist) == 2 or len(allocationlist)==1:
        sql = "update trip set allocated=%d where tripid=%d" % (1,int(allocation));
        #print sql;
        cursor.execute(sql)
        db.commit()
    for rider in allocationlist:
        sql = "update trip set allocated=%d where tripid=%d" % (1,int(rider.split(" ")[0]));
        #print sql;
        cursor.execute(sql)
        db.commit()
    sql = "select * from confirmedtrip where tripID = '"+allocation+"'";
    cursor.execute(sql)
    # Fetch all the rows in a list of lists.
    results = cursor.fetchall()
    if(len(results)>0):
        if(len(allocationlist)==2):
            sql = "update confirmedtrip set driver = '"+allocation+"', rider1='"+allocationlist[0].split(" ")[0]+"', rider1_time='"+allocationlist[0].split(" ")[1]+"',rider2='"+allocationlist[1].split(" ")[0]+"',rider2_time='"+allocationlist[1].split(" ")[1]+"' where tripID ='" +allocation+"'";
            cursor.execute(sql)
            db.commit()
        elif(len(allocationlist)==1):
            sql = "update confirmedtrip set driver = '"+allocation+"', rider1='"+allocationlist[0].split(" ")[0]+"', rider1_time='"+allocationlist[0].split(" ")[1]+"' where tripID ='" +allocation+"'";
            cursor.execute(sql)
            db.commit()
    
    else:
        if(len(allocationlist)==2):
            sql = "insert into confirmedtrip(tripID,driver,rider1,rider1_time,rider2,rider2_time) values ('" +allocation+"','"+allocation+"','"+allocationlist[0].split(" ")[0]+"', '"+allocationlist[0].split(" ")[1]+"','"+allocationlist[1].split(" ")[0]+"','"+allocationlist[1].split(" ")[1]+"')";
            #print sql;
            cursor.execute(sql)
            db.commit()
        elif(len(allocationlist)==1):
            sql = "insert into confirmedtrip(tripID,driver,rider1,rider1_time) values ('" +allocation+"','"+allocation+"','"+allocationlist[0].split(" ")[0]+"', '"+allocationlist[0].split(" ")[1]+"')";
            cursor.execute(sql)
            db.commit()
print drivermemo
    

db.close()
    
 
    
            
            
