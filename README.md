## InReach

[NestJS](https://github.com/nestjs/nest) app for location check-ins. 

## Project setup

```bash
$ docker-compose up --build
```

## Interact with Frontend

Visit [http://localhost:8080/checkin](http://localhost:8080/checkin)

## Google Auth

Visit [http://localhost:3000/auth/google](http://localhost:3000/auth/google) to init Google Auth

Then use the `accessToken` key and pass it into the `/checkin` endpoint as a `POST` request:

```bash
 curl -X POST http://localhost:3000/checkin \
 	-H "Authorization: Bearer ACCESS_TOKEN" \
 	-H "Content-Type: application/json" \
	-d '{"latitude": 40.7128, "longitude": -74.0060}'
```
