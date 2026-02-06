# PhotoBackup

"MyCloud" - A free ICloud Replacement. Control what server you store your photos.

How to use:
- App and API must be run on devices using the same network.


## App



### API
First time running API:
- Must have python installed
- create .env file with two variables:
```
SECRET_KEY=change-this-to-a-long-random-string
PORT=3000
```

Run API:
```
./run.sh
```

If this is your first time running the API, you will be prompted to create a user and password to be used in the application.

Once that has successfully been completed, the ip and port will log, which will need to be inputted into the application's server input
