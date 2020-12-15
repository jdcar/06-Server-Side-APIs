
document.cookie = "Set-Cookie: SameSite=None; Secure"

// Insert current date/time into DOM
var DateTime = luxon.DateTime;
function displayCurrent() {

    var now = DateTime.local().toLocaleString(DateTime.DATETIME_FULL)

    current = $('#today').text(now)
    setInterval(displayCurrent, 60 * 1000);
}

displayCurrent()

// Get current weather
var apiKey = configs.MY_KEY;
var cityInput = "";
var stateInput = "";
var fromStorage = localStorage.getItem("city_state")


// If there's something in local storage
if (fromStorage) {
    console.log("something is in storage")
    cityInput = JSON.parse(fromStorage).city
    stateInput = JSON.parse(fromStorage).state
    getWeather()


} else if (fromStorage === null) {

    // Hide until city search is done
    $('#temperature').attr('style', 'display:none')
    $('#humidity').attr('style', 'display:none')
    $('#wind-speed').attr('style', 'display:none')
    $('#uv-index').attr('style', 'display:none')
    $('h3').attr('style', 'display:none')
    $('.card-group').attr('style', 'display:none')
    // Do the event listener
    // Get the weather


}

// event listener for search button
$("#searchButton").on("click", function (event) {

    event.preventDefault();

    // grab search inputs for city and state
    cityInput = $('#city-input').val()
    stateInput = $('#state-input').val()

    var local = {
        city: cityInput,
        state: stateInput
    }

    localStorage.setItem("city_state", JSON.stringify(local))

    // search history save
    var searchHistory = $("#search-history")
    var searchHistoryList = $("<li class='list-group-item'>").text(cityInput + " " + stateInput)
    searchHistory.prepend(searchHistoryList)
    // 

    getWeather();
});

function getWeather() {

    // Show fields after search
    $('.forecast').text("")
    $('#temperature').attr('style', 'display:block')
    $('#humidity').attr('style', 'display:block')
    $('#wind-speed').attr('style', 'display:block')
    $('#uv-index').attr('style', 'display:block')
    $('h3').attr('style', 'display:block')
    $('.card-group').attr('style', 'display:flex')

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
        $('#temperature').text("Temperature: " + parseInt(temp) + "°F")

        // humidity
        var humidity = response.main.humidity
        $('#humidity').text("Humidity: " + humidity + "%")
        // wind 
        var wind = response.wind.speed
        $('#wind-speed').text("Wind speed: " + parseInt(wind) + " mph")
        // latitude
        var lat = response.coord.lat
        // longitute
        var lon = response.coord.lon
        // city id
        var cityId = response.id

        // ICON insert-----

        var iconLarge = response.weather[0].icon

        var iconURLlarge = "https://openweathermap.org/img/wn/" + iconLarge + "@2x.png"


        $('#city-name').append(`<img id="icons" src= ${iconURLlarge} />`)


        var queryForUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

        $.ajax({
            url: queryForUv,
            method: "GET"
        }).then(function (response) {

            var uvIndex = response.value
            // var uvIndex = ;
            $('#uv-index').text("UV Index: " + uvIndex)
            console.log(response)

            // if uv index is 0 to 2
            if (uvIndex > 0 && uvIndex < 3){
                $('#uv-index').attr('style', 'background-color: #90EE90')
            } else if (uvIndex >= 3 && uvIndex < 5){
                $('#uv-index').attr('style', 'background-color: yellow')
            } else if (uvIndex >= 6 && uvIndex < 8){
                $('#uv-index').attr('style', 'background-color: orange')
            } else if (uvIndex >= 8 && uvIndex < 11){
                $('#uv-index').attr('style', 'background-color: red')
            } else {
                $('#uv-index').attr('style', 'background-color: purple')
            } 
        
            // if uv index is over 11
            // it's purple
        });

        // 5 day forecast 

        var urlFiveDay = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=imperial&appid=${apiKey}`


        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {

            // include temp and humidity
            var count = 0
            for (var i = 0; i < response.list.length; i++) {

                if (response.list[i].dt_txt.includes("12:00:00")) {
                    count++;

                    var dateWithoutTime = response.list[i].dt_txt.replace(/(.....)(.+)(12:00:00)/, "$2")
                    dateWithoutTime = dateWithoutTime.replace("-", "/")


                    var days = $('#day-' + count)
                    var daysForecast = $("<span>").text(dateWithoutTime)
                    days.append(daysForecast)

                    var temps = $('#temp-' + count)
                    var tempsForecast = $("<span>").text(parseInt(response.list[i].main.temp))
                    temps.append(tempsForecast).append("°F")

                    var humiditys = $('#humid-' + count)
                    var humiditysForecast = $("<span>").text(response.list[i].main.humidity)
                    humiditys.append(humiditysForecast).append("%")

                    var iconSmall = $('#temp-' + count)
                    var iconsForecast = $(`<img id="icons" src= ${"https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png"} />`)
                    iconSmall.append(iconsForecast)

                    // Save everything to local storage

                }
            }
        });
    });

}


// End render
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


// add ons:
    // country
    // page load spinner
