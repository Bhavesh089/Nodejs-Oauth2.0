const express = require("express");
const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user not logged in
    res.redirect("/auth/login");
  } else {
    // if logged in
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  //res.send("Greetings, " + req.user.username + "! you are logged in. ");
  res.render("profile", { user: req.user });
});

module.exports = router;
