// import firebase from "../containers/App/App";
import firebase from 'firebase/app';
export const testfunction = () => {
    let cars = ["Saab", "Volvo", "BMW"];

    return cars;
};

export const readUserData = (city_name) =>{

    let array = null;
    let pm10, pm25, aqi;

    firebase.database().ref(city_name + "/").child(getKey().toString()).once('value', (snapshot) => {
        if(snapshot.exists()){
            array = [snapshot.val().pm10.toString(), snapshot.val().pm25.toString(), snapshot.val().aqi.toString()];
            // this.setState({ pm10: snapshot.val().pm10 });
            // this.setState({ pm25: snapshot.val().pm25 });
            // this.setState({ aqi: snapshot.val().aqi });
            // this.setState({city_name: city_name});
            // console.log(array[0], array[1], array[2]);
            console.log(pm10, pm25, aqi);

        }
        else {
            console.log("ININ");
            getRequest(city_name);
        }

    });

    return array;
};

const getKey = () => {
        let d = new Date();
        return d.toLocaleDateString().toString().split("/").join("-") + "T" + (d.getHours()).toString() + ":00";
}

const getRequest = (city) => {

    let pm10, pm25, aqi;

    let path = "https://api.weatherbit.io/v2.0/current/airquality?city=" + city + "&country=MK&key=498f03aff502413dadf98ed9124ca628";
    fetch(path)
        .then(res => res.json())
        .then((data) => {
            writeUserData(city, getKey().toString(), data.data[0].pm10, data.data[0].pm25, data.data[0].aqi);

            // this.setState({ pm10: data.data[0].pm10 });
            // this.setState({ pm25: data.data[0].pm25 });
            // this.setState({ aqi: data.data[0].aqi });
            // this.setState({ city_name: data.city_name})
            console.log("Inside get request");
            readUserData(city);
        });

};

const writeUserData = (city_name, key, pm10, pm25, aqi) => {
    firebase.database().ref(city_name + "/").child(key).set({
        pm10,
        pm25,
        aqi
    }).catch((error) => {
        console.log("error ", error)
    })
}