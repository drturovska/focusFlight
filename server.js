import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";

const app = express();

app.use(cors());

const GROUP = "ІНБ12340Д";

app.get("/api/schedule", async (req, res) => {
  try {
    const url = "https://dekanat.kubg.edu.ua/cgi-bin/timetable.cgi";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(response.data);

    const lessons = [];

    $("table tr").each((_, el) => {
      const tds = $(el).find("td");

      if (tds.length >= 4) {
        const time = $(tds[0]).text().trim();
        const subject = $(tds[1]).text().trim();
        const teacher = $(tds[2]).text().trim();
        const room = $(tds[3]).text().trim();

        if (subject) {
          lessons.push({ time, subject, teacher, room });
        }
      }
    });

    res.json(lessons);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});