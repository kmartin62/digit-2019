import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
import { firebaseConfig } from '../../utils/config';
import firebase from 'firebase';

const options = [
    { value: 'skopje', label: 'Skopje' },
    { value: 'bitola', label: 'Bitola' },
    { value: 'radovis', label: 'Radovis' },
];

class App extends Component {

    constructor(props) {
        super(props);

        this.app = firebase.initializeApp(firebaseConfig);
        this.database = this.app.database().ref().child("speed");

        this.state = {
            pm10: null,
            pm25: null,
            aqi: null,
            city_name: null,
            value: '',
            selectedOption: null,
            speed: 10
        };
    }

    readUserData(city_name){
        firebase.database().ref(city_name + "/").child(this.getKey().toString()).once('value', (snapshot) => {
            if(snapshot.exists()){
                console.log("Exists");
                this.setState({ pm10: snapshot.val().pm10 });
                this.setState({ pm25: snapshot.val().pm25 });
                this.setState({ aqi: snapshot.val().aqi });
                this.setState({city_name: city_name});
            }
            else {
                this.getRequest(city_name);
                console.log("Created");
            }

            // this.setState({ pm10: snapshot.val().pm10 });
            // this.setState({ pm25: snapshot.val().pm25 });
            // this.setState({ aqi: snapshot.val().aqi });
            // this.setState({city_name: city_name});
        })
    }

    writeUserData(city_name, key, pm10, pm25, aqi){
        firebase.database().ref(city_name + "/").child(key).set({
            pm10,
            pm25,
            aqi
        }).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.log("error ", error)
        })
    }

    getKey(){
        let d = new Date();
        let path = d.toLocaleDateString().toString().split("/").join("-") + "T" + (d.getHours()).toString() + ":00";
        return path;
    }

    componentDidMount(){
        console.log(this.getKey());

        this.getRequest("Skopje");

        this.database.on('value', snap => {
            this.setState({
                speed: snap.val()
            });
        });

        // this.writeUserData("Skopje", "TTTTT", "test@g.com", "asd", "fgh");

        // this.database.on('child_added', snap => {
        //     previous.push({
        //         speed: 5
        //     })
        // })
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        this.readUserData(selectedOption.label);
        console.log(`Option selected:`, selectedOption.label);
    };

    getRequest(city){
        let path = "https://api.weatherbit.io/v2.0/current/airquality?city=" + city + "&country=MK&key=498f03aff502413dadf98ed9124ca628";
        fetch(path)
            .then(res => res.json())
            .then((data) => {
                console.log("IMINIMIN");
                this.writeUserData(city, this.getKey().toString(), data.data[0].pm10, data.data[0].pm25, data.data[0].aqi);
                this.setState({ pm10: data.data[0].pm10 });
                this.setState({ pm25: data.data[0].pm25 });
                this.setState({ aqi: data.data[0].aqi });
                this.setState({ city_name: data.city_name})
            });

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
            </div>
        );
    }
}
export default App;