import asyncHandler from "express-async-handler";
import Product from "../Models/productModel.js";
import cloudinary from 'cloudinary'

let shippingCharge = 100;


//@desc product add
//@route POST /api/product/add

const addProduct = asyncHandler(async (req, res) => {
  try {
    let { name, description, price, discount } = req.body;

    let MRP = price - (price * discount) / 100;
    //after discount total price
    MRP = MRP + (MRP * 18) / 100;
    //after including tax
    MRP = MRP + shippingCharge;


    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "product",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }


    
  

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      MRP,
    });

    if (product) {
      res.status(200).json({
        success: true,
        message: "product added successfully",
        product,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "product not added",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});



//@desc product update
//@route PUT /api/product/:id

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    let { name, description, price, discount } = req.body;

    if (product && (name || description || price || discount)) {
      product.name = name || product.name;
      product.description = description || product.description;

      if (price && discount) {
        product.price = price;
        product.discount = discount;

        let MRP = price - (price * discount) / 100;
        MRP = MRP + (MRP * 18) / 100;
        MRP = MRP + shippingCharge;
        product.MRP = MRP;
      } else if (price) {
        product.price = price;
        let MRP = price - (price * product.discount) / 100;
        MRP = MRP + (MRP * 18) / 100;
        MRP = MRP + shippingCharge;
        product.MRP = MRP;
      } else if (discount) {
        product.discount = discount;
        let MRP = product.price - (product.price * discount) / 100;
        MRP = MRP + (MRP * 18) / 100;
        MRP = MRP + shippingCharge;
        product.MRP = MRP;
      }

      await product.save();
    } else {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//@desc product delete
//@route DELETE /api/product/:id

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.status(200).json({
        success: true,
        message: "product deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export { addProduct, updateProduct, deleteProduct };
