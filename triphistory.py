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
#email = sys.argv[1]
email = "sg4423@nyu.edu"
sql = "select * from trip where email = '"+email+"' order by date DESC,book_time DESC limit 5"
cursor.execute(sql)
# Fetch all the rows in a list of lists.
results = cursor.fetchall()
tablestr = "<div class='table-responsive'><table class='table'><tr><th>Ridetype</th><th>Booking Date</th><th>Status</th><th>Driver</th><th>Rider 1</th><th>Rider 2</th><th>Ride Date</th><th>Ride Time</th></tr>"
for row in results:
    tripid = row[0]
    ridetype= row[1]
    time1 = row[2]
    time2 = row[3]
    date = row[4]
    no_of_riders = row[5]
    book_time = row[6]
    email = row[7]
    allocated = row[8]
    status = "-"
    driver = "-"
    rider1 = "-"
    rider2 = "-"
    rider1_time = "-"
    rider2_time = "-"
    ride_time = "-"
    ridedate = "-"
    if(allocated == 0):
        status = "Pending"
    else:
        status = "Confirmed"
        if(ridetype == "rider"):
            sql = "select * from confirmedtrip where rider1="+str(tripid)+" or rider2="+str(tripid)+" limit 1"
            cursor.execute(sql)
            resultsc = cursor.fetchall()
            if(len(resultsc)!=0):
                sql = "select c.fullname,t.date from customer as c,trip as t  where t.tripid="+str(tripid)+" and t.email=c.email limit 1";
                cursor.execute(sql)
                resultsd = cursor.fetchall()
                if(len(resultsd)!=0):
                    driver = resultsd[0][0]
                    ridedate = resultsd[0][1]
                if(resultsc[0][3]==tripid):
                    ride_time = resultsc[0][1]
                else:
                    ride_time = resultsc[0][5]
                
        else:
            sql = "select * from confirmedtrip where driver="+str(tripid)+" limit 1"
            cursor.execute(sql)
            resultsc = cursor.fetchall()
            if(len(resultsc)!=0):
                sql = "select c.fullname from customer as c,trip as t  where t.tripid="+str(resultsc[0][3])+" and t.email=c.email limit 1";
                cursor.execute(sql)
                resultsd = cursor.fetchall()
                ridedate = date
                if(len(resultsd)!=0):
                    rider1 = resultsd[0][0]
                    rider1_time = resultsc[0][1]
                if(resultsc[0][4]!=None):
                    sql = "select c.fullname from customer as c,trip as t  where t.tripid="+str(resultsc[0][4])+" and t.email=c.email limit 1";
                    cursor.execute(sql)
                    resultsd = cursor.fetchall()
                    if(len(resultsd)!=0):
                        rider2 = resultsd[0][0]
                        rider2_time = resultsc[0][1]
    tablestr+="<tr><td style='text-transform: capitalize'>"+ridetype+"</td><td>"+str(book_time)+"</td><td>"+status+"</td><td>"+driver+"</td><td>"+rider1+"<br>"+str(rider1_time)+"</td><td>"+rider2+"<br>"+str(rider2_time)+"</td><td>"+str(ridedate)+"</td><td>"+str(ride_time)+"</td></tr>"
print tablestr+"</table></div>"
    
