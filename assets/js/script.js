// Easy access to elements
var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var todaysData = $("#todaysData");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var currentFeels = $("#current-feels");
var UVindex = $("#uv-index");
var fiveDays = $("#cardContainer");
// storing local storage
var locStor;
var currentDate = moment().format("L");
$("#current-date").text(currentDate + " | ");
// Get access to the OpenWeather API
var urlWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var APIkey = "5806b5e472a87f66457f7aa46221f33b";

// Listens to the click on search button
$("#searchForm").submit(function (event) {
  event.preventDefault();
  var searchValue = searchCityInput.val().trim();
  searchValue = capitalize(searchValue);

  currentWeatherRequest(searchValue);
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// This function gets info from openweather.com and returns data needed
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
    if (response) {
      if (!($.inArray(searchValue, locStor) > -1)) {
        locStor.unshift(searchValue);
        toLocalStore();
      }
      renderCities();

      currentCity.text(response.name);
      currentCity.append(
        "<img src='https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png' alt='" +
          response.weather[0].main +
          " ' />"
      );

      // Current Weather
      $("#todaysData").empty();
      todaysData.append(`
      <p class="mb-0" id="current-temp">Temperature: ${response.main.temp}&deg;F</p>
      <p class="mb-0" id="current-humidity">Humidity: ${response.main.humidity}</p>
      <p class="mb-0" id="current-wind-speed">Wind Speed: ${response.wind.speed}</p>
      <p class="mb-0" id="current-feels">Feels like: ${response.main.feels_like}&deg;F</p>
      `);

      var weather = response.weather[0].description;
      if (weather.includes("thunderstorm")) {
        $(".weatherGif").attr(
          "src",
          "https://technical.ly/wp-content/uploads/2020/11/catlightning.gif"
        );
      } else if (weather.includes("rain")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/AmmW05QDA50AAAAM/rain-dreary.gif"
        );
      } else if (weather.includes("snow")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/CcP4jLLCUsMAAAAM/cat-kitty.gif"
        );
      } else if (weather.includes("clear")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/HpXBnJvuA80AAAAC/bask-in-the-sun-cat.gif"
        );
      } else if (weather.includes("clouds")) {
        $(".weatherGif").attr(
          "src",
          "https://media.tenor.com/hoEWP9LL0lkAAAAM/cat-smoke.gif"
        );
      } else if (weather.includes("mist")) {
        $(".weatherGif").attr(
          "src",
          "https://i.pinimg.com/originals/59/05/00/590500ec2b1a24f4d0c6652c58813994.gif"
        );
      } else {
        $(".weatherGif").attr(
          "src",
          "https://static.wikia.nocookie.net/battle-cats/images/b/bf/Catornadoattack.gif/revision/latest?cb=20210810125957"
        );
      }

      // AJAX Call for UV index
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var UVurl =
        "https://api.openweathermap.org/data/2.5/uvi?&lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIkey;
      $.ajax({
        url: UVurl,
        method: "GET",
      }).then(function (response) {
        todaysData.append(`
        <p class="mb-0" id="uv-index">UV index: ${response.value}</p>
      `);
      });

      // Forecast Weather
      var forecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" +
        APIkey +
        "&lat=" +
        lat +
        "&lon=" +
        lon;
      // beginning of 5 days forecast
      $("#cardContainer").empty();
      $.ajax({
        url: forecastURL,
        method: "GET",
      }).then(function (response) {
        // console.log(response.list);
        for (var i = 1; i < response.list.length; i += 8) {
          var forecastDateString = moment(response.list[i].dt_txt).format("L");
          var tempForcast = response.list[i].main.temp;
          var humForcast = response.list[i].main.humidity;
          var windForcast = response.list[i].wind.speed;
          var cardTemplate = $("<div>");
          cardTemplate.addClass("col-2");
          cardTemplate.append(`
            <div class="card">
                <div class="card-body">
                  <div class="card-header">
                    <h6 class="card-title">${forecastDateString}</h6>
                    <img src='https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png' alt='${response.list[i].weather[0].main}' class="forecastIcon"/>
                  </div>
                  <p class="card-text">Temp: ${tempForcast}&deg;F</p>
                  <p class="card-text">Humidity: ${humForcast}%</p>
                  <p class="card-text">Wind: ${windForcast}MPH</p>
                </div>
            </div>
                `);
          fiveDays.append(cardTemplate);
        }
      });
    }
    $(document).ajaxError(function () {
      currentCity.text("Invalid City Name");
      $("#todaysData").empty();
      $("#cardContainer").empty();
    });
    // end of 5 days forecast
  });
}

// saves city name to the local storage
function toLocalStore() {
  localStorage.setItem("cityName", JSON.stringify(locStor));
}

// extracts city name from local storage
function fromLocalStore() {
  var arr = localStorage.getItem("cityName");
  if (arr) {
    locStor = JSON.parse(arr);
  } else {
    locStor;
  }
}

// Dynamically creates list of saved cities
function renderCities() {
  toLocalStore();
  var tempTop =
    '<button class="btn btn-info city-btn cityButtons"  type="button">';
  var tempBut = "</button>";
  searchHistoryList.empty();

  for (let i = 0; i < locStor.length; i++) {
    var city = locStor[i];
    var finalTem = tempTop + city + tempBut;
    searchHistoryList.prepend(finalTem);
  }
}

clearHistoryButton.on("click", function () {
  locStor = [];
  renderCities();
});

// Clicking on a button in the search history sidebar
// will populate the dashboard with info on that city
searchHistoryList.on("click", ".city-btn", function (event) {
  var value = event.target.innerText;
  currentWeatherRequest(value);
});

fromLocalStore();
renderCities();
currentWeatherRequest("Denver");

//end of Wesley's code

// //Michael's codebase
var newsArticles = $(".newsArticles");
var savedArticles = $(".savedLinks");
var savedNewsArray = [];

function getCategory() {
  var category = $("#category option:selected").val();
  var requestUrlNews =
    "https://newsdata.io/api/1/news?apikey=pub_17675a17f958f2718941958f957ad8ec3902a&country=us&category=" +
    category;
  localStorage.setItem("lastCategory", JSON.stringify(requestUrlNews));
  getNewsApi(requestUrlNews);
}

function getNewsApi(requestUrlNews) {
  fetch(requestUrlNews)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);

      newsArticles.empty();

      for (var i = 0; i < data.results.length; i++) {
        printResults(data.results[i]);
      }

      $(".saveBtn").on("click", function () {
        var clickBtn = $(this);
        var savedArticle = clickBtn.parent().children().html();
        savedNewsArray.push(savedArticle);
        localStorage.setItem("savedArticles", savedNewsArray);
        console.log(savedNewsArray);
      });
    });
}

function printResults(resultObj) {
  var newsCard = $("<div></div>");
  newsCard.addClass("bg-light text-dark mb-3 p-3 newsCardStyle");

  var newsBody = $("<div></div>");
  newsBody.addClass("newsBody");
  newsCard.append(newsBody);

  var yNewsBox = $("<div></div>");
  yNewsBox.addClass("yNewsBoxStyle");
  newsBody.append(yNewsBox);

  var newsTitle = $("<h3></h3>");
  newsTitle.text(resultObj.title);

  var bodyContentNews = $("<p></p>");
  bodyContentNews.html(
    "<strong>Date:</strong>" + resultObj.pubDate.split("", 3) + "<br/>"
  );
  bodyContentNews.html(
    "<strong>Description: </strong>" + resultObj.description + " "
  );

  var linkNewsArticle = $("<a></a>");
  linkNewsArticle.text("Read More...");
  linkNewsArticle.attr("href", resultObj.link);
  linkNewsArticle.addClass("readMoreStyle");

  var newSaveButton = $(
    '<button class="iconButton saveBtn" type="Button"> <i class="fa-solid fa-floppy-disk insideButton"></i> </button>'
  );

  bodyContentNews.append(linkNewsArticle);
  yNewsBox.append(newsTitle, bodyContentNews);
  newsBody.append(yNewsBox, newSaveButton);

  newsArticles.append(newsCard);
  newsArticles.css({
    overflow: "scroll",
    height: "500px",
    "border-radius": "25px",
    padding: "25px",
  });
}

var showingSave = 0;
$("#showSavesButton").on("click", function () {
  if (showingSave === 0) {
    $(".savedLinks").css("display", "block");
    $("#clearNewsSavesButton").css("display", "flex");
    showingSave++;
  } else {
    $(".savedLinks").css("display", "none");
    $("#clearNewsSavesButton").css("display", "none");
    showingSave--;
  }
});
$("#clearNewsSavesButton").on("click", function () {});
$("#category").on("change", getCategory);

getNewsApi(JSON.parse(localStorage.getItem("lastCategory")));

//Thomas' codeBase
// var mapKey =
//   ".png?tileSize=256&view=Unified&language=NGT&key=s7oWBNNhwPyZDk4QnaRtZ9orhOFiKZOM";
// var tileFetchUrl = "https://api.tomtom.com/map/1/tile/basic/main/11/";
// var tileTL = tileFetchUrl + "426/776" + mapKey;
// var tileTR = tileFetchUrl + "427/776" + mapKey;
// var tileBL = tileFetchUrl + "426/777" + mapKey;
// var tileBR = tileFetchUrl + "427/777" + mapKey;
// var topRowEl = document.querySelector("#topRow");
// var bottomRowEl = document.querySelector("#bottomRow");
// var mapContainerEl = document.querySelector("#map-containernumerodos");
// var mapContainerEl = document.querySelector("#mapContainerPart2");
// var trafficContainerEl = document.querySelector("#trafficContainer");

// var trafficFetchUrl =
//   "https://api.tomtom.com/traffic/map/4/tile/flow/relative0/11/";
// var trafficTL = trafficFetchUrl + "426/776" + mapKey;
// var trafficTR = trafficFetchUrl + "427/776" + mapKey;
// var trafficBL = trafficFetchUrl + "426/777" + mapKey;
// var trafficBR = trafficFetchUrl + "427/777" + mapKey;

// function fetchMapTile(tileUrl) {
//   fetch(tileUrl)
//     .then(function (response) {
//       return response;
//     })
//     .then(function (data) {
//       console.log(data);
//       var mapTile = document.createElement("img");
//       mapTile.setAttribute("src", data.url);
//       mapContainerEl.appendChild(mapTile);
//     });
// }
// fetchMapTile(tileTL);
// fetchMapTile(tileTR);
// fetchMapTile(tileBL);
// fetchMapTile(tileBR);

// fetch(trafficTL)
//   .then(function (response) {
//     return response;
//   })
//   .then(function (data) {
//     var mapTile = document.createElement("img");
//     mapTile.setAttribute("src", data.url);
//     mapTile.classList.add("overlayTrafficTL");
//     mapContainerEl.appendChild(mapTile);
//   });

// fetch(trafficTR)
//   .then(function (response) {
//     return response;
//   })
//   .then(function (data) {
//     var mapTile = document.createElement("img");
//     mapTile.setAttribute("src", data.url);
//     mapTile.classList.add("overlayTrafficTR");
//     mapContainerEl.appendChild(mapTile);
//   });

// fetch(trafficBL)
//   .then(function (response) {
//     return response;
//   })
//   .then(function (data) {
//     var mapTile = document.createElement("img");
//     mapTile.setAttribute("src", data.url);
//     mapTile.classList.add("overlayTrafficBL");
//     mapContainerEl.appendChild(mapTile);
//   });

// fetch(trafficBR)
//   .then(function (response) {
//     return response;
//   })
//   .then(function (data) {
//     var mapTile = document.createElement("img");
//     mapTile.setAttribute("src", data.url);
//     mapTile.classList.add("overlayTrafficBR");
//     mapContainerEl.appendChild(mapTile);
//   });

// fetchTile(tileTL);
// fetchTile(tileTR);
// fetchTile(tileBL);
// fetchTile(tileBR);
// dropdown;
