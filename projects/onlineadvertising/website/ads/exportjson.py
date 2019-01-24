import os
import json

folders = os.listdir(".")
folders = [f for f in folders if not f.startswith('.')]
folders = [f for f in folders if not f.endswith('.py')]

data = {}

for f in folders:
    files = os.listdir(f)
    files = [f + os.sep + fi for fi in files]
    files = [fi for fi in files if os.path.splitext(fi)[1].lower() in [".png", ".gif", ".jpeg", ".jpg"]]
    data[f] = files

print(data)

with open('images.json', 'w') as fp:
    json.dump(data, fp)
