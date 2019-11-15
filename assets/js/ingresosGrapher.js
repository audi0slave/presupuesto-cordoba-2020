window.already_printed_ae = false;

function dibujarD3_ing() {
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1nxgf8vEk_ke-_8syoFFexkskbJ3w6EE8tNuFtbkW2CA/values/2020/?key="+apiKey, function(dataJSON) {
    $("#ingresosGraph").empty();
    var datos = [];
    var detalle = [];
    console.log(dataJSON);
    $.each(dataJSON.values, function(key, val) {
      if (key > 0) {
        var partida = val[0];
        var partida_splited = partida.split('.');
        var nivel = partida_splited.length;
        var nivel_princ = parseInt(partida_splited[0]);
        var nombre = val[1];
        var total = val[2];
        if (partida_splited[1] == "") {
          nivel -= 1;
        }
        detalle[nivel] = nombre;

        if (nivel_princ == 3) {
          nivel = 4
          detalle[2] = detalle[1]
          detalle[3] = detalle[1]
          detalle[4] = detalle[1]
        } else if (nivel_princ == 2 && nivel == 3) {
          nivel = 4
          detalle[4] = detalle[3]
        }

        if (nivel == 4) {
          var linea = {
            "key": detalle[4],
            "rec1": detalle[1],
            "rec2": detalle[2],
            "rec3": detalle[3],
            "valor": parseInt(total.split('.').join(""))
          }
          datos.push(linea);
        }
      }

    });
    // console.log(datos);


    var data = d3.nest()
      .key(function(d) {
        return d.rec1;
      })
      .key(function(d) {
        return d.rec2;
      })
      .key(function(d) {
        return d.rec3;
      })
      .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#ingresosGraph")
      .legend({
        "size": 30
      })
      // .labels({"align": "left", "valign": "top"})
      .tooltip(true)
      .tooltip({
        "children": 0
      })
      // .tooltip({"large":getTooltipWidth(), "small":getTooltipWidth()})
      .data(datos)
      .type("tree_map")
      .id(["rec1", "rec2", "rec3", "key"])
      .size("valor")
      .format("es_ES")
      .format({
        "number": function(number, key) {
          var formatted = d3plus.number.format(number, key);
          if (key.key === "valor") {
            var formatted = number.toLocaleString("es-AR")
            return "$" + formatted;
          } else {
            return formatted
          }
        }
      })
      .dev(true)
      .draw();

  });



}


$(window).on('resize', function() {
  dibujarD3_ing();
});

function dibujar() {
  dibujarD3_ing();
}

$(document).ready(function() {
  dibujar();
});