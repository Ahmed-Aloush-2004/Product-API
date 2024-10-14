import jwt from "jsonwebtoken";
export function generateJWT(userClaims) {
  const token = jwt.sign(userClaims, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
}
