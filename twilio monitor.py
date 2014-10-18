from twilio.rest import TwilioRestClient
from firebase import firebase
from pygeocoder import Geocoder
import json
import time

# Your Account Sid and Auth Token from twilio.com/user/account
account_sid = ""
auth_token  = ""
client = TwilioRestClient(account_sid, auth_token)
# Initialize Firebase database
firebase2 = firebase.FirebaseApplication('https://issuemapping.firebaseio.com', None)

# Count current number of messages
messages = client.messages.list()
received_count = len(messages)

while True:
	print "Python script is waiting for new data entries..."
	messages = client.messages.list()

	if received_count != len(messages):
		for message in messages:
			if message.status == "received":
				print "New data has been detected!"
				# Use Google Maps Geocoder to translate natural language into [latitude,longitude] coordinates
				loc = Geocoder.geocode(message.body[message.body.index("(")+1:message.body.index(")")])[0].coordinates 
				print "Preparing to update database..."
				# Create the JSON object to push to Firebase database
				data_submit = {
					'user_id' : message.from_,
					'location' : {'latitude': loc[0], 'longitude': loc[1]},
					'date' : message.date_sent,
					'details' : message.body[message.body.index(")")+1:]
				}
				print ("New data from: " + message.body[message.body.index("(")+1:message.body.index(")")])
				print ("Data: " + message.body[message.body.index(")")+1:])
				received_count+=1
				# Push to Firebase database
				firebase2.post('/users', data_submit, {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
				print "Database updated..."
				# 1 second delay to save power
				#time.sleep(1)
				break
                
	time.sleep(1)

                
