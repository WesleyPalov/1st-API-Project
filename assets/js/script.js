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
