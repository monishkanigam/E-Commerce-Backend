import expres from 'express';

import { createProducts,getAllProducts,getProductByID,updateProduct,deleteProduct } from '../controllers/productController.js';


const router=expres.Router();

router.post('/',createProducts);       //create
router.get('/',getAllProducts);        //read all
router.get('/:id',getProductByID);     //read one
router.put('/:id',updateProduct);      //update
router.delete('/:id',deleteProduct);   //delete

export default router;