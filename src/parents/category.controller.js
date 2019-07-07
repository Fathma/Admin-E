// author: Fathma siddique
// description: the file has all the category related controllers/ functions
const Brand = require('./brand.model')
const subCategory = require('./subCategory.model')
const Cat = require('./category.model')

// saving category
exports.addCategory = (req, res) => {
  req.body.subCategories= []
  req.body.brands= []
  new Cat(req.body).save().then( category => res.send({}))
}

// Saving Sub Category
exports.addSubCategory = (req, res) => {
  let subcategory = {
    name: req.body.subCat,
    category: req.body.cate,
    brands: []
  }
  new subCategory( subcategory ).save().then( subcategory => {
    if ( req.body.cate != 'null') {
      Cat.findOneAndUpdate(
        { _id: req.body.cate },
        { $addToSet: { subCategories: subcategory._id } },
        { upsert: true },
        ( err, docs )=> {
          if ( err ) res.send( err ) 
          res.send({})
        }
      )
    } else {
      res.send({})
    }
  })
}

// Saving Brand
exports.addBrand = ( req, res ) => {
  var brand = { name: req.body.brand }
  new Brand( brand ).save().then( brand => res.send({}))
}

// getting sub categories on the basis of category
exports.getSub2 = ( req, res ) => {
  Cat.find({ name: req.params.cat })
    .populate('subCategories')
    .populate('brands')
    .exec(( err, docs )=> res.json( docs ))
}

// getting sub categories on the basis of category
exports.getSub = (req, res) => {
  Cat.find({ _id: req.params.cat })
    .populate('subCategories')
    .populate('brands')
    .exec(( err, docs )=> res.json( docs ))
}

// returns subcategories of and given subcategories 
exports.getBrand = ( req, res )=> {
  subCategory.find({ name: req.params.subcat })
  .populate('brands')
  .exec(( err, docs )=> res.json( docs ))
}

// returns subcategories of and given subcategories 
exports.getBrand2 = ( req, res )=> {
  Cat.find({ name: req.params.cat })
  .populate('brands')
  .exec((err, docs)=> res.json(docs))
}

// changes categorys' status
exports.changeStatus_Subcat = async(req, res) => {
  await changeStatus(subCategory, req.params.id, req.params.value)
  res.redirect('/category/subCategoryList')
};

// changes subcategorys' status
exports.changeStatus_cat = async(req, res) => {
  await changeStatus(Cat, req.params.id, req.params.value)
  res.redirect('/category/categoryList')
};

// changes brands' status
exports.changeStatus_brand = async(req, res) => {

  await changeStatus(Brand, req.params.id, req.params.value)
  res.redirect('/category/brandList')
};

var changeStatus = ( model, _id, bool )=> model.update({ _id:_id }, { $set: { enabled: bool} }, { upsert: true })

// eidt category
exports.edit_cat =async(req, res)=>{
  await Cat.find({ _id }, { $set: { name: req.body.name }}, { upsert: true})
  res.send({})
}

exports.categoryList = async( req, res )=> {
  var category = await Cat.find()
  var count = 1;
  category.map( doc=> doc.count = count++ )
  res.render('parents/categoryList', { category })
}

exports.subCategoryList = async( req, res )=>{
  var subcategory =  await subCategory.find().populate('category')
  console.log(subcategory.length)
  var count = 1;
  subcategory.map( doc=> doc.count = count++ )
  res.render('parents/subCategoryList', { subcategory })
} 


exports.brandList = async( req, res )=>{
  var brand = await Brand.find()
  var count = 1;
  brand.map( doc=> doc.count = count++ )
  res.render('parents/brandList', { brand })
} 


