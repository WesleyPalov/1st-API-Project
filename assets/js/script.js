// Easy access to elements
var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var currentFeels = $("#current-feels");
var UVindex = $("#uv-index");
var fiveDays = $("#five-day-forecast");
// storing local storage 
var locStor;
var weatherContent = $("#weather-content");
var currentDate = moment().format('L');
$("#current-date").text("(" + currentDate + ")");
// Get access to the OpenWeather API
var urlWeather =  "https://api.openweathermap.org/data/2.5/weather?q=";
var APIkey = "5806b5e472a87f66457f7aa46221f33b"
// Listenes to the click on search button
searchCityButton.on("click", function (event){
    event.preventDefault();
    var searchValue = searchCityInput.val().trim();
    if (searchValue === "") {
    alert("Please enter City name to know the current weather");
   } 
   currentWeatherRequest(searchValue);
   locStor.push(searchValue);
   weatherContent.removeClass("hide");
   clearHistoryButton.removeClass("hide");
   toLocalStore();
   renderCities();
 });
// This function gets info from openweather.com and returns data needed
function currentWeatherRequest(searchValue) {
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET", 
    }).then(function(response){
      //  console.log(response.cod);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + " %");
        currentWindSpeed.text(response.wind.speed + " MPH");
        currentFeels.text(response.main.feels_like);
        currentFeels.append(" &deg;F");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
        // AJAX Call for UV index
        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function(response){
           UVindex.text(response.value);
        });
   
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey + "&lat=" + lat +  "&lon=" + lon;
        // beginning of 5 days forcast
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
            console.log(response.list);
            $('#five-day-forecast').empty();
            for (var i = 1; i < response.list.length; i+=8) {
                var forecastDateString = moment(response.list[i].dt_txt).format("L");
                console.log(forecastDateString);
                var tempForcast =(response.list[i].main.temp)
                var humForcast = (response.list[i].main.humidity)
                var windForcast = (response.list[i].wind.speed)
                console.log(windForcast);
                //console.log(tempForcast);
                var cardTemplate = $("<div>");
                cardTemplate.addClass("col-2");
                cardTemplate.append(`
                <div class="card">
                <div class="card-body">
                <h6 class="card-title">Date: ${forecastDateString} </h6>
                <img src='https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png' alt='${response.list[i].weather[0].main}'/>
                <p class="card-text">Temp: ${tempForcast}  &deg;F </p>
                <p class="card-text">Humidity: ${humForcast} % </p>
                <p class="card-text">Wind: ${windForcast} MPH</p>
                </div>
            </div>
                `)
                fiveDays.append(cardTemplate)
            }});

// end of 5 days forcast
}
)}; 
// saves city name to the local storage
function toLocalStore(){
localStorage.setItem("cityName",  JSON.stringify(locStor));
}
// extractx city name from local storage
function fromLocalStore() {
var arr = localStorage.getItem("cityName");
     if(arr) {
locStor = JSON.parse(arr)
     }
     else {
    locStor = [];
     }
}
// Dynamically creates list of saved cities 
function renderCities() {
var tempTop = '<li class="list-group-item"> <button class="btn btn-info city-btn"  type="button" >'
var tempBut = "</button> </li>"
searchHistoryList.empty()
for (let i = 0; i < locStor.length; i++) {
var city = locStor[i];
var finalTem = tempTop + city + tempBut;
searchHistoryList.prepend(finalTem);
}
}

fromLocalStore()
renderCities();
clearHistoryButton.on("click", function(){
// Empty out the  city list array
locStor = [];
localStorage.clear();
     //searchHistoryList.empty();
localStorage.setItem("cityName",  JSON.stringify(locStor));
     // hides clear btn
clearHistoryButton.addClass("hide");
     // hides the weather main section
weatherContent.addClass("hide");

renderCities();
})
// Clicking on a button in the search history sidebar
// will populate the dashboard with info on that city
searchHistoryList.on("click",".city-btn", function(event) {
var value = event.target.innerText
currentWeatherRequest(value);
});
// end of Wesley's code


//Michael's codebase

$("#category").on("change", getCategory);

function getCategory() {
  var category = $("#category option:selected").val();
  var requestUrlNews =
    "https://newsdata.io/api/1/news?apikey=pub_177975100b458a5296d87e0ed7210ba464f97&country=us&category=" +
    category;
  getNewsApi(requestUrlNews);
}

function getNewsApi(requestUrlNews) {
  fetch(requestUrlNews)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

//Thomas' codeBase
var mapKey =
  ".png?tileSize=256&view=Unified&language=NGT&key=s7oWBNNhwPyZDk4QnaRtZ9orhOFiKZOM";
var tileFetchUrl = "https://api.tomtom.com/map/1/tile/basic/main/11/";
var tileTL = tileFetchUrl + "426/776" + mapKey;
var tileTR = tileFetchUrl + "427/776" + mapKey;
var tileBL = tileFetchUrl + "426/777" + mapKey;
var tileBR = tileFetchUrl + "427/777" + mapKey;
var topRowEl = document.querySelector("#topRow");
var bottomRowEl = document.querySelector("#bottomRow");

function fetchTile(tileUrl) {
  fetch(tileUrl)
    .then(function (response) {
      return response;
    })
    .then(function (data) {
      console.log(data);
      var mapTile = document.createElement("img");
      mapTile.setAttribute("src", data.url);
      console.log(tileUrl);
      console.log(typeof tileUrl);
      if (tileUrl.includes("776")) {
        topRowEl.appendChild(mapTile);
      } else {
        bottomRowEl.appendChild(mapTile);
      }
    });
}

fetchTile(tileTL);
fetchTile(tileTR);
fetchTile(tileBL);
fetchTile(tileBR);