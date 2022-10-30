import { Router } from "express";
import GiftController from "../controllers/GiftController";
import { auth } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", auth, GiftController.gift);
router.post("/", auth, GiftController.add);
router.get("/:id", auth, GiftController.detail);
router.patch("/:id", auth, GiftController.patch);
router.put("/:id", auth, GiftController.put);
router.delete("/:id", auth, GiftController.delete);
router.post("/:id/redeem", auth, GiftController.redeem);
router.post("/:id/rating", auth, GiftController.rating);

export default router;
