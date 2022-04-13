$(document).ready(function(){

    const apiKey = 'dc29ad80b0ec9912243321a6824d9baa';

$("#searchBtn").on("click", function(){
    let citySearch = $("#searchInput").val()
   getCurrentWeather(citySearch)
   //Clear value after search so you can't spam the same city
   $("#searchInput").val("");
   //Clearing Out so it doesn't stack
   $(".currentWeather").empty();
   $(".fiveDay").empty();

})

function getCurrentWeather(citySearch){
    //API for Current Weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`

    fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
        console.log("currentDay", data)
        //Setting the data needed
        let cityName = data.name;
        let temp = data.main.temp;
        let humidity = data.main.humidity;
        let wind = data.wind.speed;
        let date = data.coord.dt

        //Creating and Appending the data to the Current Weather Card
        let nameEl = $("<h3>").addClass("card-title").text(cityName + " " + moment(date).format('MMMM Do YYYY'));
        const cardHeader = $("<div class='card-header'>")
        cardHeader.append(nameEl)
        $(".currentWeather").append(cardHeader)
        let currentTemp = $("<p>").addClass("card-text").text("Temp: " + temp + '\xB0' + 'F')
        $(".currentWeather").append(currentTemp);
        let currentHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidity + "%")
        $(".currentWeather").append(currentHumidity);
        let currentWind = $("<p>").addClass("card-text").text("Wind: " + wind + "MPH")
        $(".currentWeather").append(currentWind);

        //Grabbing the coords for the five day function
        let coords = {
            lat: data.coord.lat,
            lon: data.coord.lon
        }

        getFiveDay(coords);
    })


}

function getFiveDay(coords){
    //API for Five Day 
    const getFiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`

    fetch(getFiveDayUrl)
    .then((response)=> response.json())
    .then((data)=>{
        console.log("data from FIVE DAY", data.daily[0])
        
        //UV Index for the Current Weather (In here so I donmt have to pull another API to just get the UV)
        let uvIndex = $("<p>").addClass("card-text").text("UV Index: " + data.daily[0].uvi)
        $(".currentWeather").append(uvIndex)
        if(data.daily[0].uvi < 2) {
            $(uvIndex).addClass("badge badge-pill low");
        } else if (data.daily[0].uvi > 2 && data.daily[0].uvi <= 5) {
            $(uvIndex).addClass("badge badge-pill moderate");
        } else if (data.daily[0].uvi > 5 && data.daily[0].uvi <= 7) {
            $(uvIndex).addClass("badge high");
        } else if (data.daily[0].uvi > 7 && data.daily[0].uvi <= 10) {
            $(uvIndex).addClass("badge vhigh");
        } else {
            $(uvIndex).addClass("xtreme");
        };

        //Running a loop to grab all the data
        for(let i = 1; i < 6; i++){
            let fiveDay = data.daily[i];
            console.log(fiveDay)
            let temp = data.daily[i].temp.day;
            let humidity = data.daily[i].humidity;
            let wind = data.daily[i].wind_speed;
            let date = data.daily[i].dt;

            //Creating cards and appending to them the five day data
            const card = $("<div>").addClass("card col-md-2");
            const cardHeader = $("<div>").addClass("card-header");
            const cardBody = $("<div>").addClass("card-body");
            const cardTitle = $("<div>").addClass("card-title").text(moment(date).format('MMMM Do YYYY'));
            cardHeader.append(cardTitle);
            cardBody.append(cardHeader);
            card.append(cardBody);
            $(".fiveDay").append(card);
            let futureTemp = $("<p>").text("Temp: " + temp + '\xB0' + 'F');
            cardTitle.append(futureTemp);
            let futureHumidity = $("<p>").text("Humidity: " + humidity + "%");
            cardTitle.append(futureHumidity);
            let futureWind = $("<p>").text("Wind: " + wind + "MPH");
            cardTitle.append(futureWind);
        }
    })
}










})