var byId = function( id ) { return document.getElementById( id ); };
// saving as pdf
function myFunction() {
 byId("buttonID").style.display = "none";
 byId("footer").style.display = "none";

  window.print();
 byId("footer").style.display = "block";
 byId("buttonID").style.display = "block";
}

// lot edit checking previous serial
function check_org() {
 byId("msg_err").value = "";
 byId("msg").innerHTML = "";
  var new_sl =byId("new_serial").value;
  var string_data =byId("pre_all_or_serials").value;
  var per = string_data.split(",");

  if (per.includes(new_sl)) {
   byId("msg_err").value = "exist";
   byId("msg").innerHTML = "Already exists!";
   byId("msg").style.color = "red";
  } else {
   byId("msg_err").value = "No";
   byId("msg").innerHTML = "";
  }
}

// lot edit checking previous serial
function check_org_replace() {
 byId("msg_err1").value = "";
 byId("msg1").innerHTML = "";
  var new_sl =byId("replace_serial").value;
  var string_data =byId("pre_all_or_serials").value;
  var per = string_data.split(",");

  if (per.includes(new_sl)) {
   byId("msg_err1").value = "exist";
   byId("msg1").innerHTML = "Already exists!";
   byId("msg1").style.color = "red";
  } else {
   byId("msg_err1").value = "No";
   byId("msg1").innerHTML = "";
  }
}

// not implemented yet
function calculate_discount_price() {
  var dis =byId("discount123").value;
  var price =byId("selling_price").value;
 byId("price_discount").value = price - (dis / 100) * price;
}

// not implemented yet
function calculate_discount_percentage() {
  var dis =byId("price_discount").value;
  var price =byId("selling_price").value;
 byId("discount123").value = ((price - dis) / price) * 100;
}

// adds a new feature
function addnew() {
  var feat =byId("feat").value;
  if (document.getElementById("feats").value === "") {
   byId("feat").value = "";
   byId("feats").value = feat;
  } else {
   byId("feat").value = "";
   byId("feats").value =
   byId("feats").value + "," + feat;
  }
}

function set_var() {
 byId("check").value = "0";
}

function check_all_purchase_price() {
  // alert(document.getElementById("all_pp").value);
  var highest_pp = parseInt(document.getElementById("all_pp").value);
  var input = parseInt(document.getElementById("unit_price").value);

  if (input < highest_pp) {
   byId("msg").innerHTML =
      "Enter a number greater than " + highest_pp;
   byId("msg").style.color = "red";
  } else {
   byId("msg").innerHTML = "";
  }
}

// change the image on selecting a new image
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $("#image").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    readImageFile();
  }
}

$(document).ready(function() {
  var byId = function( id ) { return document.getElementById( id ); };
  // saving the pdf
  var doc = new jsPDF();
  var specialElementHandlers = {
    "#editor": function(element, renderer) {
      return true;
    }
  };
  // saving the pdf
  $("#cmd").click(function() {
    doc.fromHTML($("#content").html(), 15, 15, {
      width: 1000,
      elementHandlers: specialElementHandlers
    });
    doc.save("sample-file.pdf");
  });

  // on product model change this function get all the previous serial numbers
  // and adds to a hidden textfield
  // $("#model").change(function(e) {
  //   $.get(
  //     // here model is the product_id
  //     "/products/check_availablity/" +byId("model").value,
  //     {}, function(data) {
  //      byId("pre_serial").value = JSON.stringify(data.data);
  //     }
  //   );
  // });

  // // onload
  // notificationCheck();

  // window.setInterval(function() {

  //   notificationCheck();
  // }, 10000);

  // gets the notifications
  function notificationCheck() {
    $.get("/products/dashboard", {}, function(data_string) {
      if (data_string.count != 0) {
       byId("notification").textContent = JSON.stringify(
          data_string.count
        );
      }

     byId("lowLive").textContent = JSON.stringify(
        data_string.quantity
      );

      if (data_string.quantity === 0) {
       byId("set_href").href = "#";
      } else {
       byId("set_href").href = "/products/viewLowLive";
      }
    });
  }
  
  function checkValidityy() {
    var arr =byId("serial").value.split(",");
    var arr2 = ArrNoDupe(arr);
   byId("serial").value = arr2;
   byId("quantity").value = arr2.length;
  }

// on selection of a serial number it makes the color black and returns an unique array to the serial Text Box
// Seems like the selected serail number is disabled after first click
function set_disable(id) {
  var all = [];
  if (document.getElementById("serial").value != "") {
    var val =
     byId("serial").value +
      "," +
      parseInt(document.getElementById(id).innerHTML);
    var values = ArrNoDupe(val.split(","));

   byId("serial").value = values;
   byId("quantity").value = values.length;
   byId(id).style.color = "#041126";
  } else {
    all.push(parseInt(document.getElementById(id).innerHTML));
   byId("serial").value = all[0];
   byId("quantity").value = "1";
   byId(id).style.color = "#041126";
  }
}

function set_disableNoSerial(id) {
  var all = [];
  if (document.getElementById("serial").value != "") {
    var val =
     byId("serial").value +
      "," +
     byId(id).innerHTML.trim();
    var values = ArrNoDupe(val.split(","));

   byId("serial").value = values;
   byId("quantity").value = values.length;
   byId(id).style.color = "#041126";
  } else {
    all.push(document.getElementById(id).innerHTML.trim());
   byId("serial").value = all[0];
   byId("quantity").value = "1";
   byId(id).style.color = "#041126";
  }
}

// saving Inventory with serial numbers
$("form").submit(function(e) {
  // this is to prevent double submit
  if (document.getElementById("val").value === "0") {
    var check = parseInt(document.getElementById("check").value);
    var data_string = "";
    for (var i = 1; i <= check; i++) {
      if (document.getElementById("v" + i).value != "") {
        data_string +=byId("v" + i).value;
        if (check != i) {
          data_string += ",";
        }
      }
    }

    if (
     byId("check").value === "0" ||
     byId("check").value !=
     byId("quantity").value
    ) {
      createtextfields();
      e.preventDefault();
    } else {
      if (data_string === "") {
      } else {
        if (
          data_string.split(",").length !=
          ArrNoDupe(data_string.split(",")).length
        ) {
          alert("Serial numbers have to be unique!");
          e.preventDefault();
        } else {
          var string_data =byId("pre_serial").value;
          var per = string_data.split(",");

          // the first value as "123... here removing the "
          var fi = "";
          for (var j = 1; j < per[0].length; j++) {
            fi += per[0][j];
          }

          // the first value as 123"... here removing the "
          var la = "";
          for (var j = 0; j < per[per.length - 1].length - 1; j++) {
            la += per[per.length - 1][j];
          }
          per.push(la);
          per.push(fi);

          var new_arr = data_string.split(",");
          var exists = "";

          for (var i = 0; i < new_arr.length + 1; i++) {
            if (per.includes(new_arr[i])) {
              exists += new_arr[i] + " ";
            }
          }

          if (exists.length === 0) {
            $.post( "/products/SaveInventory",
              {
                serial: data_string,
                model:byId("model").value,
                purchase_price: parseInt(
                 byId("purchase_price").value
                ),
                quantity:byId("quantity").value
              },
              function(data_string) {
                alert(JSON.stringify(data_string));
              }
            );
            alert("successful");
           byId("val").value = "1";
          } else {
            alert(exists + "already exists!");
            e.preventDefault();
          }
        }
      }
    }
  }
});
});


// // creating new textField inside a div
// function create_text_fields(i) {
//   var label = document.createElement("label");
//   label.textContent = "Serial " + i;
//   var div = document.createElement("div");
//   var breakk = document.createElement("br");
//   div.id = "d" + i;

//   var input = document.createElement("input");
//   input.id = "v" + i;
//   input.name = "v" + i;
//   input.type = "Number";
//   input.className = "form-control";
//   input.required = true;
//   div.appendChild(label);
//   div.appendChild(input);
//   div.appendChild(breakk);
//  byId("space").appendChild(div);
// }


// function tableCreate() {
//   var tbl = document.createElement('table');
//   tbl.style.width = '100%';
//   // tbl.setAttribute('border', '1');
//   var tbdy = document.createElement('tbody');
//   for (var i = 0; i < 3; i++) {
//     var tr = document.createElement('tr');
//     for (var j = 0; j < 2; j++) {
//     //   if (i == 2 && j == 1) {
//     //     break
//     //   } else {
//         var td = document.createElement('td');
//         td.innerHTML="sdfjhsdkjfhkjh";
//         tr.appendChild(td)
//       // }
//     }
//     tbdy.appendChild(tr);
//   }
//   tbl.appendChild(tbdy);
//  byId("tab").appendChild(tbl)
// }
// tableCreate();

// checking during selecting serial number for ordered products
// function set_serial_last() {
//   var product_serial =byId("Serial");

//   if (document.getElementById("selected").value === "0") {
//   } else {
//     if (product_serial.value === "") {
//       product_serial.value =byId("selected").value;
//      byId("new_msg").innerHTML ="You have to select " +byId("quantity").value;
//     } else {
//       if (product_serial.value.split(",").length === parseInt(document.getElementById("quantity").value)
//       ) {
//        byId("new_msg").innerHTML = "";
//         alert("Quantity of the product is satisfied");
//       }
//       else {
//        byId("new_msg").innerHTML ="You have to select " +byId("quantity").value;
//         product_serial.value = product_serial.value +"," +byId("selected").value;
//       }
//     }
//     var srr = ArrNoDupe(product_serial.value.split(","));
//     product_serial.value = srr;
//   }
// }

// // creating text fields on quantity input
// function createtextfields() {
//   // alert(document.getElementById("check").value)
//   var check = parseInt(document.getElementById("check").value); // keep track of the previously created fields
//   var quantity = parseInt(document.getElementById("quantity").value); // given quantity

//   if (check === 0) {
//     for (var i = 1; i <= quantity; i++) {
//       create_text_fields(i);
//     }
//    byId("check").value = quantity;
//   } else if (check > 0 && check < quantity) {
//     for (var j = check + 1; j <= quantity; j++) {
//       create_text_fields(j);
//     }
//    byId("check").value = quantity;
//   } else if (check > 0 && check > quantity) {
//     for (var k = quantity + 1; k <= check; k++) {
//      byId("d" + k).remove();
//     }
//    byId("check").value = quantity;
//   } else if (check === quantity) {
//   } else {
//     alert("error");
//   }
// }
