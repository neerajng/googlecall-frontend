// export async function decodeJwtToken(authorization: string) {
//   const token = authorization.replace("Bearer ", "");
//   // verify token
//   return jwtVerify(token, secret, {
//     issuer: process.env.NEXT_PUBLIC_JWT_ISSUER, // issuer
//     audience: process.env.NEXT_PUBLIC_JWT_AUDIENCE, // audience
//   });
// }