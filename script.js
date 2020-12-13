
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
var city = "Chicago";
var state = "Illinois";

// event listener
$("#searchButton").on("click", function (event) {

    event.preventDefault();
    // grab search inputs for city and state
    var cityInput = $('#city-input').val()
    var stateInput = $('#state-input').val()

    // query for just city
    var queryURLnoState = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

    // query for city-state
    var queryURLwithState = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput}&appid=${apiKey}`

    if (cityInput != "" && stateInput != "") {

        $.ajax({
            url: queryURLwithState,
            method: "GET"
        }).then(function (response) {
            console.log(response.wind.speed)
            // temperture
            var temp = response.main.temp
            $('#temperature').append(temp + " degrees")

            // humidity
            var humidity = response.main.humidity
            $('#humidity').append(humidity + "%")
            // wind 
            var wind = response.wind.speed
            $('#wind-speed').append(wind + " mph")
            // latitude
            var lat = response.coord.lat
            // longitute
            var lon = response.coord.lon

            var queryForUv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

            $.ajax({
                url: queryForUv,
                method: "GET"
            }).then(function (response) {
    
                console.log(response.value)

                var uvIndex = response.value
                $('#uv-index').append(uvIndex)
    
                // uv index
                // response. 
    
            });

            


        });
    } else if (cityInput != "" && stateInput === "") {

        $.ajax({
            url: queryURLnoState,
            method: "GET"
        }).then(function (response) {

            console.log(response)

            // temperture
            // humidity
            // wind 
            // uv index

        });
    }



});

// function getWeather () {

//     console.log(reponse.)
//             // temperture
//             // humidity
//             // wind 
//             // uv index


// }
