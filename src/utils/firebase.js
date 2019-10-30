import firebase from "../containers/App/App";

export const readUserdata = (city_name) => {
    firebase.database().ref(city_name + "/").child(this.getKey().toString()).once('value', (snapshot) => {
                if(snapshot.exists()){
                    console.log("READING, FETCHING");
                    this.setState({ pm10: snapshot.val().pm10 });
                    this.setState({ pm25: snapshot.val().pm25 });
                    this.setState({ aqi: snapshot.val().aqi });
                    this.setState({city_name: city_name});

                }
                else {
                    console.log("ININ");
                    this.getRequest(city_name);
                }

            })
};


