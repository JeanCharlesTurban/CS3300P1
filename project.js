



d3.csv("spotify.csv").then(function(data) {

    let musicdata = data;

    //Select the div
    let q3 = d3.select("#viz");
    q3.append("svg").attr("width", 800).attr("height", 700).attr("id","chart");
    svg = d3.select("svg#chart");



    //Set Constant Values
    margin = { "top": 20, "right": 50, "bottom": 80, "left":150};
    width = svg.attr("width");
    height = svg.attr("height");
    chartwidth = width - margin["left"] - margin["right"];
    chartheight = height - margin["top"]-margin["bottom"];

    //Max Values
    const eMin = d3.min(musicdata, d => d['energy']);
    const eMax = d3.max(musicdata, d => d['energy']);
    const duMin = d3.min(musicdata, d => d['duration_ms']);
    const duMax = d3.max(musicdata, d => d['duration_ms']);
    const liMin = d3.min(musicdata, d => d['liveness']);
    const liMax = d3.max(musicdata, d => d['liveness']);
    const loMin = d3.min(musicdata, d => d['loudness']);
    const loMax = d3.max(musicdata, d => d['loudness']);

    d['duration_ms'] = Number(d['duration_ms']);      
    console.log(duMin)
    console.log(duMax)

    //Scales for major viz
    yScale = d3.scaleLinear().domain([1, 0]).range([0,chartheight]);
    xScale = d3.scaleLinear().domain([0, 1000000/360]).range([0, chartwidth]);
    rScale = d3.scaleLinear().domain([loMin, loMax]).range([1, 7]);
    colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, liMax])

    //Legend
    svgS = d3.select("#scales");

    let initx = 0
    let textx = 0
    let inity = 25


    svgS.append("text")
      .attr("x", initx)
      .attr("y",40)
      .attr("fill","white")
      .attr("font-size","20px")
      .attr("class","font title")
      .text("Spotify Song Data");

    initx = initx + 250;
    textx = textx + 250;
    svgS.append("text")
      .attr("x",initx)
      .attr("y",inity-3)
      .attr("fill","white")
      .attr("font-size","14px")
      .attr("class","font title")
      .text("Song Liveness");
    for(k=0; k <= 1;k=k+.2){
      svgS.append("rect")
        .attr("x", initx)
        .attr("y", inity)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", colorScale(k));
      svgS.append("text")
        .attr("x", textx)
        .attr("y","55")
        .attr("fill","white")
        .attr("font-size","10px")
        .attr("class","font title")
        .text(Math.round(k*10));
      initx = initx + 20;
      textx = textx + 21;
    }
    svgS.append("text")
      .attr("x", initx+50)
      .attr("y",40)
      .attr("fill","white")
      .attr("font-size","20px")
      .attr("class","font title")
      .text("X-Scale: Song Duration");

    svgS.append("text")
      .attr("x", initx+350)
      .attr("y",40)
      .attr("fill","white")
      .attr("font-size","20px")
      .attr("class","font title")
      .text("Y-Scale: Song Energy");




    //Background
    svg.append("rect")
        .attr("x", margin["left"])
        .attr("y", margin["top"])
        .attr("height", chartwidth)
        .attr("width", chartheight)
        .attr("id","viz-background")
        .attr("fill", "white");

    //Draw all circles
    svg.append("g").attr("id","datapoints")
    svgb2 = d3.select("g#datapoints");

    for(k=0;k < musicdata.length;k++){
      if (musicdata[k].duration_ms != 'NaN' && musicdata[k].energy != 'NaN'){
        svgb2.append("circle")
        .attr("cx",xScale(musicdata[k].duration_ms/360)+margin["left"])
        .attr("cy",yScale(musicdata[k].energy)+margin["top"])
        .attr("r",rScale(musicdata[k].loudness))
        .style("fill", colorScale(musicdata[k].liveness))
        .attr("id",musicdata[k].song_title)
        .attr("opacity",.7);
          }
    }

    leftAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("stroke-width",1.8)
      .attr("transform","translate("+(margin.left)+","+margin.top+")")
      .style("font", "12px times")
      .attr("class","yscale")
      .call(leftAxis.ticks(5));

    bottomAxis = d3.axisBottom(xScale)
    svg.append("g")
      .attr("stroke-width",1.8)
      .style("font", "12px times")
      .attr("class","xscale")
      .attr("transform","translate("+(margin.left)+","+(chartheight + margin.top)+")")
      .call(bottomAxis.ticks(5));



      //Artist1 Box

      svg = d3.select("#DrakeRec");
      svg.attr("width", 250).attr("height", 100).attr("id","info");

      //Put the artists name here
      artists = "Drake"
      drake = musicdata.filter( d => d['artist'] == artists);
      drake = drake.filter( d => d['duration_ms'] != 'NaN');

      //Mean Values of Columns for Drake
      const dmeanlo = d3.mean(drake, d => d['loudness']);
      const dmeanli = d3.mean(drake, d => d['liveness']);
      const dmeandu = d3.mean(drake, d => d['duration_ms']);
      const dmeanen = d3.mean(drake, d => d['energy']);

      //Artists Name Print along with statistics
      svg.append("text")
        .attr("x","10")
        .attr("y","30")
        .attr("fill","crimson")
        .attr("font-size","20px")
        .attr("class","font title")
        .text(artists);
      svg.append("text")
          .attr("x","10")
          .attr("y","55")
          .attr("fill","white")
          .attr("font-size","14px")
          .attr("class","font title")
          .text("AVG loudness:" + Math.abs((dmeanlo)));
      svg.append("text")
              .attr("x","10")
              .attr("y","80")
              .attr("fill","white")
              .attr("font-size","14px")
              .attr("class","font title")
              .text("AVG energy:" + Math.abs((dmeanen)));


      //Smaller Viz of the big viz
      svg = d3.select("#drakeballs");
      svg.attr("width", 400).attr("height", 250);

      //MusicData
      musicdata = drake;

      //Margins and Chart Attr
      margin = { "top": 10, "right": 150, "bottom": 10, "left":10};
      width = svg.attr("width");
      height = svg.attr("height");
      chartwidth = width - margin["left"] - margin["right"];
      chartheight = height - margin["top"]-margin["bottom"];

      //New Scales for smaller viz
      yScale = d3.scaleLinear().domain([1, 0]).range([0,230]);
      xScale = d3.scaleLinear().domain([0, 1000000]).range([0, 230]);
      rScale = d3.scaleLinear().domain([loMin, loMax]).range([1, 3]);
      colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, liMax])

      //Append a group with the data points
      svg.append("g").attr("id","drakestuffs")
      svgb2 = d3.select("g#drakestuffs");

      for(k=0;k < musicdata.length;k++){
        if (musicdata[k].duration_ms != 'NaN' && musicdata[k].energy != 'NaN'){
          svgb2.append("circle")
          .attr("cx",xScale(musicdata[k].duration_ms)+margin["left"])
          .attr("cy",yScale(musicdata[k].energy)+margin["top"])
          .attr("r",rScale(musicdata[k].loudness))
          .style("fill", colorScale(musicdata[k].liveness))
          .attr("opacity",1);
          }
      }

      leftAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("stroke-width",1.8)
        .attr("transform","translate("+(margin.left)+","+margin.top+")")
        .style("font", "12px times")
        .attr("color","white")
        .call(leftAxis.ticks(0));

      bottomAxis = d3.axisBottom(xScale)
      svg.append("g")
        .attr("stroke-width",1.8)
        .style("font", "12px times")
        .attr("color","white")
        .attr("transform","translate("+(margin.left)+","+(chartheight + margin.top)+")")
        .call(bottomAxis.ticks(0));

      //Floating Balls Next
      rScale = d3.scaleLinear().domain([loMin, loMax]).range([1, 15]);

      bx = 220
      by = 30

      for(k=0;k<5;k++){
        svg.append("circle")
          .attr("cx",bx)
          .attr("cy",by)
          .attr("r",rScale(musicdata[k].loudness))
          .style("fill",colorScale(musicdata[k].liveness))
          .attr("opacity",1);
        svg.append("text")
          .attr("x",bx+20)
          .attr("y",by+5)
          .attr("fill","white")
          .attr("font-size","10px")
          .attr("class","font drakeblz")
          .text(musicdata[k].song_title);
        by = by + 40
      }

      //FutureViz

      svg = d3.select("#KendrickRec");
      svg.attr("width", 250).attr("height", 100);

      //Artist Name
      artists = "Future"
      musicdata = data;
      future = musicdata.filter( d => d['artist'] == artists);
      future = future.filter( d => d['duration_ms'] != 'NaN');
      musicdata = future;

      //Artist2 Mean Values
      const kmeanlo = d3.mean(future, d => d['loudness']);
      const kmeanli = d3.mean(future, d => d['liveness']);
      const kmeandu = d3.mean(future, d => d['duration_ms']);
      const kmeanen = d3.mean(future, d => d['energy']);

      //Print Out Artist Info
      svg.append("text")
        .attr("x","10")
        .attr("y","30")
        .attr("fill","crimson")
        .attr("font-size","20px")
        .attr("class","font title")
        .text(artists);
      svg.append("text")
          .attr("x","10")
          .attr("y","55")
          .attr("fill","white")
          .attr("font-size","14px")
          .attr("class","font title")
          .text("AVG loudness:" + Math.abs((kmeanlo)));
      svg.append("text")
              .attr("x","10")
              .attr("y","80")
              .attr("fill","white")
              .attr("font-size","14px")
              .attr("class","font title")
              .text("AVG energy:" + Math.abs((kmeanen)));


      //Small Viz
      svg = d3.select("#kendrickballs");
      svg.attr("width", 400).attr("height", 250);

      musicdata = future;

      //Margins and Chart Height
      margin = { "top": 10, "right": 150, "bottom": 10, "left":10};
      width = svg.attr("width");
      height = svg.attr("height");
      chartwidth = width - margin["left"] - margin["right"];
      chartheight = height - margin["top"]-margin["bottom"];

      //New Scale
      rScale = d3.scaleLinear().domain([loMin, loMax]).range([1, 3]);

      //Select Div Element
      svg.append("g").attr("id","kstuffs")
      svgb2 = d3.select("g#kstuffs");

      //Draw Points
      for(k=0;k < musicdata.length;k++){
        if (musicdata[k].duration_ms != 'NaN' && musicdata[k].energy != 'NaN'){
          svgb2.append("circle")
          .attr("cx",xScale(musicdata[k].duration_ms)+margin["left"])
          .attr("cy",yScale(musicdata[k].energy)+margin["top"])
          .attr("r",rScale(musicdata[k].loudness))
          .style("fill", colorScale(musicdata[k].liveness))
          .attr("opacity",1);
            }
      }


      leftAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("stroke-width",1.8)
        .attr("transform","translate("+(margin.left)+","+margin.top+")")
        .style("font", "12px times")
        .attr("color","white")
        .call(leftAxis.ticks(0));

      bottomAxis = d3.axisBottom(xScale)
      svg.append("g")
        .attr("stroke-width",1.8)
        .style("font", "12px times")
        .attr("color","white")
        .attr("transform","translate("+(margin.left)+","+(chartheight + margin.top)+")")
        .call(bottomAxis.ticks(0));

      //New R Scale for side
      rScale = d3.scaleLinear().domain([loMin, loMax]).range([1, 15]);

      by = 220
      bx = 30

      for(k=0;k<5;k++){
        svg.append("circle")
          .attr("cx",by)
          .attr("cy",bx)
          .attr("r",rScale(musicdata[k].loudness))
          .style("fill",colorScale(musicdata[k].liveness))
          .attr("opacity",1);
        svg.append("text")
          .attr("x",by+20)
          .attr("y",bx+5)
          .attr("fill","white")
          .attr("font-size","10px")
          .attr("class","font drakeblz")
          .text(musicdata[k].song_title.substr(0, 11));
        bx = bx + 40
      }

})
