$(document).ready(function() {
  var byId = function( id ) { return document.getElementById( id ); };
  $(()=>{
    $("#supplierReg").on("click", (e)=>{
      var cname = byId('cname').value
      var cemail= byId('cemail').value
      var country= byId('country').value
      var productType= byId('productType').value
      if(cname === '' || cemail === '' || country === '' || productType === '' ) alert("Every field with * must be filled up!")
      else{
      // getting all addresses in an array
      var address_array = [];
      var total_address = parseInt(byId("num_address").value);
      for(var i = 0; i < total_address; i++){
        var add = byId("address"+i).value;
        var contact = byId("contact"+i).value;
        var zip = byId("zip"+i).value;
        var addresss = { address:add, contact, zip }

        if(add === '' && contact === '' && zip === ''){}
        else{
          address_array.push(addresss)
        }
      }

      // getting all addresses in an array
      var contacts_array = [];
      var total_contacts = parseInt(byId("total_contacts").value);

      for(var i = 0; i < total_contacts; i++){
        var contactName = byId("contactName"+i).value;
        var companyPosition = byId("companyPosition"+i).value;
        var email = byId("email"+i).value;
        var mobile = byId("mobile"+i).value;
        var telephone = byId("telephone"+i).value;
        var extention = byId("extention"+i).value;

        var obj = { contactName, companyPosition, email, mobile, telephone, extention }
        contacts_array.push(obj)
      }

      var obj = { cname, cemail, country,
        address: address_array,
        industry: byId('industry').value,
        registration_no: byId('registration_no').value,
        productType,
        contactPerson: contacts_array,
        additionalInfo: byId('additionalInfo').value,
      }

      $.post( "/supplier/SupplierSave", { obj }, (data)=>{
          alert("Successful!")
          location.reload(true);
        }
      );
    }
    
    });

    $("#edit_supplier").on("click", (e)=>{
      // getting all addresses in an array
      var address_array = [];
      var total_address = parseInt(byId("num_address1").value);

      for(var i = 0; i < total_address; i++){
        var add = byId("address"+i).value;
        var contact = byId("contact"+i).value;
        var zip = byId("zip"+i).value;
        var addresss = { address: add, contact, zip }

        if(add === '' && contact === '' && zip === ''){}
        else{
          address_array.push(addresss)
        }
      }

      // getting all addresses in an array
      var contacts_array = [];
      var total_contacts = parseInt(byId("total_contacts1").value);

      for(var i = 0; i < total_contacts; i++){
        var contactName = byId("contactName"+i).value;
        var companyPosition = byId("companyPosition"+i).value;
        var email = byId("email"+i).value;
        var mobile = byId("mobile"+i).value;
        var telephone = byId("telephone"+i).value;
        var extention = byId("extention"+i).value;
        
        if(contactName === "" && companyPosition === "" && email === "" && mobile === "" && telephone === "" && extention === ""){}
        else{
          var obj = { contactName, companyPosition, email, mobile, telephone, extention }
          contacts_array.push(obj)
        }
      }

      var obj = {
        cname: byId('cname').value,
        cemail: byId('cemail').value,
        country: byId('country').value,
        address: address_array,
        industry: byId('industry').value,
        registration_no: byId('registration_no').value,
        productType: byId('productType').value,
        contactPerson: contacts_array,
        additionalInfo: byId('additionalInfo').value
      }
     
      var id = byId('id').value
      $.post( "/supplier/Edit/"+id, { obj: obj }, (data)=> {
          alert("Successful!")
          location.reload(true);
        }
      );
    });
  });
});

var byId = function( id ) { return document.getElementById( id ); };

byId("num_address").value = 1;
byId("num_contacts").value = 1;

function addAddressEdit(){ 
  var nums = parseInt(byId("num_address1").value) + 1;
  var hr = document.createElement("hr")
  var br = document.createElement("br")
  
  var label1 = create_label("Company Address:")
  var input1 = create_textArea("address",nums, "text")
  var label2 = create_label("Phone Number:")
  var input2 = create_input("contact",nums , "text")
  
  
  var out = make_Section( input1, label1, input2, label2, nums);
  byId("addresses").appendChild(hr)
  byId("addresses").appendChild(out)

  out = create_div("row", "out", nums)
  outc1 = create_div("col-md-6","outc1", nums)
  outc1r1 = create_div("row", "outc1r1", nums)
  outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  outc2 = create_div("col-md-6","outc2", nums)
  outc2r1 = create_div("row", "outc2r1", nums)
  outc2r1c1 = create_div("col-md-5","outc2r1c1", nums)
  outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  label = create_label("Zip/Postal code:")
  input = create_input("zip",nums, "text")
  outc1r1c1.appendChild(label)
  outc1r1c2.appendChild(input)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  byId("addresses").appendChild(br)
  byId("addresses").appendChild(out)
  
  byId("num_address1").value = parseInt(byId("num_address1").value) + 1
}

function addAddress(){
  var nums = parseInt(byId("num_address").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")

  // First row
  var label1 = create_label("Company Address:")
  var input1 = create_textArea("address",nums, "text")
  var label2 = create_label("Phone Number:")
  var input2 = create_input("contact",nums , "text")
  var out = make_Section( input1, label1, input2, label2, nums)
  byId("addresses").appendChild(hr)
  byId("addresses").appendChild(out)

  out = create_div("row", "out", nums)
  outc1 = create_div("col-md-6","outc1", nums)
  outc1r1 = create_div("row", "outc1r1", nums)
  outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  outc2 = create_div("col-md-6","outc2", nums)
  outc2r1 = create_div("row", "outc2r1", nums)
  outc2r1c1 = create_div("col-md-5 col5","outc2r1c1", nums)
  outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  label = create_label("Zip:")
  input = create_input("zip",nums, "text")
  outc1r1c1.appendChild(label)
  outc1r1c2.appendChild(input)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  byId("addresses").appendChild(br)
  byId("addresses").appendChild(out)
  byId("num_address").value = parseInt(byId("num_address").value) + 1
  
}

function addContacts1(){
  var nums = parseInt(byId("total_contacts").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")
  // first row 
  var label1 = create_label("Contact Name:")
  var input1 = create_input("contactName",nums, "text")
  var label2 = create_label("Company Designation:")
  var input2 = create_input("companyPosition",nums , "text")
 
  var out = make_Section( input1, label1, input2, label2, nums)
  byId("contacts").appendChild(hr)
  byId("contacts").appendChild(out)
 
  // second row
  label1 = create_label("Email:")
  input1 = create_input("email",nums , "email")
  label2 = create_label("Mobile:")
  input2 = create_input("mobile",nums , "tel")

  out = make_Section( input1, label1, input2, label2, nums);
  byId("contacts").appendChild(br)
  byId("contacts").appendChild(out)

  // 3rd row
  label1 = create_label("Telephone:")
  input1 = create_input("telephone",nums , "tel")
  input2 = create_input("extention",nums , "text")
  
  out = make_tel_ext(input1, label1, input2, nums)
  byId("contacts").appendChild(br)
  byId("contacts").appendChild(out)
  
  byId("total_contacts").value = parseInt(byId("total_contacts").value) + 1
  byId("contacts").appendChild(br)
}

function addContacts1Edit(){
  var nums = parseInt(byId("total_contacts1").value) + 1;
  var br = document.createElement("br")
  var hr = document.createElement("hr")
  
  // first row
  var label1 = create_label("Contact Name:")
  var input1 = create_input("contactName",nums, "text")
  var label2 = create_label("Company Position:")
  var input2 = create_input("companyPosition",nums , "text")

  var out = make_Section(input1, label1, input2, label2, nums);
  var contacts = byId("contacts");
  contacts.appendChild(hr)
  contacts.appendChild(out)
  contacts.appendChild(br)

  // second row
  label1 = create_label("Email:")
  input1 = create_input("email",nums , "email")
  label2 = create_label("Mobile:")
  input2 = create_input("mobile",nums , "tel")

  out = make_Section(input1, label1, input2, label2, nums);
  byId("contacts").appendChild(out)
 
  // 3rd row
  label1 = create_label("Telephone:")
  input1 = create_input("telephone",nums , "tel")
  input2 = create_input("extention",nums , "text")
 
  out = make_tel_ext(input1, label1, input2, nums)
  var contacts= byId("contacts");
  var total_contacts1=byId("total_contacts1")
  contacts.appendChild(br)
  contacts.appendChild(out)
  
  total_contacts1.value = parseInt(total_contacts1.value) + 1
  contacts.appendChild(br)
}

function make_tel_ext(input1, label1, input2, nums){
  var out = create_div("row", "out", nums)
  var outc1 = create_div("col-md-6","outc1", nums)
  var outc1r1 = create_div("row", "outc1r1", nums)

  var outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  var outc1r1c2 = create_div("col-md-6 md1","outc1r1c2", nums)

  var outc1r1c2c1 = create_div("col-md-3 md2","outc1r1c2c1", nums)
  var outc1r1c2c2 = create_div("col-md-1 ","outc1r1c2c2", nums)
  var outc1r1c2c3 = create_div("col-md-2 ","outc1r1c2c3", nums)
  
  outc1r1c2.appendChild(outc1r1c2c1)
  outc1r1c2.appendChild(outc1r1c2c2)
  outc1r1c2.appendChild(outc1r1c2c3)

  out.appendChild(outc1)
  outc1.appendChild(outc1r1)
  outc1r1c2c1.appendChild(input1)
  outc1r1c1.appendChild(label1)
  var p = document.createElement('p');
  p.innerHTML = "Ext:";
  outc1r1c2c2.appendChild(p)
  outc1r1c2c3.appendChild(input2)
 
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)
  return out;
}

function make_Section(input1, label1, input2, label2, nums){
  var p1 = document.createElement('p')
  var out = create_div("row", "out", nums)

  var outc1 = create_div("col-md-6","outc1", nums)
  var outc1r1 = create_div("row", "outc1r1", nums)
  var outc1r1c1 = create_div("col-md-5 col5","outc1r1c1", nums)
  var outc1r1c2 = create_div("col-md-6","outc1r1c2", nums)
  
  var outc2 = create_div("col-md-6","outc2", nums)
  var outc2r1 = create_div("row", "outc2r1", nums)
  var outc2r1c1 = create_div("col-md-5 col5","outc2r1c1", nums)
  var outc2r1c2 = create_div("col-md-6","outc2r1c2", nums)
  out.appendChild(outc1)
  outc1.appendChild(outc1r1)

  outc1r1c1.appendChild(label1)
  outc1r1c2.appendChild(input1)
  outc1r1.appendChild(outc1r1c1)
  outc1r1.appendChild(outc1r1c2)

  out.appendChild(outc2)
  outc2.appendChild(outc2r1)

  outc2r1c1.appendChild(label2)
  outc2r1c2.appendChild(input2)
  outc2r1.appendChild(outc2r1c1)
  outc2r1c1.appendChild(p1)
  outc2r1.appendChild(outc2r1c2)
  return out;
} 

function create_input(prefix,nums, typee){
  var input = document.createElement("input");
  input.id = prefix + (nums-1);
  input.name = prefix + (nums-1);
  input.type = typee;
  input.className = "form-control inp";
  return input;
}

function create_textArea(prefix,nums, typee){
  var textarea = document.createElement("textarea");
  textarea.id = prefix + (nums-1);
  textarea.name = prefix + (nums-1);
  textarea.type = typee;
  textarea.className = "form-control inp";
  return textarea;
}

function create_label(txt){
  var label = document.createElement("label");
  label.innerHTML = txt;
  label.className = "lbl";
  return label;
}

function create_div(classname,prefix, nums){
  var div = document.createElement("div");
  div.id = prefix + (nums-1);
  div.name = prefix + (nums-1);
  div.className = classname;
  return div;
}


