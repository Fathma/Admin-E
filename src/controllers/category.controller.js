// author: Fathma siddique
// description: the file has all the category related controllers/ functions
const Brand = require('../models/brand.model')
const subCategory = require('../models/subCategory.model')
const Cat = require('../models/category.model')



exports.newCategory=(req, res)=> res.render('parents/newCategory')
exports.newBrand=(req, res)=> res.render('parents/newBrand')
exports.newSubCategory=(req, res)=> res.render('parents/newSubCategory')

// saving category
exports.addCategory = (req, res) => {
 
  Cat.findOne({ name: req.body.name },(err, category)=>{
    if(!category){
      req.body.subCategories= []
      req.body.brands= []
      new Cat(req.body).save().then( category => {
        req.flash( 'success_msg', 'Category added successfully!')
        res.redirect('/category/newCategory')
      })
    }else{
      req.flash('error_msg', 'Already exists!')
      res.redirect('/category/newCategory')
    }
  })
}

// Saving Sub Category
exports.addSubCategory = (req, res) => {
  subCategory.findOne({name:req.body.subCat}, (err, sub)=>{
    if(!sub){
      let subcategory = {
        name: req.body.subCat,
        category: req.body.cate,
        brands: []
      }
      new subCategory( subcategory ).save().then( subcategory => {
       
        Cat.findOneAndUpdate(
          { _id: req.body.cate },
          { $addToSet: { subCategories: subcategory._id } },
          { upsert: true },
          ( err, docs )=> {
            if ( err ) res.send( err ) 
            req.flash( 'success_msg', 'Category added successfully!')
            res.redirect('/category/newSubCategory')
          }
        )
      })
    }else{
      req.flash('error_msg', 'Already exists!')
      res.redirect('/category/newSubCategory')
    }
  })
  
}

// Saving Brand
exports.addBrand = ( req, res ) => {
  Brand.findOne({ name: req.body.brand }, (err, br)=>{
    if(!br){
      let brand = { name: req.body.brand }
      new Brand( brand ).save().then( brand =>{
        req.flash( 'success_msg', 'Category added successfully!')
        res.redirect('/category/newBrand')
      })
    }else{
      req.flash('error_msg', 'Already exists!')
      res.redirect('/category/newBrand')
    }
  })
  
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


