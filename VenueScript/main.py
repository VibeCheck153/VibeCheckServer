import requests
from requests.structures import CaseInsensitiveDict
import json

with open('venue.json') as venue_file:
    file_contents = venue_file.read()

print(file_contents)

data = json.loads(file_contents)

address = [i["address"] for i in data]


for i, add in enumerate(address):
    print(add)
    url = f"https://api.geoapify.com/v1/geocode/search?text=${add}&apiKey=94e9d83505c944428bd2b53932edab1d"

    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"

    resp = requests.get(url, headers=headers)

    coordinates = [resp.json()["features"][0]["properties"]["lat"], resp.json()["features"][0]["properties"]["lon"]]

    print(coordinates)

    data[i]["coordinates"] = coordinates

print(data)
