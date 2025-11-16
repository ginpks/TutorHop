import express from "express";
import ViteExpress from "vite-express";
import { getDatabaseService } from "./Services/UtilitiesServices/DatabaseService.js";
import { apiStart } from "./Services/UtilitiesServices/APIConfig.js";

export const app = express();

export async function createServer() {
  await getDatabaseService();

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.findUser(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // send refresh token via secure cookie
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/refresh_token",
    });

    res.json({ accessToken });
  });

  function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    const token = auth.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.ACCESS_SECRET);
      req.userId = payload.userId;
      next();
    } catch (_) {
      return res.sendStatus(403);
    }
  }

  app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Hello user " + req.userId });
  });

  app.post("/refresh_token", (req, res) => {
    const token = req.cookies.jid;
    if (!token) return res.json({ ok: false, accessToken: "" });

    try {
      const payload = jwt.verify(token, process.env.REFRESH_SECRET);
      const accessToken = createAccessToken(payload.userId);
      return res.json({ ok: true, accessToken });
    } catch {
      return res.json({ ok: false, accessToken: "" });
    }
  });

  app.get("/hello", (_, res) => {
    res.send("Hello Vite + React + TypeScript!");
  });

  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
  );
  apiStart(app);
}

createServer().catch((err) => {
  console.error("Failed to start server:", err);
});
