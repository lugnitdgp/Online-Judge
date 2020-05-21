import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: req.body.code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: req.headers?.referer?.split("?")[0] || "http://localhost:3000/login/google",
      })
    });

    let response = await resp.json()

    res.status(200).send(response);
  } catch (e) {
    console.error(e);
    res.status(403).send("Google authentication failed");
  }
};
