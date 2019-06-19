$(document).ready(function() {
  var byId = function( id ) { return document.getElementById( id ); };
  // save new category
  $(function() {
    $("#myForm1").on("click", function(e) {
      e.preventDefault();
      var cat = byId("cat").value;
      $.post("/category/addCategory", { name: cat }, function(data) {
        location.reload(true);
      });
    });

    $("#save_sub").on("click", function(e) {
      e.preventDefault();
      var cate = byId("cate").value;
      var subCat = byId("subCat").value;
      $.post( "/category/addSubCategory", { cate: cate, subCat: subCat }, function(data) {
          location.reload(true);
        }
      );
    });

    $("#save_brand").on("click", function(e) {
      e.preventDefault();
      var brand = byId("brand").value;
      $.post("/category/addBrand", { brand: brand }, function(data) {
        location.reload(true);
      });
    });

    $("#edit_cat").on("click", function(e) {
      // e.preventDefault();
      
      var name = byId("name").value;
      var _id = byId("id").value;
      $.post( "/category/category/edit", { name, _id }, function(data) {
          location.reload(true);
        }
      );
    });
  });

  // setting brand dropdown values on the besis of selected subcategory
  // $("#subCategg").change(function() {
  //   if (byId("subCategg").value != null) {
  //     var subcat_id = byId("subCategg").value.split(",");
  //     $.get("/category/getBrands/" + subcat_id[0], {}, function(data) {
  //       configureDropDownL2(byId("brandg"), data);
  //     });
  //   }
  // });
  
  // setting brand dropdown values on the besis of selected subcategory
  // $("#subNn").change(function() {
  //   if (byId("subNn").value != null) {
  //     var subcat_id = byId("subNn").value;
  //     $.get("/category/getBrands/" + subcat_id, {}, function(data) {
  //       configureDropDownL2(byId("brandNs"), data);
  //     });
  //   }
  // });

  // creating subcategory and brand on the basis of selected category
  $("#categg").change(function() {
    if (byId("categg").value != null) {
      var cat_id = byId("categg").value.split(",");
      $.get("/category/getSub/" + cat_id[0], {}, function(data) {
        configureDropDownL(byId("subCategg"), data);
        // configureDropDownL2(byId("brandg"), data);
      });
    }
  });

  // creating subcategory and brand on the basis of selected category
  $("#supplier").change(function() {
    if (byId("supplier").value != "0") {
      var cat_id = byId("supplier").value;
      $.get("/supplier/getContactPerson/" + cat_id, {}, function(data) {
        
        configureDropDownL3(byId("contt"), data);
        configureDropDownL4(byId("address"), data);
      });
    }
  });
  
  // creates dropdown
  function configureDropDownL3(ddl2, data) {
    var options;
    options += '<option value="0">Select One</>';
    for (i = 0; i < data.contactPerson.length; i++) {
      options +=
        "<option onClick='getAllSerials()'value=\"" +
        data.contactPerson[i].contactName +","+ data.contactPerson[i].mobile+
        '">' +
        data.contactPerson[i].contactName
        "</>";
    }
    ddl2.innerHTML = options;
  }

  function configureDropDownL4(ddl2, data) {
    var options;
    options += '<option value="0">Select One</option>';
    for (i = 0; i < data.address.length; i++) {
      options +=
        "<option onClick='getAllSerials()'value=\"" +
        data.address[i].address +'">' +
        data.address[i].address
        "</>";
    }
    ddl2.innerHTML = options;
  }


  // creating subcategory and brand on the basis of selected category
  $("#cattN").change(function() {
    if (byId("cattN").value != null) {
      var cat_id = byId("cattN").value.split(",");
      $.get("/category/getSub/" + cat_id[0], {}, function(data) {
        configureDropDownL(byId("subNn"), data);
        // $.get("/category/getBrands2/" + cat_id, {}, function(data2) {
        //   configureDropDownL2(byId("brandNs"), data2);
        // });
      });
    }
  });

  // creates dropdown
  function configureDropDownL(ddl2, data) {
    var options="<option value='0'>Select One</option>";
    for (i = 0; i < data[0].subCategories.length; i++) {
      options += "<option value=\"" + data[0].subCategories[i]._id +","+ data[0].subCategories[i].name + '">'+data[0].subCategories[i].name+"</option>";
    }
    ddl2.innerHTML = options;
  }

  // creates dropdown
  function configureDropDownL2(ddl2, data) {
    var options="";
    for (i = 0; i < data[0].brands.length; i++) {
      options += "<option value=\"" +
        data[0].brands[i].name +
        '">' ;
    }
    ddl2.innerHTML = options;
  }
});
