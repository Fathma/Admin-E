// author : fathma Siddique
// lastmodified : 31/7/2019
// description : all the supplier related controllers/funtions are written in here 
const Supplier = require('../models/supplier.model')
var randomstring = require('randomstring')

// get supplier registration page
exports.supplierRegistrationPage = (req, res) => res.render('supplier/supplierReg', { date: new Date() })

// save supplier info
exports.supplierSave = (req, res) => {
  var obj = req.body.obj;
  var id = randomstring.generate(5)
  var name = obj.cname.split('')

  id += name[0]
  id += name[1]
  id += name[2]

  obj.supplier_id = id
  new Supplier(obj).save().then( supplier => res.send({}) )
}


// get all registered suppliers
exports.supplierList = async(req, res) => {
  var supplier = await Supplier.find().sort({ "created": -1 })
  var count = 1;
  supplier.map( doc=> doc.count = count++ )
  res.render('supplier/supplierList', { supplier }) 
}

// get all registered suppliers
exports.supplierEditPage = (req, res) => {
  Supplier.findOne({ _id: req.params.id }, (err, docs) => {
    if ( docs.address != null && docs.contactPerson != null ) {
     
      res.render('supplier/supplierEdit', {
        supplier: docs,
        total_address: docs.address.length,
        total_contacts: docs.contactPerson.length
      })
    }
  })
}


// Edit Supplier info
exports.supplierEdit = (req, res) => {
  Supplier.updateOne({ _id: req.params.id },{ $set: req.body.obj },{ upsert: true },
  (err, docs) => {
      if (err) res.send(err)
      else res.send({})
  })
}


// Edit Supplier info
exports.supplierDelete = (req, res) => {
  Supplier.deleteOne({ _id: req.params.id }, ( err, docs ) =>  res.redirect('/supplier/SupplierList'))
}


// getting contanct persons of a specific supplier
exports.getContactPerson = async (req, res)=> res.send( await Supplier.findOne({ _id: req.params.sup }))
