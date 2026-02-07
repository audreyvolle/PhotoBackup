# PhotoBackup

"MyCloud" - A free ICloud replacement. Control where you store your photos.

## How to use
App and API must be run on devices using the same network.

### App


### API
#### First time running API:
- Must have python installed
- create .env file with two variables:
```
SECRET_KEY=change-this-to-a-long-random-string
PORT=3000
```
- On the first run, you will be prompted to create a user and password to be used in the application. Once that has successfully been completed, the ip and port will log, which will need to be inputted into the application's server input.


#### Run API:
mac/linux
```
./run.sh
```
windows
```
.\run.ps1
```

