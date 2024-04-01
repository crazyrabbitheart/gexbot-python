let intervalId;
function displayData(option) {
  /**
   * Stuff related to SPX
   */
  if(intervalId) {
    clearInterval(intervalId)
  }
  const BASE_URL = `https://api.gexbot.com/${option}`;
  const url = `${BASE_URL}/gex/all?key=${apiKey}`;
  const maxChangeUrl = `${BASE_URL}/gex/all/maxchange?key=${apiKey}`;
  const data = 0;
  function regularCall() {
    fetch(maxChangeUrl)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("max-change-1-a").textContent =
          data.one[0].toFixed(2);
        document.getElementById("max-change-1-b").textContent =
          data.one[1].toFixed(2) + "Bn";
        document.getElementById("max-change-5-a").textContent =
          data.five[0].toFixed(2);
        document.getElementById("max-change-5-b").textContent =
          data.five[1].toFixed(2) + "Bn";
        document.getElementById("max-change-10-a").textContent =
          data.ten[0].toFixed(2);
        document.getElementById("max-change-10-b").textContent =
          data.ten[1].toFixed(2) + "Bn";
        document.getElementById("max-change-15-a").textContent =
          data.fifteen[0].toFixed(2);
        document.getElementById("max-change-15-b").textContent =
          data.fifteen[1].toFixed(2) + "Bn";
        document.getElementById("max-change-30-a").textContent =
          data.thirty[0].toFixed(2);
        document.getElementById("max-change-30-b").textContent =
          data.thirty[1].toFixed(2) + "Bn";
        const timestamp = data.timestamp;
        const date = timestamp.slice(0, 10);
        const newDate = date.replace(/-/g, "/");
        const time = timestamp.slice(11, 19);
        document.getElementById("date-p").innerHTML = newDate;
        document.getElementById("time-p").innerHTML = time;
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        /** Prepare the data */
        console.log(data);
        const len = data.strikes.length;
        var firstnum = 0;
        var secondnum = 0;
        if(len > 100){
          firstnum=Math.round(len*0.2);
          secondnum = Math.round(len*0.8);
        }else{
          secondnum = len;
        }
        const t = data.strikes.slice(firstnum, secondnum);
        console.log(t);
        const scatterarray1 = [];
        const scatterarray2 = [];
        const scatterarray3 = [];
        const scatterarray4 = [];
        const scatterarray5 = [];
        for (let i = 0; i < t.length; i++) {
          scatterarray1.push([t[i][3][0], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray2.push([t[i][3][1], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray3.push([t[i][3][2], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray4.push([t[i][3][3], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray5.push([t[i][3][4], t[i][0]]);
        }
        
        const strikes = t.map((strike) => strike[0]);
        const gexVolData = t.map((strike) => ({
          value: strike[1],
          label: "labelRight",
        }));

        const gexOiData = t.map((strike) => ({
          value: strike[2],
          label: "labelLeft",
        }));
        const points_x_oi = gexOiData.map((row) => Math.abs(row.value));
        points_x_oi.sort(function (a, b) {
          return b - a;
        });
        // const max_x_oi = Math.round(points_x_oi[0]);
        const max_x_oi = points_x_oi[0];
        const points_x_vol = gexVolData.map((row) => Math.abs(row.value));
        points_x_vol.sort(function (a, b) {
          return b - a;
        });
        // const max_x_vol = Math.round(points_x_vol[0]);
        const max_x_vol = points_x_vol[0];
        var position_place = 0;
        if (max_x_oi >= max_x_vol) {
          position_place = max_x_oi;
        } else {
          position_place = max_x_vol;
        }
        const x_pos_max = position_place * 1.1;
        const x_pos_min = -1.1 * position_place;
        // console.log(max_x_oi);
        const zeroGamma = data.zero_gamma;
        const spot = data.spot;
        const majorPosVol = data.major_pos_vol;
        const majorPosOi = data.major_pos_oi;
        const majorNegVol = data.major_neg_vol;
        const majorNegOi = data.major_neg_oi;

        var roundedZeroGamma = 0;
        var roundedSpot = 0;
        var roundedMajorPosVol = 0;
        var roundedMajorPosOi = 0;
        var roundedMajorNegVol = 0;
        var roundedMajorNegOi = 0;
        if (spot>100) {
          roundedZeroGamma = Math.round(zeroGamma / 5) * 5;
          roundedSpot = Math.round(data.spot / 5) * 5;
          roundedMajorPosVol = Math.round(data.major_pos_vol / 5) * 5;
          roundedMajorPosOi = Math.round(data.major_pos_oi / 5) * 5;
          roundedMajorNegVol = Math.round(data.major_neg_vol / 5) * 5;
          roundedMajorNegOi = Math.round(data.major_neg_oi / 5) * 5;
        }else{
          roundedZeroGamma = Math.round(Math.round(zeroGamma *10) /10);
          roundedSpot = Math.round(Math.round(data.spot *10) /10);
          console.log(roundedSpot);
          roundedMajorPosVol = Math.round(Math.round(data.major_pos_vol *10) /10);
          roundedMajorPosOi = Math.round(Math.round(data.major_pos_oi *10) /10);
          roundedMajorNegVol = Math.round(Math.round(data.major_neg_vol *10) /10);
          roundedMajorNegOi = Math.round(Math.round(data.major_neg_oi *10) /10);
        }        

        const coorminvalue = t[3][0];
        const coormaxvalue = t[6][0];
        const interval_y = (coormaxvalue - coorminvalue);
        console.log(interval_y);
        //  * Rendering Spot
        document.getElementById("spot-p").innerHTML = spot;
        //  * Rendering Zero Gamma
        document.getElementById("zero-gamma-p").innerHTML = zeroGamma;
        /**
         * Rendering Major Positive Volume
         */
        document.getElementById("major-positive-volume-p").innerHTML =
          majorPosVol;
        /**
         * Rendering Major Negative Volume
         */
        document.getElementById("major-negative-volume-p").innerHTML =
          majorNegVol;
        /**
         * Rendering Major Positive OI
         */
        document.getElementById("major-positive-oi-p").innerHTML = majorPosOi;
        /**
         * Rendering Major Negative OI
         */
        document.getElementById("major-negative-oi-p").innerHTML = majorNegOi;
        /**
         * Rendering Net Gex
         */
        let net_gex_vol = data.sum_gex_vol;
        let net_gex_oi = data.sum_gex_oi;
       
        document.getElementById("net-gex-volume-p").textContent =
          net_gex_vol.toFixed(3);
        document.getElementById("net-gex-oi-p").textContent =
          net_gex_oi.toFixed(3);

        var dom = document.getElementById("chart-container");
        var myChart = echarts.init(dom, null, {
          renderer: "canvas",
          useDirtyRect: false,
        });

        var option;
        const labelLeft = {
          position: "left",
        };
        const labelRight = {
          position: "right",
        };

        option = {
          dataZoom: [
            {
              id: "dataZoomX",
              type: "inside",
              xAxisIndex: [0],
              filterMode: "filter",
            },
            {
              id: "dataZoomY",
              type: "inside",
              yAxisIndex: [0],
              filterMode: "empty",
            },
          ],
          title: {
            textStyle: {
              color: "#ffffff",
            },
            left: "center",
            top: "middle",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            top: 10,
            bottom: 30,
            left: 100,
            containerLabel: true,
          },
          xAxis: {
            type: "value",
            position: "center",
            splitLine: { 
              show: true,
              lineStyle: {
                color : '#696767',
              },
             },
            min: function () {
              return x_pos_min;
            },
            max: function () {
              return x_pos_max;
            },
            beginAtZero: true,
            axisPointer: {
              label: {
                show: true,
              },
            },
            axisLabel: {
              interval: 20, // Set the interval for displaying labels on the x-axis
            },
          },
          yAxis: {
            type: "category",
            axisLine: {
              show: true,
            },
            axisLabel: {
              show: true,
              interval :interval_y,
            },
            axisTick: {
              show: true,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color : '#696767',
              },
            },
            minorTick: { show: false },
            label: {
              show: true,
              align: "center",
            },
            onZero: true,
            onZeroAxisIndex: 1,
            position: "center",
            data: strikes,
          },
          series: [
            {
              name: "GEX By Vol",
              type: "bar",

              markLine: {
                data: [
                  {
                    name: "Spot",
                    xAxis: 0,
                    yAxis: roundedSpot.toString(),
                    lineStyle: {
                      color: "rgb(255,255,255)",
                      type: "line",
                      width: 2,
                    },
                    position:'center',
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Spot value \n \n${spot}`,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#000",
                      padding: [10, 15],
                      position: "start",
                    },
                  },
                  {
                    name: "Zero Gamma",
                    xAxis: 0,
                    yAxis: roundedZeroGamma.toString(),
                    lineStyle: {
                      color: " rgb(252, 177, 3)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Zero Gamma \n${zeroGamma}`,
                      backgroundColor: "rgb(252, 177, 3)",
                      color: "#fff",
                      padding: [5, 10],
                    },
                  },
                  {
                    name: "MajorPosVol",
                    xAxis: 0,
                    yAxis: roundedMajorPosVol.toString(),
                    position: "center",
                    lineStyle: {
                      color: "rgb(3, 255, 53)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Posiive\n Volume \n${majorPosVol}`,
                      backgroundColor: " rgb(3, 255, 53)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "middle",
                    },
                  },
                  {
                    name: "MajorPosOi",
                    xAxis: 0,
                    yAxis: roundedMajorPosOi.toString(),
                    lineStyle: {
                      color: "rgb(232, 121, 249)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Positive\n Oi \n${majorPosOi}`,
                      backgroundColor: "rgb(232, 121, 249)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "start",
                    },
                  },
                  {
                    name: "MajorNegVol",
                    xAxis: 0,
                    yAxis: roundedMajorNegVol.toString(),
                    lineStyle: {
                      color: "rgb(61, 138, 68)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Negative\n Vol \n${majorNegVol}`,
                      backgroundColor: "rgb(61, 138, 68)",
                      color: "#fff",
                      padding: [5, 10],
                    },
                  },
                  {
                    name: "MajorNegOi",
                    xAxis: 0,
                    yAxis: roundedMajorNegOi.toString(),
                    lineStyle: {
                      color: "rgb(162, 28, 175)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Negative\n Oi \n${majorNegOi}`,
                      backgroundColor: "rgb(162, 28, 175)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "middle",
                    },
                  },
                ],
              },

              label: {
                show: false,
                position: function (params) {
                  return params.value >= 0 ? labelRight : labelLeft;
                },
                align: "center",
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 10,
                  // color: 'red',
                  color: function (params) {
                    var colorList = ["lightgreen", "red"];
                    return params.data.value > 0 ? colorList[0] : colorList[1];
                  },
                },
                emphasis: {
                  barBorderRadius: 10,
                },
              },
              barWidth: 3,
              barCategoryGap: "0%",
              data: gexVolData,
            },

            {
              name: "GEX By OI",
              type: "bar",

              label: {
                show: false,
                position: function (params) {
                  return params.value >= 0 ? labelRight : labelLeft;
                },
                align: "center",
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 10,
                  // color : 'blue',
                  color: function (params) {
                    var colorList = ["green", "pink"];
                    return params.data.value > 0 ? colorList[0] : colorList[1];
                  },
                },
                emphasis: {
                  barBorderRadius: 10,
                },
              },
              barWidth: 3,
              barCategoryGap: "0%",
              data: gexOiData,
            },

            {
              name: "point By key",
              xAxis: scatterarray1.map((row) => row[0]),
              yAxis: scatterarray1.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray1.map((row) => row[0]),
              itemStyle: {
                color: "#6a6585",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray2.map((row) => row[0]),
              yAxis: scatterarray2.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray2.map((row) => row[0]),
              itemStyle: {
                color: "#5e5497",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray3.map((row) => row[0]),
              yAxis: scatterarray3.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray3.map((row) => row[0]),
              itemStyle: {
                color: "#4c3da3",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray4.map((row) => row[0]),
              yAxis: scatterarray4.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray4.map((row) => row[0]),
              itemStyle: {
                color: "#361cc5",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray5.map((row) => row[0]),
              yAxis: scatterarray5.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray5.map((row) => row[0]),
              itemStyle: {
                color: "#2c0be7",
              },
            },
          ],
        };

        if (option && typeof option === "object") {
          myChart.setOption(option);
        } else {
          console.log("error");
        }

        window.addEventListener("resize", myChart.resize);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  intervalId = setInterval(regularCall, 10000); // Time in milliseconds

  fetch(maxChangeUrl)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("max-change-1-a").textContent =
          data.one[0].toFixed(2);
        document.getElementById("max-change-1-b").textContent =
          data.one[1].toFixed(2) + "Bn";
        document.getElementById("max-change-5-a").textContent =
          data.five[0].toFixed(2);
        document.getElementById("max-change-5-b").textContent =
          data.five[1].toFixed(2) + "Bn";
        document.getElementById("max-change-10-a").textContent =
          data.ten[0].toFixed(2);
        document.getElementById("max-change-10-b").textContent =
          data.ten[1].toFixed(2) + "Bn";
        document.getElementById("max-change-15-a").textContent =
          data.fifteen[0].toFixed(2);
        document.getElementById("max-change-15-b").textContent =
          data.fifteen[1].toFixed(2) + "Bn";
        document.getElementById("max-change-30-a").textContent =
          data.thirty[0].toFixed(2);
        document.getElementById("max-change-30-b").textContent =
          data.thirty[1].toFixed(2) + "Bn";
        const timestamp = data.timestamp;
        const date = timestamp.slice(0, 10);
        const newDate = date.replace(/-/g, "/");
        const time = timestamp.slice(11, 19);
        document.getElementById("date-p").innerHTML = newDate;
        document.getElementById("time-p").innerHTML = time;
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        /** Prepare the data */
        console.log(data);
        const len = data.strikes.length;
        var firstnum = 0;
        var secondnum = 0;
        if(len > 100){
          firstnum=Math.round(len*0.2);
          secondnum = Math.round(len*0.8);
        }else{
          secondnum = len;
        }
        const t = data.strikes.slice(firstnum, secondnum);
        const scatterarray1 = [];
        const scatterarray2 = [];
        const scatterarray3 = [];
        const scatterarray4 = [];
        const scatterarray5 = [];
        for (let i = 0; i < t.length; i++) {
          scatterarray1.push([t[i][3][0], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray2.push([t[i][3][1], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray3.push([t[i][3][2], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray4.push([t[i][3][3], t[i][0]]);
        }
        for (let i = 0; i < t.length; i++) {
          scatterarray5.push([t[i][3][4], t[i][0]]);
        }

        const strikes = t.map((strike) => strike[0]);
        const gexVolData = t.map((strike) => ({
          value: strike[1],
          label: "labelRight",
        }));

        const gexOiData = t.map((strike) => ({
          value: strike[2],
          label: "labelLeft",
        }));
        const points_x_oi = gexOiData.map((row) => Math.abs(row.value));
        points_x_oi.sort(function (a, b) {
          return b - a;
        });
        // const max_x_oi = Math.round(points_x_oi[0]);
        const max_x_oi = points_x_oi[0];
        const points_x_vol = gexVolData.map((row) => Math.abs(row.value));
        points_x_vol.sort(function (a, b) {
          return b - a;
        });
        // const max_x_vol = Math.round(points_x_vol[0]);
        const max_x_vol = points_x_vol[0];
        var position_place = 0;
        if (max_x_oi >= max_x_vol) {
          position_place = max_x_oi;
        } else {
          position_place = max_x_vol;
        }
        const x_pos_max = position_place * 1.1;
        const x_pos_min = -1.1 * position_place;
        // console.log(max_x_oi);
        const zeroGamma = data.zero_gamma;
        const spot = data.spot;
        const majorPosVol = data.major_pos_vol;
        const majorPosOi = data.major_pos_oi;
        const majorNegVol = data.major_neg_vol;
        const majorNegOi = data.major_neg_oi;

        var roundedZeroGamma = 0;
        var roundedSpot = 0;
        var roundedMajorPosVol = 0;
        var roundedMajorPosOi = 0;
        var roundedMajorNegVol = 0;
        var roundedMajorNegOi = 0;
        if (spot>100) {
          roundedZeroGamma = Math.round(zeroGamma / 5) * 5;
          roundedSpot = Math.round(data.spot / 5) * 5;
          roundedMajorPosVol = Math.round(data.major_pos_vol / 5) * 5;
          roundedMajorPosOi = Math.round(data.major_pos_oi / 5) * 5;
          roundedMajorNegVol = Math.round(data.major_neg_vol / 5) * 5;
          roundedMajorNegOi = Math.round(data.major_neg_oi / 5) * 5;
        }else{
          roundedZeroGamma = Math.round(Math.round(zeroGamma *10) /10);
          roundedSpot = Math.round(Math.round(data.spot *10) /10);
          console.log(roundedSpot);
          roundedMajorPosVol = Math.round(Math.round(data.major_pos_vol *10) /10);
          roundedMajorPosOi = Math.round(Math.round(data.major_pos_oi *10) /10);
          roundedMajorNegVol = Math.round(Math.round(data.major_neg_vol *10) /10);
          roundedMajorNegOi = Math.round(Math.round(data.major_neg_oi *10) /10);
        }
        
        var coorminvalue = t[3][0];
        var coormaxvalue = t[6][0];
        const interval_y = (coormaxvalue - coorminvalue) ;
        // console.log(interval_y);
        // console.log(t);
        // const long = t.length;
        // if (long < 40) {
        //   const w = t[0];
        //   const under = spot-w;
        //   const v = t[long -1];
        //   const top = v - spot;
        //   if (under < 20 && top < 20) {
        //     const under_arr = [];
        //     const top_arr = [];
        //     for(i = 1; i>20-under; i++){
        //       under_arr.push(w-i*(interval_y/3));
        //     }
        //     for(i = 1; i> top-20; i++){
        //       top_arr.push(v+i*(interval_y/3));
        //     }
        //     top_arr.map(row => {
        //       strikes.push(row);
        //       strikes.push
        //     })
        //   }
        // }
        console.log(strikes);
        //  * Rendering Spot
        document.getElementById("spot-p").innerHTML = spot;
        /**
         * Rendering Zero Gamma
         */
        document.getElementById("zero-gamma-p").innerHTML = zeroGamma;
        /**
         * Rendering Major Positive Volume
         */
        document.getElementById("major-positive-volume-p").innerHTML =
          majorPosVol;
        /**
         * Rendering Major Negative Volume
         */
        document.getElementById("major-negative-volume-p").innerHTML =
          majorNegVol;
        /**
         * Rendering Major Positive OI
         */
        document.getElementById("major-positive-oi-p").innerHTML = majorPosOi;
        /**
         * Rendering Major Negative OI
         */
        document.getElementById("major-negative-oi-p").innerHTML = majorNegOi;
        /**
         * Rendering Net Gex
         */
        let net_gex_vol = data.sum_gex_vol;
        let net_gex_oi = data.sum_gex_oi;
        document.getElementById("net-gex-volume-p").textContent =
          net_gex_vol.toFixed(3);
        document.getElementById("net-gex-oi-p").textContent =
          net_gex_oi.toFixed(3);

        var option;
        const labelLeft = {
          position: "left",
        };
        const labelRight = {
          position: "right",
        };

        option = {
          dataZoom: [
            {
              id: "dataZoomX",
              type: "inside",
              xAxisIndex: [0],
              filterMode: "filter",
            },
            {
              id: "dataZoomY",
              type: "inside",
              yAxisIndex: [0],
              filterMode: "empty",
            },
          ],
          title: {
            textStyle: {
              color: "#ffffff",
            },
            left: "center",
            top: "middle",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            top: 10,
            bottom: 30,
            left: 100,
            containerLabel: true,
          },
          xAxis: {
            type: "value",
            position: "center",
            splitLine: { 
              show: true,
              lineStyle: {
                color : '#696767',
              },
             },
            min: function () {
              return x_pos_min;
            },
            max: function () {
              return x_pos_max;
            },
            beginAtZero: true,
            axisPointer: {
              label: {
                show: true,
              },
            },
            axisLabel: {
              interval: 20, // Set the interval for displaying labels on the x-axis
            },
          },
          yAxis: {
            type: "category",
            axisLine: {
              show: true,
            },
            axisLabel: {
              show: true,
              interval :interval_y,
            },
            axisTick: {
              show: true,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color : '#696767',
              },
            },
            minorTick: { show: false },
            label: {
              show: true,
              align: "center",
            },
            onZero: true,
            onZeroAxisIndex: 1,
            position: "center",
            data: strikes,
          },
          series: [
            {
              name: "GEX By Vol",
              type: "bar",

              markLine: {
                data: [
                  {
                    name: "Spot",
                    xAxis: 0,
                    yAxis: roundedSpot.toString(),
                    lineStyle: {
                      color: "rgb(255,255,255)",
                      type: "line",
                      width: 2,
                    },
                    position:'center',
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Spot value \n \n${spot}`,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#000",
                      padding: [10, 15],
                      position: "start",
                    },
                  },
                  {
                    name: "Zero Gamma",
                    xAxis: 0,
                    yAxis: roundedZeroGamma.toString(),
                    lineStyle: {
                      color: " rgb(252, 177, 3)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Zero Gamma \n${zeroGamma}`,
                      backgroundColor: "rgb(252, 177, 3)",
                      color: "#fff",
                      padding: [5, 10],
                    },
                  },
                  {
                    name: "MajorPosVol",
                    xAxis: 0,
                    yAxis: roundedMajorPosVol.toString(),
                    position: "center",
                    lineStyle: {
                      color: "rgb(3, 255, 53)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Posiive\n Volume \n${majorPosVol}`,
                      backgroundColor: " rgb(3, 255, 53)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "middle",
                    },
                  },
                  {
                    name: "MajorPosOi",
                    xAxis: 0,
                    yAxis: roundedMajorPosOi.toString(),
                    lineStyle: {
                      color: "rgb(232, 121, 249)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Positive\n Oi \n${majorPosOi}`,
                      backgroundColor: "rgb(232, 121, 249)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "start",
                    },
                  },
                  {
                    name: "MajorNegVol",
                    xAxis: 0,
                    yAxis: roundedMajorNegVol.toString(),
                    lineStyle: {
                      color: "rgb(61, 138, 68)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Negative\n Vol \n${majorNegVol}`,
                      backgroundColor: "rgb(61, 138, 68)",
                      color: "#fff",
                      padding: [5, 10],
                    },
                  },
                  {
                    name: "MajorNegOi",
                    xAxis: 0,
                    yAxis: roundedMajorNegOi.toString(),
                    lineStyle: {
                      color: "rgb(162, 28, 175)",
                      type: "dashed",
                    },
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: true,
                      formatter: `Major Negative\n Oi \n${majorNegOi}`,
                      backgroundColor: "rgb(162, 28, 175)",
                      color: "#fff",
                      padding: [5, 10],
                      position: "middle",
                    },
                  },
                ],
              },

              label: {
                show: false,
                position: function (params) {
                  return params.value >= 0 ? labelRight : labelLeft;
                },
                align: "center",
              },
              itemStyle: {
                normal: {
                  // barBorderRadius: 10,
                  // color: 'red',
                  color: function (params) {
                    var colorList = ["lightgreen", "red"];
                    return params.data.value > 0 ? colorList[0] : colorList[1];
                  },
                },
                emphasis: {
                  barBorderRadius: 10,
                },
              },
              barWidth: 3,
              barCategoryGap: "10%",
              barGap: '2px',
              data: gexVolData,
            },

            {
              name: "GEX By OI",
              type: "bar",

              label: {
                show: false,
                position: function (params) {
                  return params.value >= 0 ? labelRight : labelLeft;
                },
                align: "center",
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 10,
                  // color : 'blue',
                  color: function (params) {
                    var colorList = ["green", "pink"];
                    return params.data.value > 0 ? colorList[0] : colorList[1];
                  },
                },
                emphasis: {
                  barBorderRadius: 10,
                },
              },
              barWidth: 3,
              barCategoryGap: "0%",
              data: gexOiData,
            },

            {
              name: "point By key",
              xAxis: scatterarray1.map((row) => row[0]),
              yAxis: scatterarray1.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray1.map((row) => row[0]),
              itemStyle: {
                color: "#6a6585",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray2.map((row) => row[0]),
              yAxis: scatterarray2.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray2.map((row) => row[0]),
              itemStyle: {
                color: "#5e5497",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray3.map((row) => row[0]),
              yAxis: scatterarray3.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray3.map((row) => row[0]),
              itemStyle: {
                color: "#4c3da3",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray4.map((row) => row[0]),
              yAxis: scatterarray4.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray4.map((row) => row[0]),
              itemStyle: {
                color: "#361cc5",
              },
            },
            {
              name: "point By key",
              xAxis: scatterarray5.map((row) => row[0]),
              yAxis: scatterarray5.map((row) => row[1]),
              type: "scatter",
              symbol: "circle",
              symbolSize: 3,
              data: scatterarray5.map((row) => row[0]),
              itemStyle: {
                color: "#2c0be7",
              },
            },
          ],
        };
        var dom = document.getElementById("chart-container");
        // dom.style.height = chartHeight + 'px';
        var myChart = echarts.init(dom, null, {
          renderer: "canvas",
          useDirtyRect: false,
        });

        if (option && typeof option === "object") {
          myChart.setOption(option);
        } else {
          console.log("error");
        }

        window.addEventListener("resize", myChart.resize);
      })
      .catch((error) => {
        console.error(error);
      });
}
