import axios from "axios";

export default async (req, res) => {
  try {
    let url = new URL("https://graph.facebook.com");
        url.pathname = "/v6.0/oauth/access_token";
        url.searchParams.set("client_id", process.env.FACEBOOK_CLIENT_ID);
        url.searchParams.set("client_secret", process.env.FACEBOOK_CLIENT_SECRET);
        url.searchParams.set("redirect_uri", req.headers.referer.split("?")[0]);
        url.searchParams.set("code", req.body.code);

    var response = await axios.get(url.toString());

    console.log(response.data);
    res.status(200).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(403).send("Facebook authentication failed");
  }
};
