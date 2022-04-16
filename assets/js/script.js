$(document).ready(function(){
    const apiKey = 'dc29ad80b0ec9912243321a6824d9baa';
    var cities = []
    
    $("#searchBtn").on("click", function(){
        let citySearch = $("#searchInput").val()
        if (citySearch === ""){
            return null
        }  
        
        //removing the hide classes 
        $("#currentWeather").removeClass("hide")
        $("#fiveDay").removeClass("hide")
        $("#cTitle").removeClass("hide")
        $("#fTitle").removeClass("hide")
        
        //Calling Current Weather
        getCurrentWeather(citySearch)
        
        //Adding the searched Cities into the array
        cities.push(citySearch)
        savedCities()

        //Making a list of previous searched Cities
        var storedCities = JSON.parse(localStorage.getItem("cities"))
        for (var i = 0; i < cities.length; i++){
            var city = storedCities[i]
            var listCities = $("<button>").attr("type", "button").addClass("list-group-item list-group-item-action savedCity").text(city);
            $(".list-group").append(listCities);
        }
            
        
        
        //Clear value after search so you can't spam the same city
        $("#searchInput").val("");
   
        //Clearing Out so it doesn't stack
        $(".currentWeather").empty();
        $(".fiveDay").empty();

    })

    //$("button").on('click', function(){
       //let savedcity = $(".savedCity").text();
        //$(".currentWeather").empty();
        //$(".fiveDay").empty();
        //getCurrentWeather(savedcity)
        //getFiveDay(savedcity)
    //})

    function savedCities() {
        //Saving to local storage
        localStorage.setItem("cities", JSON.stringify(cities))
    }


    function getCurrentWeather(citySearch){
        //API for Current Weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`

        fetch(currentWeatherUrl)
        .then((response) => response.json())
        .then((data) => {
            //console.log("currentDay", data)
            //Setting the data needed
            let cityName = data.name;
            let temp = data.main.temp;
            let humidity = data.main.humidity;
            let wind = data.wind.speed;
            let date = data.coord.dt
            //Grabbing the Icon
            let icon = data.weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

            //Creating and Appending the data to the Current Weather Card
            let nameEl = $("<h3>").addClass("card-title").text(cityName + " " + moment(date).format('MMMM Do YYYY'));
            const cardHeader = $("<div class='card-header'>")
            cardHeader.append(nameEl)
            $(".currentWeather").append(cardHeader)
            let currentIcon = $("<img>").attr('src', iconUrl);
            $(".currentWeather").append(currentIcon)
            let currentTemp = $("<p>").addClass("card-text").text("Temp: " + temp + '\xB0' + 'F')
            $(".currentWeather").append(currentTemp);
            let currentHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidity + " %")
            $(".currentWeather").append(currentHumidity);
            let currentWind = $("<p>").addClass("card-text").text("Wind: " + wind + " MPH")
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
            //console.log("data from FIVE DAY", data.daily[0])
        
            //UV Index for the Current Weather (In here so I dont have to pull another API to just get the UV)
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
            for(var i = 1; i < 6; i++){
                let fiveDay = data.daily[i];
                let temp = data.daily[i].temp.day;
                let humidity = data.daily[i].humidity;
                let wind = data.daily[i].wind_speed;
                let dates = data.daily[i].dt;
                let icon = data.daily[i].weather[0].icon
                let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
                console.log(dates)
                //let date = moment(dates[i]).format('MMMM Do YYYY');
                    //for (let i= 1; i <= date.length; i++){
                        //console.log("date", date)
                //}

                //Creating cards and appending to them the 'Five Day Forecast'
                const card = $("<div>").addClass("card card-bg col-md-2");
                const cardBody = $("<div>").addClass("card-body");
                const cardTitle = $("<div>").addClass("card-title");
                const cardText = $("<div>").addClass("card-text");
                cardBody.append(cardTitle);
                card.append(cardBody);
                $(".fiveDay").append(card);
                
                //creating data to go into the cards
                let futureDate = $("<h4>").text(moment.utc(dates[i]).format('MMMM Do YYYY'));
                cardTitle.append(futureDate);
                let futureIcon = $("<img>").attr('src', iconUrl);
                cardTitle.append(futureIcon)
                let futureTemp = $("<p>").text("Temp: " + temp + '\xB0' + 'F');
                cardText.append(futureTemp);
                let futureHumidity = $("<p>").text("Humidity: " + humidity + " %");
                cardText.append(futureHumidity);
                let futureWind = $("<p>").text("Wind: " + wind + " MPH");
                cardText.append(futureWind);
                cardTitle.append(cardText)
                console.log(futureDate.text)
            }
        })
    }
    
})
