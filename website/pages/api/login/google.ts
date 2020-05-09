import axios from "axios";

export default async (req, res) => {
  try {
    var response = await axios.post("https://oauth2.googleapis.com/token", {
      code: req.body.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: req.headers.referer.split("?")[0],
    });

    res.status(200).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(403).send("Google authentication failed");
  }
};
