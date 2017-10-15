from flask import Flask
import pprint

from pymongo import MongoClient
from random import randint

#Connect to MongoDB - Note: Change connection string as needed
client = MongoClient(port=27017)
db=client.user
usersCollection = db.usersCollection

app = Flask(__name__)
app.run(host='0.0.0.0')

@app.route('/')
def index():
    return "Women Safety APP"

@app.route('/userExists/<int:psid>', methods=['GET'])
def userExists(psid):
    if psid == 1:
    	return "test"
    else:
    	return "ps != 1"

@app.route('/validate/<int:psid>/<string:pwd>', methods=['GET'])
def validate(psid,pwd):

    data= usersCollection.find_one({'psid': psid})
    
    if (data['pwd'][0].encode("utf-8") == pwd):
        return "True"

    return "False"


 
@app.route('/register/<int:psid>/<string:pwd>/<string:role>', methods=['POST'])
def register(psid,pwd,role):
    user = {
        'psid' : [psid],
        'pwd' : [pwd],
        'role' : [role] 
    }

    result=usersCollection.insert_one(user)
    return 'Debug : Created ' + str(result.inserted_id)

if __name__ == '__main__':
    app.run(debug=True)