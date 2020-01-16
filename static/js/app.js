function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadaraURL = "/metadata" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
      d3.json(metadataURL).then(function(sample){
        var sampleData = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
        sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
        Object.defineProperties(sample).forEach(function([key,value]){
          var row = sampleData.append("p");
          row.text('${key}:${value}')
        })
        });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples" + sample;
    // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then((data)=>{
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;
      var bubble_data = {
        x: otu_ids,
        y: sample_values,
        hovertext: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      };

      var bubble_layout = {
        title: "Sample Data",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Value"},
        margin: {t:30, l:250},
        height: 650,
        width: 1200
      };

      Plotly.newPlot("bubble", [bubble_data], bubble_layout);     
      
    // @TODO: Build a Pie Chart
    var pie_data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    const pie_layout = {
      margin: {t:30, l:0},
      title: "Top 10 Samples",

    };

    Plotly.plot("pie", pie_data,pie_layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
