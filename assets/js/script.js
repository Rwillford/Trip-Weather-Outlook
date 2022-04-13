$(document).ready(function(){

    const apiKey = 'dc29ad80b0ec9912243321a6824d9baa';


// var searchBtn = document.getElementbyId("searchBtn");
$("#searchBtn").on("click", function(){
   let citySearch = $("#searchInput").val()
   getCurrentWeather(citySearch)
   //Clear value after search so you can't spam the same city
   $("#searchInput").val("");

})

function getCurrentWeather(citySearch){

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`

    fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {

        let cityName = data.name;
        let temp = data.main.temp;
        let humidity = data.main.humidity;
        let wind = data.wind.speed;
        let date = data.coord.dt

        let nameEl = $("<h3>").addClass("card-title").text(cityName + " " + moment(date).format('MMMM Do YYYY'));
        const cardHeader = $("<div class='card-header'>")
        cardHeader.append(nameEl)
        $(".currentWeather").append(cardHeader)
        let currentTemp = $("<p>").text("Temp: " + temp + '\xB0' + 'F')
        $(".currentWeather").append(currentTemp);
        let currentHumidity = $("<p>").text("Humidity: " + humidity + "%")
        $(".currentWeather").append(currentHumidity);
        let currentWind = $("<p>").text("Wind: " + wind + "MPH")
        $(".currentWeather").append(currentWind);

        let coords = {
            lat: data.coord.lat,
            lon: data.coord.lon
        }

        getFiveDay(coords)
    })


}

function getFiveDay(coords){

    const getFiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`

    fetch(getFiveDayUrl)
    .then((response)=> response.json())
    .then((data)=>{
        console.log("data from FIVE DAY", data.daily[0])

        let uvIndex = $("<div>").addClass("card-text").text("UV Index: " + data.daily[0].uvi);
        $(".currentWeather").append(uvIndex)

        for(let i = 1; i < 6; i++){
            let fiveDay = data.daily[i];
            console.log(fiveDay)
            let temp = data.daily[i].temp.day;
            let humidity = data.daily[i].humidity;
            let wind = data.daily[i].wind_speed;
            let date = data.daily[i].dt;
            

            const card = $("<div>").addClass("card row-md-2");
            const cardHeader = $("<div>").addClass("card-header");
            const cardBody = $("<div>").addClass("card-body");
            const cardTitle = $("<div>").addClass("card-title").text(moment(date).format('MMMM Do YYYY'));
            cardHeader.append(cardTitle);
            cardBody.append(cardHeader);
            card.append(cardBody);
            $(".fiveDay").append(card);
            let futureTemp = $("<p>").text("Temp: " + temp + '\xB0' + 'F');
            $(".fiveDay").append(futureTemp);
            let futureHumidity = $("<p>").text("Humidity: " + humidity + "%");
            $(".fiveDay").append(futureHumidity);
            let futureWind = $("<p>").text("Wind: " + wind + "MPH");
            $(".fiveDay").append(futureWind);
        }
    })
}









})