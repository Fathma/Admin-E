
// author: Fathma siddique
// lastmodified: 8/7/2019
// description: the file has all the category related routes 
const express = require('express')
const router = express.Router()

const category = require('../controllers/category.controller')

router.post('/addCategory', category.addCategory)
router.get('/categoryList', category.categoryList)
router.get('/newCategory', category.newCategory)
router.get('/updateCategory/:id', category.updateCategory)
router.post('/updateCategory', category.updateCategorySave)
router.post('/SaveDiscountCategory', category.SaveDiscountCategory)


router.get('/newSubCategory', category.newSubCategory)
router.post('/addSubCategory', category.addSubCategory)
router.get('/getSub/:cat', category.getSubById)
router.get('/subCategoryList', category.subCategoryList)
router.get('/updateSubCategory/:id', category.updateSubCategory)
router.post('/updateSubCategory', category.updateSubCategorySave)
router.post('/SaveDiscountSubCategory', category.SaveDiscountSubCategory)


router.get('/newBrand', category.newBrand)
router.post('/addBrand', category.addBrand)
router.get('/getBrands/:subcat', category.getBrand)
router.get('/brandList', category.brandList)
router.get('/updateBrand/:id', category.updateBrand)
router.post('/updateBrand', category.updateBrandSave)
router.post('/SaveDiscountBrand', category.SaveDiscountBrand)


router.get('/subcategory/changeStatus/:id/:value', category.changeStatus_Subcat)
router.get('/category/changeStatus/:id/:value', category.changeStatus_cat)
router.get('/brand/changeStatus/:id/:value', category.changeStatus_brand)
router.get('/category/edit', category.edit_cat)


module.exports = router
