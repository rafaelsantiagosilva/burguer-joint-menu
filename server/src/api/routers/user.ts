import { Router } from "express";

const userRouter: Router = Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "foo" });
});

export { userRouter };