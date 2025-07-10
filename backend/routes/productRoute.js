import express  from "express";

import { listProducts,addProduct,removeProduct,singleProduct } from "../controllers/productController.js";

import { Router } from "express";

const productRouter=express.Router();

productRouter.post("/list",listProducts);
productRouter.post("/add",addProduct);
productRouter.post("/remove",removeProduct);
productRouter.post("/single",singleProduct);

export default productRouter;