
import express from "express";
import cors from "cors";
import meetingRoutes from "./modules/meeting/routes/meeting.routes";
import userRoutes from "./modules/user/user.routes";
import { errorHandler } from "./middlewares/error.middleware";

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/meetings",meetingRoutes);
app.use("/users",userRoutes);

app.use(errorHandler);
