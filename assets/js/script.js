//Wesley's CodeBase
// Easy access to elements
var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");
// storing local storage
var locStor;

var weatherContent = $("#weather-content");

var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

console.log(currentDate);
// Get access to the OpenWeather API
var urlWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var APIkey = "5806b5e472a87f66457f7aa46221f33b";

searchCityButton.on("click", function (event) {
  event.preventDefault();
  var searchValue = searchCityInput.val().trim();
  if (searchValue === "") {
    alert("Please enter City name know the current weather");
  } else console.log(searchValue);
  currentWeatherRequest(searchValue);
  locStor.push(searchValue);
  weatherContent.removeClass("hide");
  clearHistoryButton.removeClass("hide");
  toLocalStore();
  renderCities();
});

function currentWeatherRequest(searchValue) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    currentCity.text(response.name);
    currentCity.append("<small class='text-muted' id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    currentCity.append(
      "<img src='https://openweathermap.org/img/w/" +
        response.weather[0].icon +
        ".png' alt='" +
        response.weather[0].main +
        "' />"
    );
    currentTemp.text(response.main.temp);
    currentTemp.append("&deg;F");
    currentHumidity.text(response.main.humidity + "%");
    currentWindSpeed.text(response.wind.speed + "MPH");

    var lat = response.coord.lat;
    var lon = response.coord.lon;

    var UVurl =
      "https://api.openweathermap.org/data/2.5/uvi?&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      APIkey;
    // AJAX Call for UV index
    $.ajax({
      url: UVurl,
      method: "GET",
    }).then(function (response) {
      console.log("UV call: ");

      UVindex.text(response.value);
    });
  });
}

function toLocalStore() {
  localStorage.setItem("cityName", JSON.stringify(locStor));
}

function fromLocalStore() {
  var arr = localStorage.getItem("cityName");
  if (arr) {
    locStor = JSON.parse(arr);
  } else {
    locStor = [];
  }
}
function renderCities() {
  var tempTop =
    '<li class="list-group-item"> <button class="btn btn-info city-btn"  type="button" >';
  var tempBut = "</button> </li>";
  searchHistoryList.empty();
  for (let i = 0; i < locStor.length; i++) {
    var city = locStor[i];
    var finalTem = tempTop + city + tempBut;
    searchHistoryList.append(finalTem);
  }
}
fromLocalStore();
renderCities();
clearHistoryButton.on("click", function () {
  // Empty out the  city list array
  locStor = [];
  console.log(locStor);
  renderCities();
  // Update city list history in local storage
  //listArray();

  //  $(this).addClass("hide");
});
console.log(locStor);

// Clicking on a button in the search history sidebar
// will populate the dashboard with info on that city
searchHistoryList.on("click", "btn.btn-info", function (event) {
  console.log("dfd");
  console.log($(this).data("value"));
  var value = $(this).data("value");
  //currentConditionsRequest(value);
  // searchHistory(value);
});
// console.log(tempTop);

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

    for (var i = 0; i < data.results.length; i++) {
      printResults(data.results[i]);
    }
}

function printResults(resultObj) {
  var newsCard = $("<div></div>");
  newsCard.addClass('bg-light', 'text-dark', 'mb-3', 'p-3');

  var newsBody = $("<div></div>");
  newsBody.addClass('news-body');
  newsCard.append(newsBody);

  var newsTitle = $("<h3></h3>");
  newsTitle.text(resultObj.title);

  var bodyContentNews = $("<p></p>");
  
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