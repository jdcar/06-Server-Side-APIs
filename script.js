
// Insert current date/time into DOM
var DateTime = luxon.DateTime;
function displayCurrent() {

    var now = DateTime.local().toLocaleString(DateTime.DATETIME_FULL)

    current = $('#today').text(now)
    setInterval(displayCurrent, 1000);
}

displayCurrent()


// Get current weather

var cityInput = "";
var stateInput = "";

// event listener
$("#searchButton").on("click", function (event) {

    event.preventDefault();
    // grab search inputs for city and state
    cityInput = $('#city-input').val()
    stateInput = $('#state-input').val()

    // search history save
    var searchHistory = $("#search-history")
    var searchHistoryList = $("<li class='list-group-item'>").text(cityInput + ", " + stateInput)
    searchHistory.prepend(searchHistoryList)
    // 

    // query for just city
    var queryURLnoState = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${apiKey}`;

    // query for city-state
    var queryURLwithState = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput}&units=imperial&appid=${apiKey}`

    var url = ""

    if (cityInput != "" && stateInput != "") {

        url = queryURLwithState
    } else {
        url = queryURLnoState
    }


    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {

        // console.log(response)

        // city name
        var cityName = response.name
        $('#city-name').text(cityName)
        // temperture
        var temp = response.main.temp
        $('#temperature').text("Temperature: " + temp + "°F")

        // humidity
        var humidity = response.main.humidity
        $('#humidity').text("Humidity: " + humidity + "%")
        // wind 
        var wind = response.wind.speed
        $('#wind-speed').text("Wind speed: " + wind + " mph")
        // latitude
        var lat = response.coord.lat
        // longitute
        var lon = response.coord.lon
        // city id
        var cityId = response.id

        var queryForUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

        $.ajax({
            url: queryForUv,
            method: "GET"
        }).then(function (response) {

            var uvIndex = response.value
            $('#uv-index').text("UV Index: " + uvIndex)

        });

        // 5 day forecast 

        var urlFiveDay = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`


        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {

            console.log(response)

            // include temp and humidity
            
            var nextDay1 = response.list[1]
            var nextDay2 = response.list[2]
            var nextDay2 = response.list[3]
            var nextDay2 = response.list[4]
            var nextDay2 = response.list[5]

            console.log(nextDay1)


        });




    });
});




// five day 
// add ons:
    // country
    // add image of city
    // page load spinner
