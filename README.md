# **ISS Finder**

A web-based application that shows the current location of the International Space Station (ISS) relative to the user's location, providing both the latitude and longitude of the ISS and the user's browser location. The app also fetches the current weather for the user's location and provides a fun statement about whether it's worth getting out of bed to spot the ISS based on visibility and weather conditions.

---

## **Features**

- Displays the **current latitude and longitude of the ISS** using the [ISS Location API](https://wheretheiss.at/w/developer).
- Retrieves and shows the **user's latitude and longitude** using the browser's built-in geolocation API.
- Uses the **Weather API** to show the **current weather** for the user's location.
- Uses the **Sunrise-Sunset API** to determine if it is **daytime or nighttime** at the user's location.
- Provides a fun statement to the user about whether it is **nighttime**, if the ISS is **currently overhead**, and if the weather is **clear enough** to go outside and spot the ISS.

---

## **How It Works**

1. **Server-Side (Python/Flask)**:
   - The app uses Python with Flask to handle the server-side logic.
   - The backend makes the necessary API calls to get the ISS position, weather data, and sunrise/sunset times.
   - The server calculates whether it’s daytime or nighttime based on the user's location and current time.

2. **User Location**: The app uses the browser’s geolocation API to get the user’s current latitude and longitude.

3. **ISS Location**: The Flask server fetches the current location of the ISS from an API.

4. **Weather Data**: The Flask server calls another API to get the current weather based on the user's location.

5. **Daytime/Nighttime Check**: The app uses the **Sunrise-Sunset API** to calculate if it is currently daytime or nighttime at the user's location.

6. **Client-Side (HMTL/CSS/JavaScript)**:
   - The frontend (HTML/JavaScript) receives data from the Flask server and displays it.
   - The JavaScript logic updates the webpage with the ISS location, user location, weather, and the recommendation.

---

## **Tech Stack**

- **Backend**:
  - **Python**: For the server-side logic.
  - **Flask**: For handling server routes and API calls.
  - **APIs**:
    - [ISS Location API](https://wheretheiss.at/w/developer): To get the current position of the ISS.
    - [Weather API (e.g., OpenWeatherMap)](https://openweathermap.org/api): To fetch weather data for the user’s location.
    - [Sunrise-Sunset API](https://sunrise-sunset.org/api): To determine whether it is daytime or nighttime at the user's location.

- **Frontend**:
  - **HTML**: For the basic structure of the webpage.
  - **CSS**: For styling the web page.
  - **JavaScript**: For interacting with the DOM and displaying data received from the Flask backend.

---

## **Setup Instructions**

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/djr812/ISSFinder.git
cd ISSFinder
```

### 2. Set up a Python Virtual Environment

Ensure you're using a virtual environment to manage dependencies.

```bash
python3 -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate     # For Windows
```

### 3. Install Dependencies

Install the required Python packages by running the following:

```bash
pip install -r requirements.txt
```

Make sure `Flask` and other necessary libraries are installed.

### 4. API Keys

For the Weather API, you'll need to sign up for an API key. Here's how to do it:

- Go to [OpenWeatherMap](https://openweathermap.org/api) and create an account.
- Once signed in, generate an API key.
- Replace the placeholder API key in the `app.py` file (Flask backend) with your generated key:
  ```python
  OW_API_KEY = "your-api-key"
  ```

### 5. Run the Flask App

Run the Flask development server:

```bash
python app.py
```

By default, the app will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

### 6. Open the Webpage

Once the Flask server is running, open your browser and go to [http://127.0.0.1:5000](http://127.0.0.1:5000) to view the app.

### 7. (Optional) Local Development Server

For more advanced users, you may choose to run a local server for testing. Use tools like **VSCode Live Server**, **http-server**, or any other server tool to serve the frontend files locally, but the backend will still be powered by Flask.

---

## **Usage**

1. Open the webpage in your browser.
2. The app will automatically use your browser’s geolocation to determine your current location.
3. The Flask server will fetch the ISS position, weather, and sunrise/sunset data for your location.
4. The app will check if it’s daytime or nighttime using the **Sunrise-Sunset API**.
5. A message will be displayed telling you whether it’s a good time to look for the ISS based on the time of day and weather.

---

## **Contributing**

Contributions are welcome! Feel free to submit a pull request with improvements, bug fixes, or new features. Please follow the steps below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Acknowledgements**

- Thanks to the [ISS Location API](https://wheretheiss.at/w/developer) for providing real-time ISS location data.
- Thanks to [OpenWeatherMap](https://openweathermap.org/api) for the weather data API.
- Thanks to [Sunrise-Sunset API](https://sunrise-sunset.org/api) for providing sunset and sunrise times, helping to determine if it's nighttime.
- Thanks to [Flask](https://flask.palletsprojects.com/) for powering the server-side of the app.

---
