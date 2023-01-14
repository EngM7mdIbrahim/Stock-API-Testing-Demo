const express = require("express");
const router = express.Router();
const Trade = require("../models/trades");

router.all("/:id", (req, res, next) => {
  console.log("Entered!");
  if (
    req.method === "PUT" ||
    req.method === "PATCH" ||
    req.method === "DELETE"
  ) {
    res.status(405).send("This request is not supported!");
  } else {
    next();
  }
});

router.post("/", async (req, res) => {
  const { type, user_id, symbol, shares, price, timestamp } = req.body;
  const newTrade = await Trade.create({
    type,
    user_id,
    symbol,
    shares,
    price,
    timestamp,
  });
  console.log("Recieved a new trade creation request");
  res.status(201).send(newTrade);
});

router.get("/", async (req, res) => {
  const { type, user_id } = req.query;
  let whereQuery = {};
  if (type !== undefined) {
    whereQuery.type = type;
  }
  if (user_id !== undefined) {
    whereQuery.user_id = user_id;
  }

  const trades = await Trade.findAll({
    where: whereQuery,
    order: [["id", "ASC"]],
  });

  const tradesJSON = trades.map((trade) => trade.toJSON());
  console.log("Trades: ", tradesJSON);
  res.status(200).send(tradesJSON);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const requestedTrade = await Trade.findOne({
    where: {
      id,
    },
  });
  if (requestedTrade) {
    res.status(200).send(requestedTrade.toJSON());
    return;
  }
  res.status(404).send("ID not found");
});

module.exports = router;
