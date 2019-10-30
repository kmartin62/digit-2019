import ApexCharts from 'apexcharts';
import React, { Component } from "react";
import ReactApexCharts from 'react-apexcharts'

let lastDate = 0;
let data = [];
let TICKINTERVAL = 86400000;
let XAXISRANGE = 777600000;

function getDayWiseTimeSeries(baseval, count, yrange) {
    let i = 0;
    while (i < count) {
        let x = baseval;
        let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        data.push({
            x, y
        });
        lastDate = baseval;
        baseval += TICKINTERVAL;
        i++;
    }
}

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
    min: 10,
    max: 90
});

function getNewSeries(baseval, yrange) {
    let newDate = baseval + TICKINTERVAL;
    lastDate = newDate;

    for(let i = 0; i< data.length - 10; i++) {
        // IMPORTANT
        // we reset the x and y of the data which is out of drawing area
        // to prevent memory leaks
        data[i].x = 0;
        data[i].y = 0
    }

    data.push({
        x: newDate,
        y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    })

}

function resetData(){
    // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series
    data = data.slice(data.length - 10, data.length);
}

class TestComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: 'realtime',
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 1000
                        }
                    },
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                  enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 8
                },

                title: {
                    // text: 'Dynamic Updating Chart',
                    align: 'left'
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: false
                    },
                    range: 0,
                },
                yaxis: {
                    max: 100
                },
                legend: {
                    show: false
                }
            },
            series: [{
                data: data.slice()
            }],
        }
    }

    componentDidMount() {
        this.intervals()
    }

    intervals () {
        window.setInterval(() => {
            getNewSeries(lastDate, {
                min: 10,
                max: 90
            });

            ApexCharts.exec('realtime', 'updateSeries', [{
                data: data
            }])
        }, 1000)
    }

    render() {

        return (



            <div id="chart">
                <ReactApexCharts options={this.state.options} series={this.state.series} type="line" height="350" />
            </div>


        );
    }

}

export default TestComponent;