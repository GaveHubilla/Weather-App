import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKeyToken = "dbb9d18d61e5b8e69225a55e112a9268";


app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/forecast", async (req, res) => {
  try {
    // added city input and reinserted API key.
    let city = req.body.city;
    const result = await axios.get(API_URL + `${city}&appid=${apiKeyToken}&units=metric`);

    // City Name
    const cityName = result.data.name;

    // information from the API
    const temp = result.data.main.temp;
    const humidity = result.data.main.humidity;
    const weather = result.data.weather[0].description;
    const tempFeels = result.data.main.feels_like;
    const minTemp = result.data.main.temp_min;
    const maxTemp = result.data.main.temp_max;
    const pressure = result.data.main.pressure;
    const windSpeed = result.data.wind.speed;

    // icon URL
    const icon = result.data.weather[0].icon;
    const urlPic = (`https://openweathermap.org/img/wn/${icon}@2x.png`);

    res.render("submit.ejs", {
    cityName: cityName,
    temp: temp,
    humidity: humidity,
    weather: weather.toUpperCase(),
    tempFeels: tempFeels,
    minTemp: minTemp,
    maxTemp: maxTemp,
    pressure: pressure,
    windSpeed: windSpeed,
    urlPic: urlPic,
    });


 } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 Not Found error (invalid city)
      res.status(400).send("Invalid city. Please enter a valid city name.");
    } else {
      // Handle other errors
      console.error("Error:", error.message);
      res.status(500).send(`An error occurred: ${error.message}`);
    }
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
