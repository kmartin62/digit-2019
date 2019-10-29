import React, { Component } from 'react';
import {Bar} from "react-chartjs-2";

const charData = {
    labels: [],
    datasets:[
        {
            label: "Pollution",
            data:[],
            backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)'
                ]
        }
        ]
}

class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        charData.labels = [this.props.pm10, this.props.pm25];
        charData.datasets[0].data = [this.props.pm10measured];
        return(
            <div className="chart">
                <Bar
                    data={charData}
                    options={{ maintainAspectRatio: false }}
                />
            </div>
        )
    }

}

export default Chart;