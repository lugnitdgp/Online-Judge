import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let url = new URL("https://graph.facebook.com");
    url.pathname = "/v6.0/oauth/access_token";
    url.searchParams.set("client_id", process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "");
    url.searchParams.set("client_secret", process.env.FACEBOOK_CLIENT_SECRET || "");
    url.searchParams.set("redirect_uri", req.headers?.referer?.split("?")[0] || "");
    url.searchParams.set("code", req.body.code);

    let resp = await fetch(url.toString());
    let response = await resp.json();

    console.log(response);
    res.status(200).send(response);
  } catch (e) {
    console.error(e);
    res.status(403).send("Facebook authentication failed");
  }
};
