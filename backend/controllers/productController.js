import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';


const addProduct=async (req, res) => {
     try{
      const { name, description, price, category ,subCategory,bestSellers} = req.body;
        const { sizes } = req.body;
      const image1=req.files.image1&&req.files.image1[0];
      const image2=req.files.image2&&req.files.image2[0];
      const image3=req.files.image3&&req.files.image3[0];
      const image4=req.files.image4&&req.files.image4[0];

      const image=[image1,image2,image3,image4].filter((img)=>img!==undefined)
      let parsedSizes;
      try {
         parsedSizes = JSON.parse(sizes);
      } catch (error) {
         parsedSizes=sizes.split(',').map(s => s.trim());
      }

      const imagesUrl=await Promise.all(
         image.map( async (img)=>{
            let result=await cloudinary.uploader.upload(img.path,{resource_type:"image"});
            return result.secure_url;
         }

         )
      )

      const productData={
         name,
         description,
         price:Number(price),
         image:imagesUrl,
         category,
         subCategory,
         sizes:parsedSizes,
         bestSeller:bestSellers==="true"?true:false,
         date:Date.now()
      }

      console.log(productData);

      const product=new productModel(productData);
      await product.save();

      console.log(name, description,price, category ,subCategory,sizes,bestSellers);
    //  console.log(imagesUrl);
      res.json({success:true,message:"product added"});
     }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
     }
}

const listProducts=async (req,res)=>{
    try{
        const products=await productModel.find({});
        res.json({success:true, data:products});
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const removeProduct=async (req,res)=>{
    try{
       const products=await productModel.findByIdAndDelete(req.body.id);
       res.json({success:true, message:"Product removed successfully"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const singleProduct=async (req,res)=>{
   try{
      
      const {productId}=req.body;
      const product=await productModel.findById(productId);
      res.json({success:true,product});
   } catch(error){
       console.log(error);
       res.json({success:false, message:error.message});
   }
}

export {addProduct, listProducts, removeProduct, singleProduct};