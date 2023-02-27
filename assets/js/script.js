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
var fiveDays = $("#cardContainer");
// storing local storage
var locStor = [];
var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");
// Get access to the OpenWeather API
var urlWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var APIkey = "5806b5e472a87f66457f7aa46221f33b";
// Listenes to the click on search button
searchCityButton.on("click", function (event) {
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
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    //  console.log(response.cod);
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
    currentHumidity.text(response.main.humidity + " %");
    currentWindSpeed.text(response.wind.speed + " MPH");
    currentFeels.text(response.main.feels_like);
    currentFeels.append(" &deg;F");
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
      UVindex.text(response.value);
    });

    var forecastURL =
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" +
      APIkey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;
    // beginning of 5 days forcast
    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      console.log(response.list);
      $("#five-day-forecast").empty();
      for (var i = 1; i < response.list.length; i += 8) {
        var forecastDateString = moment(response.list[i].dt_txt).format("L");
        console.log(forecastDateString);
        var tempForcast = response.list[i].main.temp;
        var humForcast = response.list[i].main.humidity;
        var windForcast = response.list[i].wind.speed;
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
                `);
        fiveDays.append(cardTemplate);
      }
    });

    // end of 5 days forcast
  });
}
// saves city name to the local storage
function toLocalStore() {
  localStorage.setItem("cityName", JSON.stringify(locStor));
}
// extractx city name from local storage
function fromLocalStore() {
  var arr = localStorage.getItem("cityName");
  if (arr) {
    locStor = JSON.parse(arr);
  } else {
    locstor = [];
  }
}
// Dynamically creates list of saved cities
function renderCities() {
  var tempTop =
    '<li class="list-group-item"> <button class="btn btn-info city-btn"  type="button" >';
  var tempBut = "</button> </li>";
  searchHistoryList.empty();

  for (let i = 0; i < locStor.length; i++) {
    var city = locStor[i];
    var finalTem = tempTop + city + tempBut;
    searchHistoryList.prepend(finalTem);
  }
}

fromLocalStore();
renderCities();
clearHistoryButton.on("click", function () {
  // Empty out the  city list array
  locStor = [];
  localStorage.clear();
  //searchHistoryList.empty();
  localStorage.setItem("cityName", JSON.stringify(locStor));
  // hides clear btn
  clearHistoryButton.addClass("hide");
  // hides the weather main section
  weatherContent.addClass("hide");

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

//Michael's CodeBase (News Article Section)
//GLOBAL VARIBLES
var newsArticles = $(".newsArticles");
var savedArticles = $(".savedLinks");
var savedNewsArray = JSON.parse(localStorage.getItem("savedArticles")) || [];
var showingSave = 0;

//FUNCTIONS

function getCategory() {
  var category = $("#category option:selected").val(); //Grabs user's selection
  //var set to api's url and attaches the users option to select type of news
  var requestUrlNews =
    "https://newsdata.io/api/1/news?apikey=pub_17675a17f958f2718941958f957ad8ec3902a&country=us&category=" +
    category;
  //saves selected category to local storage
  localStorage.setItem("lastCategory", JSON.stringify(requestUrlNews));
  //passes the custom url to getNewsApi Function
  getNewsApi(requestUrlNews);
}

function getNewsApi(requestUrlNews) {
  fetch(requestUrlNews) // takes passed url and calls a response to news server
    .then(function (response) {
      //sets response to array
      return response.json();
    })
    .then(function (data) {
      //empties the news article element
      newsArticles.empty();

      //for loop to take the data and push to function printResults and calls it for based off the length of the data
      for (var i = 0; i < data.results.length; i++) {
        printResults(data.results[i]);
      }

      // event lisenter method set to the savebtns in articles
      $(".saveBtn").on("click", function () {
        //sets the btn to listen to specific article
        var clickBtn = $(this);
        //sets to the inner html of each article
        var savedArticle = clickBtn.parent().children().html();
        //pushes innerHTML to empty array
        savedNewsArray.push(savedArticle);
        //saves new array to localstorage everytime  btn is pushed
        localStorage.setItem("savedArticles", JSON.stringify(savedNewsArray));
      });
    });
}

function printResults(resultObj) {
  //builds new div element
  var newsCard = $("<div></div>");
  //sets class values to newly mad div
  newsCard.addClass("bg-light text-dark mb-3 p-3 newsCardStyle");

  var newsBody = $("<div></div>");
  newsBody.addClass("newsBody");
  //appends newsBody to newsCard
  newsCard.append(newsBody);

  var yNewsBox = $("<div></div>");
  yNewsBox.addClass("yNewsBoxStyle");
  newsBody.append(yNewsBox);

  //builds h3 element
  var newsTitle = $("<h3></h3>");
  //sets h3 text to data title
  newsTitle.text(resultObj.title);

  //builds p element
  var bodyContentNews = $("<p></p>");
  //sets p text to string with depscription and date
  bodyContentNews.html(
    "<strong>Date:</strong>" +
      resultObj.pubDate.slice(0, -8) + //removes the last 8 characters of the string
      "<br/> <strong>Description: </strong>" +
      resultObj.description +
      " "
  );

  //builds a tags
  var linkNewsArticle = $("<a></a>");
  linkNewsArticle.text("Read More");
  linkNewsArticle.attr("href", resultObj.link);
  linkNewsArticle.addClass("btn-dark");

  //builds the save btn and sets the icon
  var newSaveButton = $(
    '<button class="iconButton saveBtn" type="Button"> <i class="fa-solid fa-floppy-disk insideButton"></i> </button>'
  );

  //appends built custom div
  bodyContentNews.append(linkNewsArticle);
  yNewsBox.append(newsTitle, bodyContentNews);
  newsBody.append(yNewsBox, newSaveButton);

  //appends built div to the DOM
  newsArticles.append(newsCard);

  //sets a scrolling box for the news divs
  newsArticles.css({
    overflow: "scroll",
    width: "1075px",
    height: "500px",
    "border-radius": "25px",
    padding: "25px",
  });
}

function printSavedResults(savedObj) {
  var savedCard = $("<div></div>");
  savedCard.addClass("bg-light text-dark mb-3 p-3 newsCardStyle");

  //takes passed object sets the innerHTML of savedCard
  savedCard.html(savedObj);

  var sinlgeClearButton = $(
    '<button class="iconButton" id="clearBtn" type="Button"> <i class="fa-solid fa-trash insideButton"></i> </button>'
  );

  savedCard.append(sinlgeClearButton);
  //appends savedCard to DOM
  savedArticles.append(savedCard);

  savedArticles.css({
    overflow: "scroll",
    height: "500px",
    "border-radius": "25px",
    padding: "25px",
  });
}

//gets the saved catergory from users last load/refresh
getNewsApi(JSON.parse(localStorage.getItem("lastCategory")));

//EVENT LISTNERS

$("#showSavesButton").on("click", function () {
  //if statement to check the global var
  if (showingSave === 0) {
    //stlyes the class object saved Articles if the value of showingSave is 0
    savedArticles.css("display", "block");
    $("#clearNewsSavesButton").css("display", "flex");
    showingSave++;
  } else {
    //stlyes the class object saved Articles if the value of showingSave is 1
    savedArticles.css("display", "none");
    $("#clearNewsSavesButton").css("display", "none");
    showingSave--;
  }

  if (showingSave === 1) {
    newsArticles.css("display", "none");
    $("#newsHeader h2").text("Saved Articles");
  } else {
    newsArticles.css("display", "block");
    $("#newsHeader h2").text("News Articles");
  }
  savedArticles.empty();
  //for to run for the length of global array and calls function printSavedResults
  for (var i = 0; i < savedNewsArray.length; i++) {
    printSavedResults(savedNewsArray[i]);
  }
});

$("#clearNewsSavesButton").on("click", function () {
  //empties the div
  savedArticles.empty();
  //empties the array and resets the localstorage
  savedNewsArray = [];
  localStorage.removeItem("savedArticles", []);
});

$("#category").on("change", getCategory);

// Thomas' codeBase
var mapKey =
  ".png?tileSize=256&view=Unified&language=NGT&key=s7oWBNNhwPyZDk4QnaRtZ9orhOFiKZOM";
var tileFetchUrl = "https://api.tomtom.com/map/1/tile/basic/main/11/";
var tileTL = tileFetchUrl + "426/776" + mapKey;
var tileTR = tileFetchUrl + "427/776" + mapKey;
var tileBL = tileFetchUrl + "426/777" + mapKey;
var tileBR = tileFetchUrl + "427/777" + mapKey;
var topRowEl = document.querySelector("#topRow");
var bottomRowEl = document.querySelector("#bottomRow");
var mapContainerEl = document.querySelector("#map-containernumerodos");
var mapContainerEl = document.querySelector("#mapContainerPart2");
var trafficContainerEl = document.querySelector("#trafficContainer");

var trafficFetchUrl =
  "https://api.tomtom.com/traffic/map/4/tile/flow/relative0/11/";
var trafficTL = trafficFetchUrl + "426/776" + mapKey;
var trafficTR = trafficFetchUrl + "427/776" + mapKey;
var trafficBL = trafficFetchUrl + "426/777" + mapKey;
var trafficBR = trafficFetchUrl + "427/777" + mapKey;

function fetchMapTile(tileUrl) {
  fetch(tileUrl)
    .then(function (response) {
      return response;
    })
    .then(function (data) {
      console.log(data);
      var mapTile = document.createElement("img");
      mapTile.setAttribute("src", data.url);
      mapContainerEl.appendChild(mapTile);
    });
}
fetchMapTile(tileTL);
fetchMapTile(tileTR);
fetchMapTile(tileBL);
fetchMapTile(tileBR);

fetch(trafficTL)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficTL");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficTR)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficTR");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficBL)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficBL");
    mapContainerEl.appendChild(mapTile);
  });

fetch(trafficBR)
  .then(function (response) {
    return response;
  })
  .then(function (data) {
    var mapTile = document.createElement("img");
    mapTile.setAttribute("src", data.url);
    mapTile.classList.add("overlayTrafficBR");
    mapContainerEl.appendChild(mapTile);
  });
