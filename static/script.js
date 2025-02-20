// Global variables
const x = document.getElementById("YourPos");
let myLat;
let myLong;


function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerText = now.toLocaleString();
}


// Update date and time every second
setInterval(updateDateTime, 1000);


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function sendLocationToServer(lat, lon) {
    fetch('/update_location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lat: lat, lon: lon })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Location updated:', data);
    })
    .catch(error => {
        console.error('Error updating location:', error);
    });
}


function showPosition(position) {
    myLat = position.coords.latitude;
    myLong = position.coords.longitude;
    x.innerHTML = "Your Position is LAT: " + myLat + "  LONG: " + myLong;
    sendLocationToServer(myLat, myLong);
}


function refreshISSPosition() {
    fetch('/refresh_iss_position')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ISSPos').innerText = `ISS Position is LAT: ${data.iss_latitude}   LONG: ${data.iss_longitude}`;
        })
        .catch(error => {
            console.error('Error fetching ISS position:', error);
        });
}


function isClear() {
    if (weather_id == 800 || weather_id == 801) {
        return true;
    } else {
        return false;
    }
}


function isNight() {
    if (currentHour >= sunsetHour || currentHour <= sunriseHour) {
        return true;
    } else {
        return false;
    }
}


function isISSOverhead() {
    if (myLat - 5 <= iss_latitude <= myLat + 5 && myLong - 5 <= iss_longitude <= myLong + 5) {
        return true;
    } else {
        return false;
    }
}


function updateGoLookStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const sunsetTime = new Date();
    sunsetTime.setHours(sunsetHour, sunsetMinute, 0);

    let goLook = "The weather is <i>" + weather_desc + "</i>, and its <b>Daytime!</b> You won't see the ISS yet. Wait for Nighttime.";
    if (currentHour >= sunsetHour || currentHour <= sunriseHour) {
        if (isISSOverhead() && isClear()) {
            goLook = "ISS is overhead and the weather is <i>" + weather_desc + "</i>. Go Look Up!";
        } else if (isISSOverhead() && !isClear()) { 
            goLook = "ISS is overhead but the weather is <i>" + weather_desc + "</i>. Not Tonight!";
        } else if (!isISSOverhead() && isClear()) {
            goLook = "ISS is not overhead but the weather is <i>" + weather_desc + "</i>, at least. Check Back Later!";
        } else if (!isISSOverhead() && !isClear()) { 
            goLook = "ISS is not overhead and the weather is <i>" + weather_desc + "</i>. Not Tonight!";
        } 
    }

    document.getElementById('goLookStatus').innerHTML = goLook;
}


// Get location on page load
getLocation();
// Update Go Look status on page load
updateGoLookStatus();