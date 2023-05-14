import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).end(
        JSON.stringify({
          message: "Missing refresh token",
        })
      );
    }

    try {
      const filePath = path.join(__dirname, "refreshToken.txt");
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        fs.writeFileSync(filePath, refreshToken);
      }
      res.status(200).end(
        JSON.stringify({
          message: "Refresh token saved",
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).end(
        JSON.stringify({
          message: "Internal server error",
        })
      );
    }
  } else if (req.method === "GET") {
    try {
      const filePath = path.join(__dirname, "refreshToken.txt");
      if (!fs.existsSync(filePath)) {
        res.status(404).end(
          JSON.stringify({
            message: "Refresh token not found",
          })
        );
      } else {
        const refreshToken = fs.readFileSync(filePath, "utf8");
        res.status(200).end(
          JSON.stringify({
            refreshToken,
          })
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).end(
        JSON.stringify({
          message: "Internal server error",
        })
      );
    }
  }
}
