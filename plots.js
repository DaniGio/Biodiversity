function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        optionChanged(data.names[0])
    })
}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text("ID: " + (result.id));
        PANEL.append("h6").text("ETHNICITY: " + (result.ethnicity));
        PANEL.append("h6").text("GENDER: " + (result.gender));
        PANEL.append("h6").text("AGE: " + (result.age));
        PANEL.append("h6").text("LOCATION: " + (result.location));
        PANEL.append("h6").text("BBTYPE: " + (result.bbtype));
        PANEL.append("h6").text("WFREQ: " + (result.wfreq));
    });
}

//   challenge: 1) Create a bar chart of the top ten bacterial species in a volunteer’s navel. Use JavaScript to select only the most populous species.
//to retrieve data from an external data file
function buildCharts(sample) {
    d3.json("samples.json").then(function ({samples,metadata}) {
        var data = samples.filter(obj=>obj.id==sample)[0]
       
        // Trace1 for the Bacterial species
        var trace1 = {
            x: data.sample_values.slice(0, 10).reverse(),
            y: data.otu_ids.map(row => `otu_id: ${row}`).slice(0, 10).reverse(),
            text: data.otu_labels.slice(0, 10).reverse(),
            name: "Bacterial Species",
            type: "bar",
            orientation: "h"
        };

        // Use sample_values as the values for the bar chart.
        //Use otu_ids as the labels for the bar chart.
        //Use otu_labels as the hover text for the chart.


        // data
        var bardata = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
            title: "Bacterial Species",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", bardata, layout);


        // //   Challenge 2: 
        // //Create a bubble chart that displays each sample:
        // // Use otu_ids for the x-axis values.
        // // Use sample_values for the y-axis values.
        // // Use sample_values for the marker size.
        // // Use otu_ids for the marker colors. 
        // // Use otu_labels for the text values.

        var trace1 = {
            x: data.otu_ids,
            y: data.sample_values,
            mode: 'markers',
            text: data.otu_labels,
            marker: {
                color: data.otu_ids, 
                opacity: [1, 0.8, 0.6, 0.4],
                size: data.sample_values
            }
        };

        var bubbledata = [trace1];

        var layout = {
            title: 'Frequency of all the bacterial species found in a volunteer’s navel',
            showlegend: false,
            height: 800,
            width: 1200
        };

        Plotly.newPlot('bubble', bubbledata, layout);

        //challenge 3:
        //Adapt the gauge chart from Plotly documentation (Links to an external site.) to plot the weekly washing frequency of the individual. 
        //You will need to modify the example gauge code to account for values ranging from 0 through 9. 
        //Update the chart whenever a new sample is selected. 

        var wfreq = metadata.filter(obj=>obj.id==sample)[0].wfreq
        

        var gaugedata = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                
                gauge: {
                    axis: { range: [0, 9] },
                    bar: { color: "#4D5160" },
   
                    steps: [
                        { range: [0, 1], color: "#D5DBF0", title:"0-1" },
                        { range: [1, 2], color: "#B7C2E5" },
                        { range: [2, 3], color: "#889AD7" },
                        { range: [3, 4], color: "#6880CE" },
                        { range: [4, 5], color: "#4865C5" },
                        { range: [5, 6], color: "#395BCA" },
                        { range: [6, 7], color: "#2B4DBF" },
                        { range: [7, 8], color: "#2143B4" },
                        { range: [8, 9], color: "#1639AB" },
                        // text: ['0-1', '1-2', '2-3', '3-4', '4-5','5-6', '6-7','7-8', '8-9',''],
                        // textinfo: 'text',
                        // textposition:'inside'
                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: wfreq
                    }
                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', gaugedata, layout);

    });
}