// Global variables
const x = document.getElementById('YourPos');
let myLat;
let myLong;

// Get location on page load
getLocation();

/**
 * Desc:    This function updates the date and time on the page.
 *          It is called every second.
 * @param   None
 * @return  {}document.getElementById('datetime').innerText
 */
function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerText = now.toLocaleString();
}

// Update date and time every second
setInterval(updateDateTime, 1000);

/**
 * Desc:    This function gets the user's location and sends it to the server.
 * @param   None
 * @return  {function} showPosition(position)
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}

/**
 * Desc:    This function sends the user's location to the server.
 * @param   {Float} lat
 * @param   {Float} lon
 * @return  {} fetch('/update_location')
 */
function sendLocationToServer(lat, lon) {
    fetch('./update_location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat: lat, lon: lon }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Location updated:', data);
        })
        .catch((error) => {
            console.error('Error updating location:', error);
        });
}

/**
 * Desc:    This function displays the user's position on the page.
 * @param   {Object} position
 * @return  {} x.innerHTML
 */
function showPosition(position) {
    myLat = position.coords.latitude;
    myLong = position.coords.longitude;
    x.innerHTML = 'Your Position is LAT: ' + myLat + '  LONG: ' + myLong;
    sendLocationToServer(myLat, myLong);
}

/**
 * Desc:    On Click this function sends a request to the server
 *          to refresh the ISS position.
 * @param   None
 * @return  {} fetch('/refresh_iss_position')
 */
function refreshISSPosition() {
    fetch('./refresh_iss_position')
        .then((response) => response.json())
        .then((data) => {
            document.getElementById(
                'ISSPos'
            ).innerText = `ISS Position is LAT: ${data.iss_latitude}   LONG: ${data.iss_longitude}`;
        })
        .catch((error) => {
            console.error('Error fetching ISS position:', error);
        });
}

/**
 * Desc:    This function checks if the weather is clear.
 * @param   None
 * @returns {boolean} True if the weather is clear, False otherwise.
 */
function isClear() {
    if (weather_id == 800 || weather_id == 801) {
        return true;
    } else {
        return false;
    }
}

/**
 * Desc:   This function checks if it is nighttime.
 * @param  None
 * @returns {boolean} True if it is nighttime, False otherwise.
 */
function isNight() {
    if (currentHour >= sunsetHour || currentHour <= sunriseHour) {
        return true;
    } else {
        return false;
    }
}

/**
 * Desc:    This function checks if the ISS is overhead.
 * @param   None
 * @returns {boolean} True if the ISS is overhead, False otherwise.
 */
function isISSOverhead() {
    console.log('myLat is ' + myLat);
    console.log('myLong is ' + myLong);
    console.log('iss_latitude is ' + iss_latitude);
    console.log('iss_longitude is ' + iss_longitude);
    if (
        myLat - 5 <= iss_latitude &&
        iss_latitude <= myLat + 5 &&
        myLong - 5 <= iss_longitude &&
        iss_longitude <= myLong + 5
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Desc:    This function updates the Go Look status on the page.
 * @param   None
 * @returns {} document.getElementById('goLookStatus').innerHTML
 */
function updateGoLookStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const sunsetTime = new Date();
    sunsetTime.setHours(sunsetHour, sunsetMinute, 0);

    let goLook =
        'The weather is <i>' +
        weather_desc +
        "</i>, and its <b>Daytime!</b> You won't see the ISS yet. Wait for Nighttime.";
    if (currentHour >= sunsetHour || currentHour <= sunriseHour) {
        if (isISSOverhead() && isClear()) {
            goLook =
                'ISS is overhead and the weather is <i>' +
                weather_desc +
                '</i>. Go Look Up!';
        } else if (isISSOverhead() && !isClear()) {
            goLook =
                'ISS is overhead but the weather is <i>' +
                weather_desc +
                '</i>. Not Tonight!';
        } else if (!isISSOverhead() && isClear()) {
            goLook =
                'ISS is not overhead but the weather is <i>' +
                weather_desc +
                '</i>, at least. Check Back Later!';
        } else if (!isISSOverhead() && !isClear()) {
            goLook =
                'ISS is not overhead and the weather is <i>' +
                weather_desc +
                '</i>. Not Tonight!';
        }
    }

    document.getElementById('goLookStatus').innerHTML = goLook;
}

// Update Go Look status on page load
updateGoLookStatus();
