"""
ISSFinder
=========

Description:
-------------
A Flask-based web application that shows the current location of the International Space Station (ISS)
relative to the user's location. It also fetches the user's current weather and provides a fun message 
about whether it's worth getting out of bed to see the ISS, based on visibility and weather conditions.

The server-side logic, including the retrieval of data from external APIs and determining if it is daytime 
or nighttime based on the user's geolocation, is handled using Python with Flask.

Features:
---------
- Retrieves and displays the user's current latitude and longitude.
- Fetches the current location of the ISS (latitude and longitude).
- Gets the current weather for the user's location via the Weather API.
- Uses the Sunrise-Sunset API to determine if it is daytime or nighttime at the user's location.
- Provides a recommendation to the user about whether it is a good time to look for the ISS.

APIs Used:
-----------
- ISS Location API (https://wheretheiss.at/w/developer)
- Weather API (e.g., OpenWeatherMap - https://openweathermap.org/api)
- Sunrise-Sunset API (https://sunrise-sunset.org/api)

"""

import requests
from datetime import datetime
import os
import time
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, template_folder='templates', static_folder='static')
application=app

# Open Weather
OW_API_KEY = os.environ.get("OW_API_KEY")
UNITS = "metric"
OW_API_URL = "http://api.openweathermap.org/data/2.5/weather"

# Initial Location
MY_LAT = -27.407260
MY_LONG = 152.919906


def get_iss_pos():
    """
    Desc:   Fetches the current location of the International Space 
            Station (ISS) using the ISS API.
    Params: None
    Return: Dictionary containing the latitude and longitude of the ISS.
    """
    iss_pos = {}
    response = requests.get(url="http://api.open-notify.org/iss-now.json")
    response.raise_for_status()
    data = response.json()
    iss_lat = float(data["iss_position"]["latitude"])
    iss_lon = float(data["iss_position"]["longitude"])
    iss_pos = {"lat": iss_lat, "lon": iss_lon}
    return iss_pos


def get_sun_pos():
    """
    Desc:   Fetches the sunrise and sunset times for the user's location
            using the Sunrise-Sunset API.
    Params: None
    Return: Dictionary containing the sunrise and sunset times.
    """
    sun_pos = {}
    parameters = {
        "lat": MY_LAT,
        "lng": MY_LONG,
        "formatted": 0,
    }
    response = requests.get("https://api.sunrise-sunset.org/json", params=parameters)
    response.raise_for_status()
    data = response.json()
    sr_hour = int(data["results"]["sunrise"].split("T")[1].split(":")[0])
    ss_hour = int(data["results"]["sunset"].split("T")[1].split(":")[0])
    ss_minute = int(data["results"]["sunset"].split("T")[1].split(":")[1])
    if sr_hour >= 14:
        sr_hour -= 14
    else:
        sr_hour += 10
    if ss_hour >= 14:
        ss_hour -= 14
    else:
        ss_hour += 10
    sun_pos = {
        "sr_hour": sr_hour,
        "ss_hour": ss_hour,
        "ss_min": ss_minute
    }
    return sun_pos


def get_weather():
    """
    Desc:   Fetches the current weather for the user's location using the
            OpenWeather API.
    Params: None
    Return: Dictionary containing the weather ID and description.
    """
    weather_details = {}
    weather_parameters = {
        "lat": MY_LAT,
        "lon": MY_LONG,
        "units": UNITS,
        "APPID": OW_API_KEY
    }
    response = requests.get(url=OW_API_URL, params=weather_parameters)
    response.raise_for_status()
    weather_data = response.json()
    weather_details = {
        "id": weather_data["weather"][0]["id"],
        "desc": weather_data["weather"][0]["description"]
    }
    return weather_details


@app.route('/')
def index():
    """
    Desc:   Renders the main page of the web application with the current
            weather, ISS location, and sunrise/sunset times.
    Params: None
    Return: Rendered HTML template with the relevant data.
    """
    weather = get_weather()
    weather_id = weather["id"]
    weather_desc = weather["desc"]
    iss_position = get_iss_pos()
    iss_latitude = iss_position["lat"]
    iss_longitude = iss_position["lon"]
    sun_position = get_sun_pos()
    sunrise_hour = sun_position["sr_hour"]
    sunset_hour = sun_position["ss_hour"]
    sunset_minute = sun_position["ss_min"]
    return render_template("index.html", 
        currWeatherDesc=weather_desc,
        weather_id=weather_id, 
        iss_latitude=iss_latitude, 
        iss_longitude=iss_longitude, 
        MY_LAT=MY_LAT, 
        MY_LONG=MY_LONG,
        sunrise_hour=sunrise_hour,
        sunset_hour=sunset_hour, 
        sunset_minute=sunset_minute)


@app.route('/refresh_iss_position')
def refresh_iss_position():
    """
    Desc:   Fetches the current location of the International Space Station
            (ISS) and returns the latitude and longitude.
    Params: None
    Return: Dictionary containing the latitude and longitude of the ISS.
    """
    iss_position = get_iss_pos()
    return {
        "iss_latitude": iss_position["lat"],
        "iss_longitude": iss_position["lon"]
    }


@app.route('/update_location', methods=['POST'])
def update_location():
    """
    Desc:   Updates the user's location based on the latitude and longitude
            provided in the POST request.
    Params: None
    Return: Dictionary with a success message.
    """
    data = request.get_json()
    global MY_LAT, MY_LONG
    MY_LAT = data['lat']
    MY_LONG = data['lon']
    return {"status": "success"}


if __name__ == '__main__':
    app.run(debug=True)