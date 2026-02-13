
import { Router } from "express";
import { MeetingController } from "../index/meeting.controller";

const router = Router();

router.post("/", MeetingController.create);
router.get("/", MeetingController.list);
router.get("/:id", MeetingController.get);
router.put("/:id", MeetingController.update);
router.delete("/:id", MeetingController.delete);

export default router;
