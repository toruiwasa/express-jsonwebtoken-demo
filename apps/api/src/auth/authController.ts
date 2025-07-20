import {
  LoginInput,
  LoginInputSchema,
  SignupInput,
  SignupInputSchema,
  flattenError,
} from "@express-jsonwebtoken-demo/shared";
import { Request, Response } from "express";
import { compareSync, hash, hashSync } from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./authService";
import { db, eq, usersTable } from "@express-jsonwebtoken-demo/database";

export const signup = async (
  req: Request<never, never, SignupInput>,
  res: Response,
) => {
  try {
    const result = SignupInputSchema.safeParse(req.body);
    if (result.error) {
      return res.status(400).json(flattenError(result.error));
    }

    const { email, password } = result.data;

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (users.length)
      return res.status(409).send({ message: "user already exists" });

    const hashedPassword = await hash(password, 10);
    await db.insert(usersTable).values({
      email,
      password: hashedPassword,
    });

    res.send({ message: "User Created" });
  } catch (e) {
    res.status(500).json({
      message: (e as Error).message,
    });
  }
};

export const login = async (
  req: Request<never, never, LoginInput>,
  res: Response,
) => {
  try {
    const result = LoginInputSchema.safeParse(req.body);
    if (result.error) {
      return res.status(400).json(flattenError(result.error));
    }

    const { email, password } = result.data;

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!users.length)
      throw new Error("The email address or password is incorrect.");

    const [user] = users;

    const valid = compareSync(password, user.password);
    if (!valid) throw new Error("The email address or password is incorrect.");
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);
    const hashedRefreshtoken = await hash(refreshtoken, 10);
    await db
      .update(usersTable)
      .set({ refreshtoken: hashedRefreshtoken })
      .where(eq(usersTable.id, user.id));

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, accesstoken);

    res.sendStatus(200);
  } catch (e) {
    res.status(401).send({
      error: (e as Error).message,
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accesstoken as string;
    const payload = verifyAccessToken(token);
    if (typeof payload !== "object" || !("userId" in payload)) {
      throw new Error("Unauthorized");
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(payload.userId)));

    if (!users.length) {
      throw new Error("User does not exists.");
    }

    const { password, refreshtoken, ...userWithoutSensitiveData } = users[0];
    res.send(userWithoutSensitiveData);
  } catch {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accesstoken as string;
    const payload = verifyAccessToken(token);
    await db
      .update(usersTable)
      .set({ refreshtoken: null })
      .where(eq(usersTable.id, Number(payload.userId)));
  } catch (e) {
    console.error(e);
  }

  res.clearCookie("accesstoken");
  res.clearCookie("refreshtoken", { path: "/refresh_token" });

  res.send({
    message: "Logged out",
  });
};

export const refreshtoken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshtoken as string;

  if (!token) {
    res.sendStatus(400);
    return;
  }
  let payload = null;
  try {
    payload = verifyRefreshToken(token);
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
    return;
  }

  if (typeof payload !== "object" || !("userId" in payload)) {
    res.sendStatus(401);
    return;
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(payload.userId)));
  if (!users.length) {
    res.sendStatus(404);
    return;
  }

  if (!compareSync(token, users[0].refreshtoken ?? "")) {
    res.sendStatus(401);
    return;
  }

  const accesstoken = createAccessToken(users[0].id);
  const refreshtoken = createRefreshToken(users[0].id);

  await db
    .update(usersTable)
    .set({ refreshtoken: hashSync(refreshtoken, 10) })
    .where(eq(usersTable.id, users[0].id));

  sendAccessToken(res, accesstoken);
  sendRefreshToken(res, refreshtoken);
  res.sendStatus(200);
};

const sendAccessToken = (res: Response, accesstoken: string) => {
  res.cookie("accesstoken", accesstoken, {
    httpOnly: true,
    maxAge: 900000,
    sameSite: "strict",
    secure: true,
  });
};

const sendRefreshToken = (res: Response, refreshtoken: string) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    maxAge: 604800000,
    sameSite: "strict",
    secure: true,
    path: "/refresh_token",
  });
};
