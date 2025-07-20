import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { readFileSync } from "fs";

const { sign, verify } = jsonwebtoken;

const privateKey = readFileSync("../../certs/jwt-private.pem", "utf8");
const publicKey = readFileSync("../../certs/jwt-public.pem", "utf8");

export const createAccessToken = (userId: number) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET ?? "", {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userId: number) => {
  return sign({ userId }, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return verify(token, process.env.ACCESS_TOKEN_SECRET ?? "") as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return verify(token, publicKey) as JwtPayload;
};
