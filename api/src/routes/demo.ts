import { Router } from "express";
import sql from "../db"
import { User } from "../db/user"
import { auth, verified, pwdConfirmed } from "../middleware";

const router = Router();

router.get("/", (req, res) => res.json({ message: "OK" })); // health

router.get("/me", auth, async (req, res) => {
  const user = User.parse((await sql`SELECT * FROM users WHERE id=${Number(req.session.userId)}`)[0])
  return res.json(user)
});

// NOTE how both auth *and* verified are applied in that order.
// This ensures that unauthorized reqs return 401, while unverified 403.
router.get("/me/verified", auth, verified, (req, res) =>
  res.json({ message: "OK" })
);

router.get("/me/confirmed", auth, pwdConfirmed, (req, res) =>
  res.json({ message: "OK" })
);

export { router as demo };
