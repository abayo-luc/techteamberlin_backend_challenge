const express = require("express");
const router = express.Router();

const axios = require("axios");
const Op = require("sequelize").Op;

//load database model
const Article = require("../models").article;
const User = require("../models").user;
//load model helpers
const { createArticle } = require("../helpers/model.help");

//@end point /fetch_articles
//@description: this endpoint fetch the 10 latest articles from the api and save them in the database.
router.get("/fetch_articles", (req, res) => {
  axios
    .get("https://api.currentsapi.services/v1/latest-news", {
      headers: { Authorization: process.env.CURRENT_API_KEY }
    })
    .then(response => {
      const {
        data: { news }
      } = response;
      let sortedArticles = news
        .sort((a, b) => new Date(b.published) - new Date(a.published))
        .splice(0, 10);
      for (let article of sortedArticles) {
        createArticle(article);
      }
      res.json(sortedArticles);
    })
    .catch(err => {
      console.log(err); //for debugging
      res.status(400).json({ err: "API failed" });
    });
});

//@end point /articles
//@description query all articles in the database, with thier respective author.
router.get("/articles", (req, res) => {
  Article.findAll({
    include: [
      {
        model: User,
        attributes: ["name"],
        as: "author"
      }
    ]
  })
    .then(articles => res.json(articles))
    .catch(err => {
      console.log(err); //for Debugging
      res.status(500).json({ err: "Articles couldn't be fetched" });
    });
});

//@end point /users/:username/article
//@description query all articles  associate with the specific user id
router.get("/users/:id/articles", (req, res) => {
  User.findById(req.params.id, {
    include: [
      {
        model: Article,
        as: "articles"
      }
    ]
  })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.log(err); //for Debugging
      res.status(500).json({ msg: "Sorry! something went wrong" });
    });
});

//@end point /search?searchQuery="Codecamp"
//@description that search through all articles and return
// the id, a creation timestamp, the title, the url, the language (eg “en”) and the authors name for each article.
router.get("/search", (req, res) => {
  const { searchQuery } = req.query;
  Article.findAll({
    where: {
      title: {
        [Op.iLike]: `%${searchQuery}%`
      }
    },
    include: [
      {
        model: User,
        attributes: ["name"],
        as: "author"
      }
    ]
  })
    .then(articles => res.json(articles))
    .catch(err => {
      console.log(err); //for Debugging
      res.status(500).json({ msg: "Sorry! something went wrong" });
    });
});
module.exports = router;
