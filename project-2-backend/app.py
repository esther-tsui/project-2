from flask import Flask, jsonify,request, url_for
from flask_pymongo import PyMongo
from dotenv import load_dotenv
from bson import json_util
import json
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import traceback
import os
import uuid
from flask_cors import CORS, cross_origin
from backend import PyMongoFixed
# from urllib.request import urlopen

# from backend.data.html import Data

load_dotenv()
app = Flask("app")
username, pwd = os.getenv("MONGODB_USERNAME"), os.getenv("MONGODB_PASSWORD")
connection_string = f"mongodb://{username}:{pwd}@localhost:27017/recipes?authSource=admin"
cors = CORS(app, resources={r"/api/*": {"origins": "*"}}, send_wildcard=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JWT_SECRET_KEY"] = "test"  # Change this!
print(connection_string)
app.config["MONGO_URI"]=connection_string
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
conn = PyMongoFixed(app)

def purge_empty(input):
    return input.strip() != ""

@app.route('/api/v1/recipes/all', methods=['GET'])
@cross_origin(supports_credentials=True)
def api_all():
    # TODO: fetch collections from database and return.
    db = conn.db
    collection = db["recipes"]
    cursor = collection.find({})
    json_data = json.loads(json_util.dumps(cursor))
    json_data['instructions'] = json_data['steps']
    resp = jsonify({
        "recipes": json_data,
    })
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/api/v1/recipes', methods=['GET'])
def api_three():
    # TODO: skip the first two and limit to 3 items show per page.
    try:
        _offset = int(request.args.get('_offset', 2))
        _limit = int(request.args.get('_limit', 3))
    except Exception as e:
        return str(e), 500
    db = conn.db
    collection = db["recipes"]


    cursor = collection.find({}).skip(_offset).limit(_limit)
    json_data = json.loads(json_util.dumps(cursor))
    for recipe in json_data:
        recipe['instructions'] = recipe['steps']
    resp = jsonify({
        "recipes": json_data,
        "offset": _offset,
    })

    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/api/v1/recipes', methods=['POST'])
def new_post():
    # TODO: do a post method to database and return.
    db = conn.db
    collection = db["recipes"]
    content_type = request.headers.get('Content-Type')
    print("Got type" + content_type)
    if ( 'multipart/form-data' in content_type):
        new_recipe = request.form
        new_recipe_files = request.files # Flask stores them in flask for multipart/form-data
        print("Here")
        try:
            print(new_recipe)
            # Save the image using mongo,
            image_name = uuid.uuid4().hex #Generates a hexadecimal name for us
            # Store file in mongodb by image name
            image_name = f"{image_name}.jpeg"
            conn.save_file(image_name, new_recipe_files['image'])
            # Insert into mongodb using image name so that we can perform a lookup for itlater
            steps =  new_recipe['steps'].split("\n")
            ingredients = new_recipe['ingredients'].split("\n")
            
            collection.insert_one({
                "title": new_recipe['title'],
                "steps": list(filter(purge_empty, steps)),
                "ingredients": list(filter(purge_empty, ingredients)),
                "image": image_name 
            })
            return "recipe added", 200 
        except Exception as e:
            print("Exception occured")
            print(traceback.format_exc())
            return "Failed to add recipe", 500
    else:
        return "Unknown type",422
        

    
@app.route('/api/v1/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
def user():
    # TODO: do a post method to database and return.
    db = conn.db
    collection = db["users"]
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        print(json)
        if "username" not in json.keys() or "password" not in json.keys():
            return jsonify({"message": "please enter username or password."})

        password=json.get("password")
        pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        json.update({"password": pw_hash})
        print(json)
        try:
            collection.insert_one(json)
            return jsonify({"message": "user created"})


        except Exception as e:
            print(str(e))
            return jsonify({"error": "Failed to add user"}), 500



@app.route("/api/v1/login", methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'], supports_credentials=True)
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    db = conn.db
    collection = db["users"]
    user = collection.find_one({"username": username})
    if not user:
        return jsonify({"msg": "username does not exist."}), 401

    
    if bcrypt.check_password_hash(user["password"], password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else: 
        return jsonify({"msg": "error"}), 401


@app.route("/api/v1/test", methods=["GET"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'], supports_credentials=True)
@jwt_required()
def optionally_protected():
    current_identity = get_jwt_identity()
    if current_identity:
        return jsonify(logged_in_as=current_identity)
    else:
        return jsonify(logged_in_as="anonymous user")

@app.route("/uploads/<path:filename>")
def get_upload(filename):
    return conn.send_file(filename)



if app == "__main__":
    load_dotenv()
    app.run(debug=True)