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
router.post("/fetch_articles", (req, res) => {
  axios
    .get("https://api.currentsapi.services/v1/latest-news", {
      headers: { Authorization: process.env.CURRENT_API_KEY }
    })
    .then(response => {
      const {
        data: { news }
      } = response;
      const sortedArticles = news
        .sort((a, b) => new Date(b.published) - new Date(a.published))
        .splice(0, 10)
        .map(article => {
          return {
            title: article.title,
            language: article.language,
            published: article.published,
            authorId: article.author, //at this point authorId hold author name.
            url: article.url
          };
        });
      //the array containing the name of authors, to be saved in db
      const newUsers = sortedArticles.map(article => {
        return {
          name: article.authorId // authorId hold author name
        };
      });
      //bulkCreate users, and ignore the user if she or he already exisit int he database
      User.bulkCreate(newUsers, {
        returning: true,
        ignoreDuplicates: true
      })
        .then(users =>
          User.findAll()
            .then(users => {
              let articlesWithAuthorId = sortedArticles.map(article => {
                let user = users.find(user => user.name == article.authorId);
                return { ...article, authorId: user.id }; //on authorId attribute, replace name with the id
              });
              //create article in bulk, which will ignore new article if it already exist.
              Article.bulkCreate(articlesWithAuthorId, {
                returning: true,
                ignoreDuplicates: true
              })
                .then(articles => res.json(articles))
                .catch(err => res.status(400).send(err));
            })
            .catch(err => res.status(400).send(err))
        )
        .catch(err => res.status(400).send(err));
    })
    .catch(err => {
      console.log(err); //for debugging
      res.status(500).send(err);
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
      res.status(500).send(err);
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
      res.status(500).send({ msg: "Sorry! something went wrong" });
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
