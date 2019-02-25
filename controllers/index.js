const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/candies");
});
router.use("/candies", require("./candies"));

module.exports = router;
