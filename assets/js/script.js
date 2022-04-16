$(document).ready(function () {
    const apiKey = "dc29ad80b0ec9912243321a6824d9baa";
    var cities = [];
    var historyContainer = $(".list-group");
    var searchInput = $("#search-input");
    var searchHistoryContainer = $("#history");
    
    // function to render search history list
    function renderSearchHistory() {
      searchHistoryContainer.html("");
      for (var i = cities.length - 1; i >= 0; i--) {
        var listCities = $("<button>")
          .attr("type", "button")
          .addClass("list-group-item list-group-item-action savedCity")
          .text(cities[i]);
        listCities.attr("data-search", cities[i]);
        searchHistoryContainer.append(listCities);
      }
    }
    
    //function to append search history to local storage
    function appendHistory(search) {
      if (cities.indexOf(search) !== -1) {
        return;
      }
      cities.push(search);
  
      localStorage.setItem("search-history", JSON.stringify(cities));
      renderSearchHistory();
    }
    
    // function to get search history from local storage
    function getSearchHistory() {
      var storedHistory = localStorage.getItem("search-history");
      if (storedHistory) {
        cities = JSON.parse(storedHistory);
      }
      renderSearchHistory();
    }

    //Calling a city to search
    $("#searchBtn").on("click", function () {
      let citySearch = $("#searchInput").val();
      if (citySearch === "") {
        return null;
      }
  
      //removing the hide classes
      $("#currentWeather").removeClass("hide");
      $("#fiveDay").removeClass("hide");
      $("#cTitle").removeClass("hide");
      $("#fTitle").removeClass("hide");
  
      //Calling Current Weather
      getCurrentWeather(citySearch);
  
      //Clear value after search so you can't spam the same city
      $("#searchInput").val("");
  
      //Clearing Out so it doesn't stack
      $(".currentWeather").empty();
      $(".fiveDay").empty();
    });
  
    //Current Weather Function
    function getCurrentWeather(citySearch) {
      //API for Current Weather
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`;
      
      fetch(currentWeatherUrl)
        .then((response) => response.json())
        .then((data) => {
          //console.log("currentDay", data)
          //Setting the data needed
          appendHistory(citySearch);
          let cityName = data.name;
          let temp = data.main.temp;
          let humidity = data.main.humidity;
          let wind = data.wind.speed;
          let date = data.coord.dt;
          //Grabbing the Icon
          let icon = data.weather[0].icon;
          let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
  
          //Creating and Appending the data to the Current Weather Card
          let nameEl = $("<h3>")
            .addClass("card-title")
            .text(cityName + " " + moment(date).format("MMMM Do YYYY"));
          const cardHeader = $("<div class='card-header'>");
          cardHeader.append(nameEl);
          $(".currentWeather").append(cardHeader);
          let currentIcon = $("<img>").attr("src", iconUrl);
          $(".currentWeather").append(currentIcon);
          let currentTemp = $("<p>")
            .addClass("card-text")
            .text("Temp: " + temp + "\xB0" + "F");
          $(".currentWeather").append(currentTemp);
          let currentHumidity = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + humidity + " %");
          $(".currentWeather").append(currentHumidity);
          let currentWind = $("<p>")
            .addClass("card-text")
            .text("Wind: " + wind + " MPH");
          $(".currentWeather").append(currentWind);
  
          //Grabbing the coords for the five day function
          let coords = {
            lat: data.coord.lat,
            lon: data.coord.lon,
          };
  
          getFiveDay(coords);
        });
    }
    //Five Day Forecast Function
    function getFiveDay(coords) {
      //API for Five Day
      const getFiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`;
  
      fetch(getFiveDayUrl)
        .then((response) => response.json())
        .then((data) => {
    
          //UV Index for the Current Weather (In here so I dont have to pull another API to just get the UV)
          let uvIndex = $("<p>")
            .addClass("card-text")
            .text("UV Index: " + data.daily[0].uvi);
          $(".currentWeather").append(uvIndex);
          if (data.daily[0].uvi < 2) {
            $(uvIndex).addClass("badge badge-pill low");
          } else if (data.daily[0].uvi > 2 && data.daily[0].uvi <= 5) {
            $(uvIndex).addClass("badge badge-pill moderate");
          } else if (data.daily[0].uvi > 5 && data.daily[0].uvi <= 7) {
            $(uvIndex).addClass("badge high");
          } else if (data.daily[0].uvi > 7 && data.daily[0].uvi <= 10) {
            $(uvIndex).addClass("badge vhigh");
          } else {
            $(uvIndex).addClass("xtreme");
          }

          //array for the future days
          let dates = [];
          //Running a loop to grab all the data
          for (var i = 1; i < 6; i++) {
            let fiveDay = data.daily[i];
            let temp = fiveDay.temp.day;
            let humidity = fiveDay.humidity;
            let wind = fiveDay.wind_speed;
            dates[i] = fiveDay.dt;
            let icon = fiveDay.weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
            let date = new Date(dates[i] * 1000);
           
  
            //Creating cards and appending to them the 'Five Day Forecast'
            const card = $("<div>").addClass("card card-bg col-md-2");
            const cardBody = $("<div>").addClass("card-body");
            const cardTitle = $("<div>").addClass("card-title");
            const cardText = $("<div>").addClass("card-text");
            cardBody.append(cardTitle);
            card.append(cardBody);
            $(".fiveDay").append(card);

            let futureDate = $("<h3>").text(moment(date).format("MMMM Do YYYY"));
            cardTitle.append(futureDate);
            let futureIcon = $("<img>").attr("src", iconUrl);
            cardTitle.append(futureIcon);
            let futureTemp = $("<p>").text("Temp: " + temp + "\xB0" + "F");
            cardText.append(futureTemp);
            let futureHumidity = $("<p>").text("Humidity: " + humidity + " %");
            cardText.append(futureHumidity);
            let futureWind = $("<p>").text("Wind: " + wind + " MPH");
            cardText.append(futureWind);
            cardTitle.append(cardText);
          }
        });
    }
    function searchHistoryClick(e) {
      
      if ($(!e.target).is(".savedCity")) {
        return;
      }
      var btn = $(e.target);
      var search = $(btn).attr("data-search");
      console.log(search);
      getCurrentWeather(search);
    }
    searchHistoryContainer.on("click", searchHistoryClick);
    getSearchHistory();
  });