import express from "express"
import axios from "axios"
const app =express()
const port=3000
app.use(express.urlencoded({ extended: true }));
let longitude
let latitude
let locn_arr=[]

const your_APIkey="a2297cef3940f284954701ba419a30bd"
const geocoding_APIKey="4569e1b1d7e9482688f1f2b55cdb8680"

async function getCoordinates(city) {
      
      const apiKey = geocoding_APIKey
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          
          return{lat,lng}
          
          // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        } else {
        //   document.getElementById("output").innerText = 
        console.log("No results found for the given city.");
        }
      } catch (error) {
        // document.getElementById("output").innerText = "Error: " + error;
      }
    }

app.use(express.static('public'))

app.get("/",(req,res)=>{
//  getCoordinates('kailashpuri')
    res.render("index.ejs")
})
app.post('/search',async (req,res)=>{
// console.log(req.body);
try {
  const coords=await getCoordinates(req.body.locn)
const latitude=coords.lat
const longitude=coords.lng
let result=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${your_APIkey}`)


const temp=Math.floor(result.data.main.temp)
const feels_like=Math.floor(result.data.main.feels_like)
const humidity=Math.floor(result.data.main.humidity)
const wind_speed=result.data.visibility
const now = new Date();
res.render("index1.ejs",{weather:result.data.weather[0],temp,feels_like,humidity,wind_speed,now:now.toLocaleTimeString(),location:result.data.name})
} catch (error) {
  res.render("index1.ejs",{ weather: null,
      temp: null,
      feels_like: null,
      humidity: null,
      wind_speed: null,
      now: null,
      location: null,
      error: "Invalid location. Please try again."})
  console.log("Error 404: Invalid location")
}





})

app.listen(port,()=>{
    console.log('Listening on port '+port);
})