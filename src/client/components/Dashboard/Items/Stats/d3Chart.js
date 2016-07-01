import d3 from 'd3';
import sleepMemData from './dataSeedAlgo.js';
let sleepData; 
let memData;
[sleepData, memData] = sleepMemData();
const hours = sleepData.map(day => day.duration);
console.log(hours);
// const dataset = sleepData.slice(0, 10).concat(sleepData.slice(20));
// console.log(dataset);
const scale = 30;
const barPadding = 1;
/* eslint-disable func-names */
const getDaysDifference = (start, end) => {
  // 1000 milliseconds per sec; 60 sec per min; 60 min per hour; 24 hours per day 
  const convertToDays = (ms) => (((ms / 1000) / 60) / 60) / 24;

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.floor(convertToDays(endTime - startTime));
};

// mapping a start date to a label
const getDateAxis = (startDate, endDate) => {
  const xScale = 10; // pixels

  return getDaysDifference(startDate, endDate);
};

class d3ChartClass {
  constructor(el, props, dataset) {
    this.width = Number((props.width).match(/\d+/)) * 0.9;
    this.wPad = (props.width * 0.1) / 2;
    this.height = Number((props.height).match(/\d+/)) * 0.9;
    this.hPad = (props.height * 0.1) / 2;
    // this.units = props.width.match(/\D+/) || '';
    this.dataset = dataset;
    this.timeFrame = 30;
    this.svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);
    this.attr = {
      dataset: this.dataset,
      width: this.width,
      height: this.height,
      wPad: this.wPad,
      hPad: this.hPad,
      timeFrame: this.timeFrame
    };
  }

  makeBars(el, props, objects) {
    const barWidth = this.width / this.timeFrame;
    const chartH = this.height;
    const units = this.units;
    const hPad = this.hPad;
    const wPad = this.wPad / 2;
    const dataset = this.dataset;
    this.svg.selectAll('rect')
      .data(dataset)  // array of daily sleep data
      .enter()
      .append('rect')   // create the bar graph
      .each(function (data, index) {
        // if based on time...
        //console.log('hey1', data);
        const i = getDaysDifference(dataset[0]['date_performed'], data.date_performed);
        console.log(i);
        // create bar graph based on x, y, width, and variant color
        console.log('chart height ', chartH);
        console.log('hey', data.duration*scale);
        console.log('wpad ', wPad);
        d3.select(this)
          .attr({
            x: `${i * barWidth + barWidth/2 + wPad}`,
            y: `${chartH - (data.duration * scale) - hPad}`,
            width: `${barWidth-0.5}`,
            height: `${data.duration * scale}`,
            fill: `rgb(0, 0, ${Math.floor(data.duration * scale)})`,
          });
      });
  }

  makeDataTexts(el, props, objects) {
    // const dataset = sleepData;
    //  bar width based on chart width and number of data points
    // width based on chart width and number of data points
    const chartW = this.width;
    const chartH = this.height;
    const barWidth = chartW / this.timeFrame;
    const fontSize = barWidth * 0.7;
    const dataset = this.dataset;
    this.svg.selectAll('text')
    .data(dataset)  // array of daily sleep data
    .enter()
    .append('text')   // create the bar graph
    .each(function (d, index) {
      const i = getDaysDifference(dataset[0]['date_performed'], d.date_performed);
      // create bar graph based on x, y, width, and variant color
      d3.select(this)
        .attr({
          x: i * barWidth + barWidth / 2 + 10,
          y: chartH - (d.duration * scale) + fontSize,
          fill: 'white',
          'font-family': 'sans-serif',
          'font-size': `${fontSize}px`,
          'text-anchor': 'middle',
        })
        .text(data => data.time);
    });
  }

  makeScatter(el, props, objects) {
    const rSize = 4;
    const attr = this.attr;
    const barWidth = attr.width / this.timeFrame - barPadding;
    this.svg.selectAll('circle')
    .data(dataset)  // array of daily sleep data
    .enter()
    .append('circle')   // create the bar graph
    .each(function (d, index) {
      const i = getDaysDifference(dataset[0]['date_performed'], d.date_performed);
      // create bar graph based on x, y, width, and variant color
      d3.select(this)
        .attr({
          cx: i * barWidth + attr.wPad + i + rSize,
          cy: attr.height - (d.duration * scale) - attr.hPad,
          r: rSize,
          fill: datum => ("rgb(" + Math.floor(datum.time * scale) + ", 0, 0)"),
        });
    });
    console.log(getDateAxis(dataset[0].date, dataset[dataset.length-1].date));
  }

  makeScale(data, h, w, timeFrame) {
    const xScale = d3.scale.linear()
      .domain([0, timeFrame])
      .range([w[0], w[1]]);
    return xScale;    
  }

  makeAxis(m) {
    const attr = this.attr;
    const barWidth = attr.width / this.timeFrame;
    const mScale = this.makeScale(dataset, attr.height, [attr.wPad, attr.width+attr.wPad], attr.timeFrame);
    const mAxis = d3.svg.axis()
                    .scale(mScale)
                    .orient('bottom')
                    .ticks(5);
    this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${attr.height - attr.hPad})`)
            .call(mAxis);
  }

}

// const d3Chart = {};

// console.log(sleepData);
// console.log(memData);
// d3Chart.create = function(el, props, state) {
//   const svg = d3.select(el).append('svg')
//       .attr('class', 'd3')
//       .attr('width', props.width)
//       .attr('height', props.height);

//   svg.append('g');

//   // this.update(el, state);
//   return svg;
// };

// d3Chart.makeCircle = function(el, props) {
//   d3.select(el).append('circle')
//     .attr('cx', '25')
//     .attr('cy', '25')
//     .attr('r', 22);
// };

// d3Chart.create('#main-chart', { width: '100px', height: '100px' }, null);


// d3Chart.update = function(el, state) {
//   // Re-compute the scales, and render the data points
//   var scales = this._scales(el, state.domain);
//   this._drawPoints(el, scales, state.data);
// };

// d3Chart.destroy = function(el) {
//   // Any clean-up would go here
//   // in this example there is nothing to do
// };

// d3Chart._drawPoints = function(el, scales, data) {
//   var g = d3.select(el).selectAll('.d3-points');

//   var point = g.selectAll('.d3-point')
//     .data(data, function(d) { return d.id; });

//   // ENTER
//   point.enter().append('circle')
//       .attr('class', 'd3-point');

//   // ENTER & UPDATE
//   point.attr('cx', function(d) { return scales.x(d.x); })
//       .attr('cy', function(d) { return scales.y(d.y); })
//       .attr('r', function(d) { return scales.z(d.z); });

//   // EXIT
//   point.exit()
//       .remove();
// };

export default d3ChartClass;