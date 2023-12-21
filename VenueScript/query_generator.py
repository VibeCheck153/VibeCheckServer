import json

with open('venue.json') as venue_file:
    file_contents = venue_file.read()

data = json.loads(file_contents)

result = ""

for i in data:
    query = '''
        CREATE (:Venue 
        {{
          type: "{type}",
          name: "{name}",
          location: "{location}",
          gmap_link: "{gmap_link}",
          instagram_link: "{instagram_link}",
          address: "{address}",
          coordinates: {coordinates}
        }})
    '''.format(type=i["type"], name=i["name"], location=i["location"], gmap_link=i["gmap_link"],
               instagram_link=i["instagram_link"], address=i["address"], coordinates=i["coordinates"])

    result += query


print(result)

