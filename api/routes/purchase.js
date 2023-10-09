const express = require("express");

const purchaseController = require("../controllers/purchase");

const userAuthenticate = require("../middleware/auth");

const router = express.Router();

router.get(
  "/membership",
  userAuthenticate.authenticate,
  purchaseController.purchasePremium
);
router.post(
  "/updateStatus",
  userAuthenticate.authenticate,
  purchaseController.updateStatus
);

module.exports = router;
