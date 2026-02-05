# PhotoBackup

"MyCloud" - A free ICloud Replacement. Control what server you store your photos.

How to use:
- App and API must be run on devices using the same network.


## App



## API

pip3 install fastapi uvicorn python-jose python-multipart argon2-cffi

### Running Instructions
Make sure the photos path (DATA_DIR) is set to where you would like to store your backed up photos

Create Secret Key
```
export SECRET_KEY="super-secret-random-string"
```
Run
```
uvicorn main:app --host 0.0.0.0 --port 3000
```

### Add a one time user
curl -X POST http://localhost:3000/auth/create-user \
  -H "Content-Type: application/json" \
  -d '{"username":"audrey","password":"strongpassword"}'

### Get IP address for app server url (Running application and server on same network)
#### macOS / Linux
```
ipconfig getifaddr en0
```

#### Windows
```
ipconfig
```

URL to use in the app example
http://192.168.1.42:3000