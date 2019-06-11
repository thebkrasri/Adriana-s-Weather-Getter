import React from 'react';
import logo from './logo.svg';
import './App.css';

// global constants and variables for API calls
const CURRENT = "http://api.openweathermap.org/data/2.5/weather?zip=";
const FORECAST = "http://api.openweathermap.org/data/2.5/forecast?zip=";
var ZIP = "";
const APP_KEY = ",us&units=imperial&APPID=b1a91564b386fa77030f8b451857b669";

//GetWeather creates the input and decided if CurrentWeather and FOrecast should be rendered
class GetWeather extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  //listens to input and sets value of ZIP when input length reaches 5 characters
  handleChange(event) {
    this.setState({ value: event.target.value });
    if (event.target.value.length >= 5) {
      ZIP = event.target.value;
      this.setState({ value: "" });
    }
    else {
      ZIP = " ";
      this.setState({ value: event.target.value });
    }
  }
//renders input and label, renders CurrentWeather and Forecast if a 5 number string is entered
  render() {
    if (ZIP.length < 5) {
      return (<div>
        <label className="App-label">Enter Zip Code</label>
        <input autoFocus autocomplete="off" type="text" value={this.state.value} onChange={this.handleChange} className="App-input" id="zip"></input>
        </div>);
    } else if (/^\d+$/.test(ZIP)) {
      return (
        <div>
          <div>
            <label className="App-label">Enter Zip Code</label>
            <input autocomplete="off" type="text" value={this.state.value} onChange={this.handleChange} className="App-input" id="zip"></input>
          </div>
          <div>
            <CurrentWeather />
            <Forecast />
          </div>
        </div>

      );
    }
    //renders message in input is not a string of numbers
    else {
      return (<div>
        <label className="App-label">Enter Zip Code</label>
        <input autoFocus type="text" value={this.state.value} onChange={this.handleChange} className="App-input" id="zip"></input>
        <div>Please enter a ZIP code!</div>
        </div>);
    }
  }
}

//creates the CurrentWeather componenet
class CurrentWeather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      weather: [],
      temp: "",
      temp_min: "",
      temp_max: "",
      name: ""
    };
  }
  //attempts tp get current weather data for given ZIP code
  componentDidMount() {
    fetch(CURRENT + ZIP + APP_KEY)
    .then(function(result) {
      if (!result.ok) {
      throw new Error("Current weather for that Zip code not found!")}  //throws error is fetch result is not OK
      else {
        return result.json();  //reads json response if result OK
      };
    })
      .then(
        (result) => {  // if result was ok, uses json response to set values of state
          this.setState({  
            isLoaded: true,
            weather: result.weather,
            temp: Math.round(result.main.temp),
            temp_min: Math.round(result.main.temp_min),
            temp_max: Math.round(result.main.temp_max),
            name: result.name
          });
        },
        (error) => {  //sets state error if there is an error
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, weather, temp, temp_min, temp_max, name } = this.state;
    if (error) {  //renders error message
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {  //renders loading message
      return <div>Loading...</div>;
    } else {  //renders component if fetch was successful
      return (
        <div>
          <h1 key={name}>
            {name}
          </h1>
          <h2 key={temp}>
            {temp}
          </h2>
          {weather.map(w => (
            <h3 key={w.main}>
              {w.main}
            </h3>)
          )}
          <ul className="horizontal">
            <li key={temp_min}>
              Low: {temp_min}
            </li>
            <li key={temp_max}>
              High: {temp_max}
            </li>
          </ul>
        </div>
      );
    }
  }
}

//creates the Forcast componenet
class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      list: {}, 
    };
  }

    //attempts tp get forecast data for given ZIP code
  componentDidMount() {
    fetch(FORECAST + ZIP + APP_KEY)
    .then(function(result) {
      if (!result.ok) {
      throw new Error("Forecast for that Zip code not found!"); //throws error is fetch result is not OK
    }
      else {
        return result.json(); //reads json response if result OK
      };
    })
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            list: result.list.slice(0, 5) //gets the first 5 items in the result list
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, list } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul className="horizontal">
          {list.map(item => (  //creates a new list item for each item in the result list
            <li key={item}>
              <div className="inline">
                <div key={new Date(item.dt_txt)}>
                  {new Date(item.dt_txt).getHours()}:00 {new Date(item.dt_txt).toDateString()}</div>
                <div>
                  {Math.round(item.main.temp)}  {item.weather[0].main}
                </div>
              </div>
            </li>)
          )}
        </ul>
      );
    }
  }
}

//renders the page
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          ADRIANA'S WEATHER GETTER
        </p>
      </header>
      <GetWeather />
    </div>
  );
}

export default App;
