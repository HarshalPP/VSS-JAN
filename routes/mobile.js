const express=require('express')
const router=express.Router()
const mobileController=require('../controller/Mobilelogin')


router.post('/MobileReg',mobileController.create)
router.post('/MobileLogin',mobileController.login)
router.get('/checkDeatils',mobileController.get)

module.exports=router;