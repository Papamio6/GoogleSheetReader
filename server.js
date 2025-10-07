import express from "express";
import cors from "cors";
import { scrapeSheet } from "./nodeFetch.js";

const app = express();
app.use(cors());

// endpoint dynamique
app.get("/sheet", async (req, res) => {
  try {
    const sheetUrl = req.query.url; // url fournie par le front-end

    if (!sheetUrl) {
      return res.status(400).json({ error: "Paramètre 'url' manquant" });
    }

    console.log("Scraping du Google Sheet :", sheetUrl);

    const data = await scrapeSheet(sheetUrl); // ton module prend l’URL en argument
    res.json({ ...data, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend prêt sur le port ${PORT}`));