const express = require('express')
const router = express.Router()

const category = require('../controllers/category.controller')

router.post('/addCategory', category.addCategory)
router.post('/addSubCategory', category.addSubCategory)
router.post('/addBrand', category.addBrand)
router.get('/getSub/:cat', category.getSub)
router.get('/getSub2/:cat', category.getSub2)
router.get('/getBrands/:subcat', category.getBrand)
router.get('/getBrands2/:cat', category.getBrand2)
router.get('/categoryList', category.categoryList)
router.get('/subCategoryList', category.subCategoryList)
router.get('/brandList', category.brandList)
router.get('/subcategory/changeStatus/:id/:value', category.changeStatus_Subcat)
router.get('/category/changeStatus/:id/:value', category.changeStatus_cat)
router.get('/brand/changeStatus/:id/:value', category.changeStatus_brand)
router.get('/category/edit', category.edit_cat)


module.exports = router
