import nodeFetch from "node-fetch";
import dotenv from 'dotenv';
import express from "express";
const app = express();
const port = 5000;

const startServer = () => {

  app.get("/weather", async (req, res) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const { cities } = req.query;
      const citiesArr = cities?.split(",");
      if (!citiesArr || citiesArr.length === 0) {
        res.status(400).json({ error: "Please insert at least one city" });
      }
      const citiesPromises = citiesArr.map(async (city) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await nodeFetch(apiUrl);
        const retVal = await response.json();
        return retVal;
      });
      const results = await Promise.all(citiesPromises);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
 dotenv.config();
};

startServer();
