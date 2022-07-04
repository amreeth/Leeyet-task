import express from 'express'
import {addProduct,updateProduct,deleteProduct} from '../Controllers/productController.js'
const router=express.Router()



router.route('/add').post(addProduct)
router.route('/:id').put(updateProduct).delete(deleteProduct)




export default router