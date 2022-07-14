
// api calls
// current Weather
// const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q={city name}";
// // 5-day forecast
// const fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q={city name}";
// // uv index 
// const uvIndex = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}";

const url = {
    api_Key: "appid=add677606414ab9c4f999f400365c5bc&units=imperial",
    currentWeather: "https://api.openweathermap.org/data/2.5/weather?",
    fiveDay: "https://api.openweathermap.org/data/2.5/forecast?",
    uv: "https://api.openweathermap.org/data/2.5/onecall?",
};

const forecastBox = {
    day: $("#forecast-card-weekday"),
    date: $("#forecast-card-date"),
    location: $("#forecast-card-location"),
    img: $("#forecast-card-img"),
    temp: $("#forecast-card-temp"),
    uv: $("#uv"),
    description: $("#forecast-card-description"),
    fiveDisplay: $("#forecast-details-week")


};



const apiCall = async (constructedUrl) => {
    const result = await $.ajax({
        url: constructedUrl,
        type: "GET",
    })
    return result
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todaysDay = new Date();
let thisDay = days[todaysDay.getDay()];

const fullDate = moment().format("MMM Do YY"); 



function present(currentWeather, fiveDay, uv) {
    let userInput = $("#search-query").val()
    forecastBox.day.text(thisDay);
    forecastBox.date.text(fullDate);
    forecastBox.location.text(userInput);
    forecastBox.temp.text(currentWeather.main.temp);
    forecastBox.img.attr("src", `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`);
    forecastBox.description.text(currentWeather.weather[0].description);
    forecastBox.uv.text(uv.current.uvi);

    const fiveDayArray = fiveDay.list.map(obj => {
        const [dt, dt_text] = obj.dt_txt.split(" ")
        const icon = `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`
        const temp = obj.main.temp
        const windSpeed = obj.wind.speed
        const humidity = obj.main.humidity
        return {
            dt,
            dt_text,
            icon,
            temp,
            windSpeed,
            humidity,
        }
    }).filter(obj => obj.dt_text === "12:00:00")
    forecastBox.fiveDisplay.empty()

    fiveDayArray.forEach(obj => {
        const li = `
            <li class="forecastBox__week-day d-flex flex-column justify-content-center align-items-center p-2 weather-day">
                <img class="mb-2" width="30" src="${obj.icon}" />
                <span class="mb-2">${obj.dt}</span>
                <span class="mb-2">${obj.dt_text}</span>
                <span class="font-weight-bold">${obj.temp}&deg</span>
                <span class="font-weight-bold">${obj.windSpeed} mph</span>
                <span class="font-weight-bold">${obj.humidity}%</span>
            </li>
        `
        forecastBox.fiveDisplay.append(li)
    });

    console.log(fiveDayArray);


    $("#search-query").val("")
}


const getWeather = async (event) => { 
    event.preventDefault()
    $("#loader-box").removeClass("d-none")
    let userInput = $("#search-query").val()
    const currentWeatherUrl = url.currentWeather + url.api_Key + "&q=" + userInput
    const currentWeather = await apiCall(currentWeatherUrl)
    const fiveDayUrl = url.fiveDay + url.api_Key + "&q=" + userInput
    const fiveDay = await apiCall(fiveDayUrl)
    const uvUrl = url.uv + url.api_Key + "&lat=" + currentWeather.coord.lat + "&lon=" + currentWeather.coord.lon
    const uv = await apiCall(uvUrl)
    $("#loader-box").addClass("d-none")
    $("#forecast-box").removeClass("d-none")
    present(currentWeather, fiveDay, uv)
};



$(".searchBox__button").on("click", getWeather);