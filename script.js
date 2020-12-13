
// Insert current date/time into DOM
var DateTime = luxon.DateTime;
function displayCurrent() {

    var now = DateTime.local().toLocaleString(DateTime.DATETIME_FULL)

    current = $('#today').text(now)
    setInterval(displayCurrent, 1000);
}

displayCurrent()


// Get current weather
var apiKey = "e96e2d58ecbe86104285358be908972d"
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

        var queryForUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

        $.ajax({
            url: queryForUv,
            method: "GET"
        }).then(function (response) {

            var uvIndex = response.value
            $('#uv-index').text("UV Index: " + uvIndex)

        });
    });
});




// five day 
// add ons:
    // country
    // add image of city
    // page load spinner
