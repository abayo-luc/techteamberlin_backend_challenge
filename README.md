# techteamberlin_backend_challenge

This app is build with NodeJs, it pulls news articles from the currentsapi.services API and stores them in a PostgreSQL database.

### `npm install`

To install all dependencies.

### `npm run server`
To runs your app in development mode with nodemom. 
Open [http://localhost:5000](http://localhost:5000) to access all end point.


## Configurage .env variable

Create .env faile and to sure your database and password as DATABASE_USERNAME and DATABASE_PASSWORD respectively. Also, sotre CURRENT_API_KEY from https://currentsapi.services/ in order to use the news api.

## Database

Install [postgreSql](https://www.postgresql.org/download/) and [sequelize-cli](http://docs.sequelizejs.com/) on your local machine.

## Fetch the 10 latest articles

`GET /fetch_articles`
This endpoint fetch the 10 articles from the [currents endpoint](https://api.currentsapi.services/v1/latest-news) and save them in the database. Therefore, it requires access token and more information can be found [here](https://currentsapi.services/).

## Fetch all saved articles

`GET /articles`
This endpoint should return an array of all articles with thier authors saved in the database.

## Fetch user's articles

`GET /users/:id/articles`
This endpoint return a list of all articles by the author with this id including the articles id, a creation timestamp, the title, the url and the language for each article of this author.

## Search article by title

`GET /search?searchQuery=value`
This endpoint takes a search query as queru param and return a list of articles from the database where the articles title matches the search query. The result includes an id, a creation timestamp, the title, the url, the language and the author.
