
document.cookie = "Set-Cookie: SameSite=None; Secure"

// Insert current date/time into DOM
var DateTime = luxon.DateTime;
function displayCurrent() {

    var now = DateTime.local().toLocaleString(DateTime.DATETIME_FULL)

    current = $('#today').text(now)
    setInterval(displayCurrent, 60 * 1000);
}

displayCurrent()

// Hide until city search is done
$('#temperature').attr('style', 'display:none')
$('#humidity').attr('style', 'display:none')
$('#wind-speed').attr('style', 'display:none')
$('#uv-index').attr('style', 'display:none')
$('h3').attr('style', 'display:none')
$('.card-group').attr('style', 'display:none')


// Get current weather
var apiKey = configs.MY_KEY;

var cityInput = "";
var stateInput = "";

// event listener
$("#searchButton").on("click", function (event) {

    event.preventDefault();
    // Show fields after search
    $('.forecast').text("")
    $('#temperature').attr('style', 'display:block')
    $('#humidity').attr('style', 'display:block')
    $('#wind-speed').attr('style', 'display:block')
    $('#uv-index').attr('style', 'display:block')
    $('h3').attr('style', 'display:block')
    $('.card-group').attr('style', 'display:flex')

    // grab search inputs for city and state
    cityInput = $('#city-input').val()
    stateInput = $('#state-input').val()

    // search history save
    var searchHistory = $("#search-history")
    var searchHistoryList = $("<li class='list-group-item'>").text(cityInput + " " + stateInput)
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
            $('#uv-index').text("UV Index: " + uvIndex)

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

                }
            }
        });
    });
});

// Render last search into local storage


// WHEN I view the UV index
    // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

// add ons:
    // country
    // page load spinner
