// author: Fathma siddique
// last updated:25/08/2019
// description: the file has all the category related controllers/ functions
const Brand = require('../models/brand.model')
const subCategory = require('../models/subCategory.model')
const Cat = require('../models/category.model')
const Discount = require('../models/discount.model')
const value= require('../../config/values')


// simply fires a page
exports.newCategory=(req, res)=> res.render('parents/newCategory')
exports.newBrand=(req, res)=> res.render('parents/newBrand')
exports.newSubCategory=(req, res)=> res.render('parents/newSubCategory')


exports.updateCategory =async (req, res)=>{
  let category = await Cat.findOne({ _id: req.params.id })
  let discount = await Discount.find({type:"category"})
  req.flash( 'success_msg', value.update.succ)
  res.render('parents/updateCategory', { category, discount })
}


exports.updateSubCategory =async (req, res)=>{
  let subcategory = await subCategory.findOne({ _id: req.params.id })
  let discount = await Discount.find({type:"subcategory"})
  let cat = await Cat.find()
  req.flash( 'success_msg', value.update.succ)
  res.render('parents/updateSubCategory', { subcategory, discount, cat })
}


exports.updateBrand =async (req, res)=>{
  let brand = await Brand.findOne({ _id: req.params.id })
  let discount = await Discount.find({type:"brand"})
  res.render('parents/updateBrand', { brand, discount })
}


exports.updateBrandSave = async (req, res)=>{
  await Brand.update({ _id: req.body.id }, { $set: { name: req.body.name} })
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateBrand/'+req.body.id)
}


exports.updateSubCategorySave = async (req, res)=>{
  await subCategory.update({ _id: req.body.id }, { $set: req.body})
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateSubCategory/'+ req.body.id)
}


exports.updateCategorySave = async (req, res)=>{
  await Cat.update({ _id: req.body.id }, { $set: { name: req.body.name} })
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateCategory/'+req.body.id)
}


exports.SaveDiscountCategory = async (req, res)=>{
  await Cat.update({ _id: req.body.id }, { $set: { discount: req.body.discount} })
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateCategory/'+req.body.id)
}


exports.SaveDiscountBrand = async (req, res)=>{
  await Brand.update({ _id: req.body.id }, { $set: { discount: req.body.discount} })
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateBrand/'+req.body.id)
}


exports.SaveDiscountSubCategory = async (req, res)=>{
  await subCategory.update({ _id: req.body.id }, { $set: { discount: req.body.discount} })
  req.flash( 'success_msg', value.update.succ)
  res.redirect('/category/updateSubCategory/'+req.body.id)
}


// saving category
exports.addCategory =async (req, res) => {
  //  check whether already exists or not
  let category= await Cat.findOne({ name: req.body.name })
  if(!category){
    req.body.subCategories= []
    req.body.brands= []
    new Cat(req.body).save().then( category => {
      req.flash( 'success_msg', 'Category added successfully!')
      res.redirect('/category/updateCategory/'+category._id)
    })
  }else{
    req.flash('error_msg', 'Already exists!')
    res.redirect('/category/newCategory')
  }
}


// Saving Sub Category
exports.addSubCategory =async (req, res) => {
  //  check whether already exists or not
  let sub =await subCategory.findOne({name:req.body.subCat})
  if(!sub){
    let subcategory = {
      name: req.body.subCat,
      category: req.body.cate,
      brands: []
    }
    // saves subcategory
    new subCategory( subcategory ).save().then( subcategory => {
      // updates category collection by adding the new sub category to the category field
      Cat.findOneAndUpdate(
        { _id: req.body.cate },
        { $addToSet: { subCategories: subcategory._id } },
        { upsert: true },
        ( err, cat )=> {
          if ( err ) res.send( err ) 
          req.flash( 'success_msg', 'Category added successfully!')
          res.redirect('/category/updateSubCategory/'+cat._id)
        }
      )
    })
  }else{
    req.flash('error_msg', 'Already exists!')
    res.redirect('/category/newSubCategory')
  }
}


// Saving Brand
exports.addBrand =async ( req, res ) => {
  //  check whether already exists or not
  let br = await Brand.findOne({ name: req.body.brand })
  if(!br){
    let brand = { name: req.body.brand }
    new Brand( brand ).save().then( brand =>{
      req.flash( 'success_msg', 'Category added successfully!')
      res.redirect('/category/updateBrand/'+brand._id)
    })
  }else{
    req.flash('error_msg', 'Already exists!')
    res.redirect('/category/newBrand')
  }
}


// getting sub categories on the basis of category
exports.getSubById = (req, res) => {
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


// edit category
exports.edit_cat =async(req, res)=>{
  await Cat.find({ _id }, { $set: { name: req.body.name }}, { upsert: true})
  res.send({})
}


// shows category list
exports.categoryList = async( req, res )=> {
  var category = await Cat.find()
  var count = 1;
  category.map( doc=> doc.count = count++ )
  res.render('parents/categoryList', { category })
}


// shows subcategory list
exports.subCategoryList = async( req, res )=>{
  var subcategory =  await subCategory.find().populate('category')
  var count = 1;
  subcategory.map( doc=> doc.count = count++ )
  res.render('parents/subCategoryList', { subcategory })
} 


// shows brand List 
exports.brandList = async( req, res )=>{
  var brand = await Brand.find()
  var count = 1;
  brand.map( doc=> doc.count = count++ )
  res.render('parents/brandList', { brand })
} 


