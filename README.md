# The Daily Brew

## Goal of the App

The intention behind this web application is to build an all-in-one stop for users in the Denver metro area. The user can quickly access the current and future weather, see the current traffic, and see the daily news sorted by category in one quick to read UI. It also allows for the user to save news articles to read later if they don't have time, and check the weather in other locations. Saving their recent searches to access quickly next time the user loads the page. This core values of the application are to be quick, efficient, and allow the user to read the news on their own time and anywhere!

## Wireframe

![](./assets/Images/Wireframe0.2.png)

## API's used

    NewsData.io

[NewsData.io](https://newsdata.io/) allows to pull in the current headlines from multiple news soruces worldwide! It tracks and collects headlines and links to the current articles trending on the web. The [NewsData.io](https://newsdata.io/) has the capablities to serach news articles that have been archived within the last 2 years for a fee.

How we used the API was just to pull in the top 10 current headlines worldwide and allow the user to select a specific genre of news articles. Ranging from anywhere from worldwide to food. We built in a saving feature to our website that will keep the given headline, depsctiprtion, and link of the given data of any artcile. The intention behind this to allow the usere to choose when they would like to read the article and have a quick place to access them for the future.

Overall, [NewsData.io](https://newsdata.io/) is a great API with a free package that will work well for any small projects such as this one. You can even take it further and breakdown the ablity to choose news from specific countries. The documention on their website is really in-depth in how the API works. Showing many more features one could use to refine the users search of News! We would recommend this API for anyone in the future!

    developer.tomtom.com

[tomtom.com](https://developer.tomtom.com/) allows pulls of map and traffic data worldwide. It tracks traffic flow rates and incident data in real time so that it can be displayed to a user.

How we used the API was to pull in map tiles at a zoom level that allowed us to see all of denver and displayed them in a grid. Then we grabbed traffic flow data and displayed it over the top of the map to show flow rates on the major roads in the Denver area. The intention behind this was to give the user a good overview of the current traffic conditions of the Denver area to help plan their day.

In all, the [tomtom.com](https://developer.tomtom.com/) API is a very useful tool for not just displaying maps, but traffic data and incident reports as well. While the mapping isn't intuitive as the API uses a zoom grid system that can be difficult to figure out, the API explorer more than makes up for it. Being able to test your URLs and experiment within the [tomtom.com](https://developer.tomtom.com/) website was extremely useful, not just with getting the correct tiles but also for learning how the API functions.
