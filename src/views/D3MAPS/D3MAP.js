import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
import { Slider } from "antd";

import "./d3map.css";

let d3 = window.d3;
var width;
var height;
let setAdressFunc;
var widthLeg;
var heightLeg;

// var slider = d3.select('#year');

// 'svg' to draw in, 'g' element to group everything together
var svg;
var g;
var lowColor;
var highColor;

var projection;
var path;

var dataArray;
var boundry_data;
var prices_data;
var zoom = d3.zoom().on("zoom", handle_zoom);
function D3MAP({ address, setAdress }) {
  const ref = useRef();
  useEffect(() => {
    ref.current && init(ref.current, setAdress);
  }, [setAdress]);
  const handlechange = (value) => {
    console.log(value);
    setinputValue(value);
    reset();
    console.log(boundry_data, prices_data);
    draw(value, boundry_data, prices_data);
  };
  const [inputValue, setinputValue] = useState(1995);
  return (
    <div className="d3chart">
      <h1>Average house prices in London boroughs</h1>
      <div id="slider">
        <Slider
          min={1995}
          max={2017}
          step={1}
          id="year"
          onChange={(value) => handlechange(value)}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </div>

      <div id="vis" ref={ref}></div>
      <div id="leg"></div>

      <div id="info">
        <h1 id="con_name">d3</h1>
        <p>
          In <span id="borough_year"></span> an average house price in{" "}
          <span id="borough_name"></span> was &pound
          <span id="borough_price">.</span>
        </p>
      </div>
    </div>
  );
}

function handle_zoom() {
  g.attr("transform", d3.event.transform);
}

var active = d3.select(null);

function reset() {
  active.style("opacity", 1.0);
  active.style("stroke", "#000");
  active = d3.select(null);

  d3.select("#info")
    .classed("active", false)
    .style("top", height + "px")
    .style("left", width + "px");

  svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
}

function draw(year, boundries, prices) {
  var minVal = d3.min(dataArray);
  var maxVal = d3.max(dataArray);
  var ramp = d3
    .scaleLinear()
    .domain([minVal, maxVal])
    .range([lowColor, highColor]);
  let year_data;
  year_data = prices.filter(function (d) {
    return +d.date === +year;
  });
  // console.log(year_data);
  for (var i = 0; i < year_data.length; i++) {
    var dataBorough = year_data[i].name;
    var priceBorough = +year_data[i].Average_Price;
    var borough_data = window.topojson.feature(
      boundries,
      boundries.objects["london_boroughs"]
    ).features;
    for (var j = 0; j < borough_data.length; j++) {
      var borough = borough_data[j].properties.name;

      if (dataBorough === borough) {
        // console.log(borough_data[j].properties)
        borough_data[j].properties.value = priceBorough;
        // console.log(borough_data[j].properties.value)

        break;
      }
    }
  }

  function clicked(d) {

    if (active.node() === this) {
      reset();
    } else {
      active.style("opacity", 1.0);
      active.style("stroke", "#000");
      active = d3.select(this);
      // active.style("opacity", 0.3);
      // active.style("stroke", "#c0c0c0");
      var b = path.bounds(d);
      var dx = b[1][0] - b[0][0];
      var dy = b[1][1] - b[0][1];
      var x = (b[0][0] + b[1][0]) / 2;
      var y = (b[0][1] + b[1][1]) / 2;
      var s = 0.95 / Math.max(dx / width, dy / height);
      var t = [width / 2 - s * x, height / 2 - s * y];
      var tform = d3.zoomIdentity.translate(t[0], t[1]).scale(s);

      svg.transition().duration(750).call(zoom.transform, tform);

      d3.select("#info")
        .classed("active", true)
        .style("top", "70px")
        .style("left", "30px");
    }

    var borough_year = "";
    var borough_name = "";
    var borough_price = "";

    for (var i = 0; i < year_data.length; i++) {
      if (year_data[i].name === d.properties.name) {
        //  console.log(year_data.properties.name)
        borough_year = year_data[i].date;
        borough_name = year_data[i].name;
        borough_price = year_data[i].Average_Price;
      }
    }
    

    console.log('borough_name-->',borough_name)
    setAdressFunc(borough_name)
    
    d3.select("#borough_year").text(borough_year);
    d3.select("#borough_name").text(borough_name);
    d3.select("#borough_price").text(borough_price);





  }

  projection.scale(1).translate([0, 0]);

  var b = path.bounds(
    window.topojson.feature(boundries, boundries.objects["london_boroughs"])
  );
  var s =
    0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
  var t = [
    (width - s * (b[1][0] + b[0][0])) / 2,
    (height - s * (b[1][1] + b[0][1])) / 2,
  ];

  projection.scale(s).translate(t);

  var areas = g
    .selectAll(".area")
    .data(
      window.topojson.feature(boundries, boundries.objects["london_boroughs"])
        .features
    );

  areas
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("fill", function (d) {
      return ramp(+d.properties.value);
    })
    .attr("id", function (d) {
      return d.properties.name;
    })
    .attr("d", path)
    .on("click", clicked);

  areas.exit().remove();

  var new_areas = areas;

  new_areas
    .merge(areas)
    .transition()
    .duration(1000)
    .attr("fill", function (d) {
      return ramp(+d.properties.value);
    });

  // legend
  d3.selectAll(".legend").remove();

  var w = 500,
    h = 80;

  var key = d3
    .select("#leg")
    .text("UUU")
    .append("svg")
    .attr("width", widthLeg)
    .attr("height", heightLeg)
    .attr("class", "legend");

  var legend = key
    .append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

  legend
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", lowColor)
    .attr("stop-opacity", 1);

  legend
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", highColor)
    .attr("stop-opacity", 1);

  key
    .append("rect")
    .attr("width", widthLeg)
    .attr("height", h - 60)
    .style("fill", "url(#gradient)");

  var x = d3.scaleLinear().range([widthLeg, 0]).domain([maxVal, minVal]);

  var xAxis = d3.axisBottom(x);

  key
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + (h - 60) + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-65)";
    });

  // slider.on('change', function() {
  //   // console.log(this.value);
  //     reset();
  //     draw(this.value, boundries, prices);
  // });
}
// initialise our visualisation
function init(div, setAdress) {
  setAdressFunc = setAdress;
  width = document.getElementById("vis").clientWidth;
  height = document.getElementById("vis").clientHeight;

  widthLeg = document.getElementById("leg").clientWidth;
  heightLeg = document.getElementById("leg").clientHeight;

  svg = d3
    .select(div)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  g = svg.append("g");

  svg.call(zoom);

  projection = d3.geoAlbers().rotate([0, 0]);

  path = d3.geoPath().projection(projection);

  lowColor = "#eeeeee";
  highColor = "#3f3697";

  dataArray = [];

  d3.queue()
    .defer(d3.json, "london_boroughs.json")
    .defer(d3.csv, "house_prices.csv")
    .await(function (error, data1, data2) {
      boundry_data = data1;
      prices_data = data2;

      console.log(prices_data);
      console.log(boundry_data);

      for (var d = 0; d < prices_data.length; d++) {
        dataArray.push(+prices_data[d].Average_Price);
      }

      draw(1995, boundry_data, prices_data);
    });
}

export default D3MAP;
