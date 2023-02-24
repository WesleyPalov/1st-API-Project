//Wesley's CodeBase
var searchFieldEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#searchBtn");
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var weatherApiKey = "&appid=bb7d0040d30c625c65c4836bd0556ffe";

$(searchBtnEl).on("click", function (event) {
  event.preventDefault();

  var userSearch =
    weatherUrl + searchFieldEl.value + "&limit=1" + weatherApiKey;
  if (!searchFieldEl.value) {
    console.log("please search a city");
  } else {
    fetch(userSearch)
      .then(function (response) {
        return response.json();
      })

      .then(function (data) {
        console.log(data);
      });
  }
});

//Michael's codebase
var requestUrlNews =
  "https://newsdata.io/api/1/news?apikey=pub_17675a17f958f2718941958f957ad8ec3902a&country=us&category=world";

function getNewsApi() {
  fetch(requestUrlNews)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

getNewsApi();

//Thomas' codeBase
var mapKey = "s7oWBNNhwPyZDk4QnaRtZ9orhOFiKZOM";
var testTile =
  "https://api.tomtom.com/map/1/tile/basic/main/11/426/777.png?tileSize=256&view=Unified&language=NGT&key=";
var mapEl = document.querySelector("#mapContainer");

function fetchTile() {
  fetch(testTile + mapKey)
    .then(function (response) {
      return response;
    })
    .then(function (data) {
      console.log(data);
      var mapTile = document.createElement("img");
      mapTile.setAttribute("src", data.url);
      mapEl.appendChild(mapTile);
    });
}

fetchTile();
