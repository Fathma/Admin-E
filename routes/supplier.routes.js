const express = require('express');
const router = express.Router();
const supplier_controller = require('../controllers/supplier.controller');

router.get("/SupplierRegistrationPage", supplier_controller.supplierRegistrationPage);
router.post("/SupplierSave", supplier_controller.supplierSave);
router.get("/SupplierList", supplier_controller.supplierList);
router.get("/Edit/:id", supplier_controller.supplierEditPage);
router.post("/Edit/:id", supplier_controller.supplierEdit);
router.get("/delete/:id", supplier_controller.supplierDelete);
router.get("/getContactPerson/:sup", supplier_controller.getContactPerson);

module.exports = router;
