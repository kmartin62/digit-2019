import React, { Component } from 'react';
import {Bar} from "react-chartjs-2";

class Chart extends Component{
   constructor(props){
       super(props);
       this.state = {
           charData:{
               labels: ['Skopje', 'Radovis'],
               datasets:[
                   {
                       label: "Pollution",
                       data:[
                           1,
                           2
                       ],
                       backgroundColor:[
                           'rgba(255, 99, 132, 0.6)',
                           'rgba(54, 162, 235, 0.6)'
                       ]
                   }
               ]
           }
       }
   }

   render(){
       return(
           <div className="chart">
           <Bar
               data={this.state.charData}
               options={{ maintainAspectRatio: false }}
           />
           </div>
       )
   }

}

export default Chart;