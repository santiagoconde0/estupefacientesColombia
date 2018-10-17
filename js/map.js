var width = 900,
  height = 900;

/*
ogr2ogr -f GeoJSON depts.json depto.shp -s_srs EPSG:26986 -t_srs EPSG:4326
topojson --id-property NOMBRE_DPT -p name=NOMBRE_DPT -p name -o colombia-departamentos.json depts.json
*/

d3.json("data/colombia-municipios.json", function(error, co) {

  //crea el SVG
  var svg = d3.select("#target3")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height);

  console.log("CO", co);
  console.log("Departamentos: ", co.objects.depts);
  console.log("Municipios: ", co.objects.mpios);

  console.log("Departamentos: ", topojson.feature(co, co.objects.depts).features);
  console.log("Municipios: ", topojson.feature(co, co.objects.mpios).features);

  console.log("Subsinits: ", subunits);
  console.log("Projection: ", projection);

  var subunits = topojson.feature(co, co.objects.mpios);
  var projection = d3.geo.mercator()
    .scale(2000)
    .translate([width / 2, height / 2])
    .center([-61, 43])
    .rotate([2, 3, 2]);

  var path = d3.geo.path()
    .projection(projection);

  svg.append("path")
    .datum(subunits)
    .attr("d", path);

  svg.selectAll(".dept")
    .data(topojson.feature(co, co.objects.depts).features)
    .enter().append("path")
    .attr("class", function(d) {
      console.log("Loop: ", d.properties.dpt);
      return d.properties.dpt;

    })
    .attr("d", path)
    .style("fill", "#ddc");
});



d3.csv("/data/OLD/2016.csv", function(error, data) {
  console.log("DATA: ", data);

  // Nest de los datos
  var nested_data = d3.nest()
    .key(function(d) {
      // return d3.timeMonth(parseTime(d.FECHA));
      return d.DEPARTAMENTO;
    })
    .rollup(d => {
      return d3.sum(d, d => +d.CANTIDAD);
    })
    .sortKeys(d3.ascending)
    .entries(data);
  console.log("Nested data: ", nested_data);

  var departamentos = nested_data.map(d => d.key);
  console.log("Departamentos: ", departamentos);



  nested_data.forEach(function(d) {
    console.log("El departamento es: " + d.key);
    d3.select("." + d.key)
      .style("fill", "red");
  });


  d3.select(".SANTANDER")
    .style("fill", "red");

});
