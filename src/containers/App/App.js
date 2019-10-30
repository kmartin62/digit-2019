import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
import { firebaseConfig } from '../../utils/config';
import {Bar} from 'react-chartjs-2';
import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage
import Iframe from 'react-iframe'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton,
    TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed,
    TwitterOnAirButton } from 'react-twitter-embed';
import TestComponent from "../TestComponent/TestComponent";


const data = {
    labels: [],
    datasets: [
        {
            label: '',
            backgroundColor: 'rgb(153, 153, 102)',
            borderColor: 'rgba(255,99,132,1)',
            data: []
        }
    ]
};

const options = [
    { value: 'skopje', label: 'Skopje' },
    { value: 'bitola', label: 'Bitola' },
    { value: 'radovis', label: 'Radovis' },
];

class App extends Component {

    constructor(props) {
        super(props);

        if(!firebase.apps.length) {
            this.app = firebase.initializeApp(firebaseConfig);
        }

        this.state = {
            pm10: null,
            pm25: null,
            aqi: null,
            city_name: null,
            city: this.props.someData,
            value: '',
            selectedOption: null,
        };
    }



    componentDidMount() {

        window.setInterval(() => {
            alert("Test")
        }, 5000);

        this.readUserData("Skopje");
    }

    readUserData(city_name){
        firebase.database().ref("Momentalno/" + city_name + "/").once('value', (snapshot) => {
            if(snapshot.exists()){
                if(snapshot.val().key.localeCompare(this.getKey()) === 0) {
                    console.log(snapshot.val().key.localeCompare(this.getKey()));
                    this.setState({pm10: snapshot.val().pm10});
                    this.setState({pm25: snapshot.val().pm25});
                    this.setState({aqi: snapshot.val().aqi});
                    this.setState({city_name: city_name});
                }
                else {
                    this.getRequest(city_name);
                }
            }

            else {
                this.getRequest(city_name);
            }

        })
    }

    writeUserData(city_name, key, pm10, pm25, aqi){
        let date = this.getKey();
        firebase.database().ref("Momentalno/" + city_name + "/").set({
            city_name,
            pm10,
            pm25,
            aqi,
            key
        }).catch((error) => {
            console.log("error ", error)
        });

        firebase.database().ref("Istorija/").push({
            city_name,
            pm10,
            pm25,
            aqi,
            key
        }).catch((error) => {
            console.log("error ", error)
        });
    }

     getKey(){
        let d = new Date();
        return d.toLocaleDateString().toString().split("/").join("-") + "T" + (d.getHours()).toString() + ":00";
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        this.readUserData(selectedOption.label);
        console.log(selectedOption.label);
    };


    getRequest(city){
        let path = "https://api.weatherbit.io/v2.0/current/airquality?city=" + city + "&country=MK&key=498f03aff502413dadf98ed9124ca628";
        fetch(path)
            .then(res => res.json())
            .then((data) => {
                this.writeUserData(city, this.getKey().toString(), data.data[0].pm10, data.data[0].pm25, data.data[0].aqi);
                this.setState({ pm10: data.data[0].pm10 });
                this.setState({ pm25: data.data[0].pm25 });
                this.setState({ aqi: data.data[0].aqi });
                this.setState({ city_name: data.city_name})
            });

    }


    render() {
        const { selectedOption } = this.state;
        data.labels = ["PM10", "PM25", "AQI"];
        data.datasets[0].data=[this.state.pm10, this.state.pm25, this.state.aqi];
        return (

            <div>
                {/*<TestComponent/>*/}
            <Select
                    placeholder={"Skopje"}
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
                <div style={{width: 555}}>
                    <Bar data={data} />
                </div>

                {/*<TwitterHashtagButton*/}
                    {/*tag={'cybersecurity'}*/}
                {/*/>*/}
                {/*<TwitterMentionButton*/}
                    {/*screenName={'saurabhnemade'}*/}
                {/*/>*/}

                <Iframe url="https://www.sociablekit.com/app/embed/index.php?embed_id=30223"
                        frameborder='0' width='500' height='500'
                        className="myClassname"
                        display="initial"
                        position="relative"/>

                <TwitterTweetEmbed
                tweetId={'933354946111705097'}
                />

                {/*<a href="https://twitter.com/intent/tweet?button_hashtag=LoveTwitter&ref_src=twsrc%5Etfw"*/}
                   {/*className="twitter-hashtag-button" data-lang="en" data-show-count="false">Tweet #LoveTwitter</a>*/}
                {/*<script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>*/}


            </div>
        );
    }
}
export default App;