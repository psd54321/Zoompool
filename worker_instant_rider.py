import googlemaps
from datetime import *
#import polyline
import json
import math
import pprint
import sys

import MySQLdb


key = 'AIzaSyCaiXqS-_gbYOJh9N_SfktWaaqvXI3yl1A'
gmaps = googlemaps.Client(key=key)
db = MySQLdb.connect("zoompooldb.cjofwze7tr75.us-west-2.rds.amazonaws.com","root","ashwin92","dbzpool" )
cursor = db.cursor()
sql = "SELECT c.email, c.homelat, c.homelong, c.worklat, c.worklong, t.ridetype, t.time1, t.time2, t.date, t.allocated,t.tripid FROM customer as c, trip as t where c.email=t.email and t.allocated = 0 order by homelat, homelong, worklat, worklong";
drivers = {}

driverschedule = {}


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
#print time(9,16,55)
'''drivers = {
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
}'''
ridername = sys.argv[1]
#ridername = '7'
sql = "SELECT c.email, c.homelat, c.homelong, c.worklat, c.worklong, t.ridetype, t.time1, t.time2, t.date, t.allocated,t.tripid FROM customer as c, trip as t where c.email=t.email and t.tripid = '"+ridername+"'";
#print sql
cursor.execute(sql)
results = cursor.fetchall()
riderschedule = []
rider = []
riderschedule.append(results[0][6])
riderschedule.append(results[0][7])
#riderschedule[str(tripid)].append(time2)
#rider = [[40.63241, -74.02958], [40.69462, -73.98563]]
rider.append([float(results[0][1]),float(results[0][2])])
rider.append([float(results[0][3]),float(results[0][4])])
#riderschedule = datetime(2000,1,1,9,30,0)
#print str(results[0][6])
drivermemo ={}
#print rider
def getMiles(i):
    return i * 0.000621371192

sql = "SELECT * from confirmedtrip";
cursor.execute(sql)
results = cursor.fetchall()
for row in results:
    tripid = row[0]
    rider1_time = row[1]
    driver = row[2]
    rider1 = row[3]
    rider2 = row[4]
    rider2_time = row[5]
    ridedate = row[6]
    drivermemo[driver]=[]
    if(rider1 != None):
        drivermemo[driver].append(rider1+" "+str(rider1_time))
    if(rider2 != None):
        drivermemo[driver].append(rider2+" "+str(rider2_time))
#print drivermemo    
#print rider
#print drivers
matrix = []

#pp = pprint.PrettyPrinter(indent=4)
for drivername, drivervalue in drivers.iteritems(): 
    #print drivername
    if (drivername not in drivermemo) or (len(drivermemo[drivername])<2):
            #print str(drivervalue[0][0])+" "+str(drivervalue[0][1])+"::::"+str(drivervalue[1][0])+" "+ str(drivervalue[1][1])
            #print str(rider[0][0])+" "+str(rider[0][1])+"::::"+str(rider[1][0])+" "+str(rider[1][1])
            origins = [{"lat": drivervalue[0][0],"lng": drivervalue[0][1]},{"lat": drivervalue[1][0],"lng": drivervalue[1][1]}]
            destinations = [{"lat": rider[0][0],"lng": rider[0][1]},{"lat": rider[1][0],"lng": rider[1][1]}]
            matrix = gmaps.distance_matrix(origins, destinations,mode="driving")
            #print str(getMiles(matrix["rows"][0]["elements"][0]["distance"]["value"]))+" "+str(getMiles(matrix["rows"][0]["elements"][1]["distance"]["value"]))+" "+str(getMiles(matrix["rows"][1]["elements"][0]["distance"]["value"]))+" "+str(getMiles(matrix["rows"][1]["elements"][1]["distance"]["value"]))
            start_distance = getMiles(matrix["rows"][0]["elements"][0]["distance"]["value"])
            start_time = matrix["rows"][0]["elements"][0]["duration"]["value"]
            end_distance = getMiles(matrix["rows"][1]["elements"][1]["distance"]["value"])
            end_time = matrix["rows"][1]["elements"][1]["duration"]["value"]
            #l = ((driverschedule[drivername]+timedelta(seconds=start_time))-riderschedule)
            #print l.total_seconds()
            #print "START DISTANCE:"+str(start_distance)
            #print (driverschedule[drivername][0]+timedelta(seconds=start_time))<=riderschedule[0]
            #print ((driverschedule[drivername][1]+timedelta(seconds=start_time))>=riderschedule[0])
            #print (driverschedule[drivername][0]+timedelta(seconds=start_time))
            #print (driverschedule[drivername][1]+timedelta(seconds=start_time))
            #print riderschedule[0]
            #print "END DISTANCE: "+str(end_distance)
            if(start_distance<=3.0 and ((driverschedule[drivername][0]+timedelta(seconds=start_time))<=riderschedule[0]) and ((driverschedule[drivername][1]+timedelta(seconds=start_time))>=riderschedule[0]) and end_distance<=3.0):              #atmost 3miles of distance, reduce to 1 mile
                if(drivername not in drivermemo):
                    drivermemo[drivername] = []
                drivermemo[drivername].append(ridername+" "+str(riderschedule[0]))
                sql = "select * from confirmedtrip where tripID = '"+drivername+"'";
                cursor.execute(sql)
                # Fetch all the rows in a list of lists.
                if len(drivermemo[drivername]) == 2 or len(drivermemo[drivername]) == 1 :
                    sql = "update trip set allocated=%d where tripid=%d" % (1,int(drivername));
                    #print sql;
                    cursor.execute(sql)
                    db.commit()
                for rider in drivermemo[drivername]:
                    sql = "update trip set allocated=%d where tripid=%d" % (1,int(rider.split(" ")[0]));
                    #print sql;
                    cursor.execute(sql)
                    db.commit()
                results = cursor.fetchall()
                if(len(results)>0):
                    if(len(drivermemo[drivername])==2):
                        sql = "update confirmedtrip set driver = '"+drivername+"', rider1='"+drivermemo[drivername][0].split(" ")[0]+"', rider1_time='"+drivermemo[drivername][0].split(" ")[1]+"',rider2='"+drivermemo[drivername][1].split(" ")[0]+"',rider2_time='"+drivermemo[drivername][1].split(" ")[1]+"' where tripID ='" +drivername+"'";
                        cursor.execute(sql)
                        db.commit()
                    elif(len(drivermemo[drivername])==1):
                        sql = "update confirmedtrip set driver = '"+drivername+"', rider1='"+drivermemo[drivername][0].split(" ")[0]+"', rider1_time='"+drivermemo[drivername][0].split(" ")[1]+"' where tripID ='" +drivername+"'";
                        cursor.execute(sql)
                        db.commit()
                else:
                    if(len(drivermemo[drivername])==2):
                        sql = "insert into confirmedtrip(tripID,driver,rider1,rider1_time,rider2,rider2_time) values ('" +drivername+"','"+drivername+"','"+drivermemo[drivername][0].split(" ")[0]+"', '"+drivermemo[drivername][0].split(" ")[1]+"','"+drivermemo[drivername][1].split(" ")[0]+"','"+drivermemo[drivername][1].split(" ")[1]+"')";
                        #print sql;
                        cursor.execute(sql)
                        db.commit()
                    elif(len(drivermemo[drivername])==1):
                        sql = "insert into confirmedtrip(tripID,driver,rider1,rider1_time) values ('" +drivername+"','"+drivername+"','"+drivermemo[drivername][0].split(" ")[0]+"', '"+drivermemo[drivername][0].split(" ")[1]+"')";
                        cursor.execute(sql)
                        db.commit()
                #print drivermemo
                break
            #print(str(start_distance)+" "+str(start_time)+" -> "+str(end_distance)+" "+str(end_time))
            
print drivermemo

#json.dump(drivermemo, open("text.txt",'w'))
            