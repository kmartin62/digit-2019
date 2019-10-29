import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';

const options = [
    { value: 'skopje', label: 'Skopje' },
    { value: 'bitola', label: 'Bitola' },
    { value: 'radovis', label: 'Radovis' },
];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pm10: null,
            pm25: null,
            aqi: null,
            city_name: null,
            value: '',
            selectedOption: null,
        };
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        this.getRequest(selectedOption.label);
        console.log(`Option selected:`, selectedOption.label);
    };

    getRequest(city){
        var path = "https://api.weatherbit.io/v2.0/current/airquality?city=" + city + "&country=MK&key=099595fa7e88462ea8e4a26befd8d035";
        fetch(path)
            .then(res => res.json())
            .then((data) => {
                this.setState({ pm10: data.data[0].pm10 })
                this.setState({ pm25: data.data[0].pm25 })
                this.setState({ aqi: data.data[0].aqi })
                this.setState({ city_name: data.city_name})
            })
    }


    componentDidMount() {
        this.getRequest("Skopje")
    }

    render() {
        const { selectedOption } = this.state;

        return (

            <div>
            <Select
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={options}
                />

                <table className="table" width={"50%"}>
                    <thead className="thead-dark">
                    <tr>
                        <th width={"100px"}>City name</th>
                        <td>{this.state.city_name}</td>
                    </tr>
                    <tr>
                        <th>PM10</th>
                        <td>{this.state.pm10}</td>
                    </tr>
                    <tr>
                        <th>PM25</th>
                        <td>{this.state.pm25}</td>
                    </tr>
                    <tr>
                        <th>AQI</th>
                        <td>{this.state.aqi}</td>
                    </tr>
                    </thead>
                </table>
                <div>
                    <img src={require('./logo.jpeg')} />
                </div>
            </div>
        );
    }
}
export default App;