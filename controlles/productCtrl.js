const Product=require('../models/productModel')

class APIfeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    filtering(){
        //filtre product 
        const queryObj={...this.queryString} //queryString=req.query
       // console.log({befor:queryObj}) //before delete page
        const excludeFields=['page','sort','limit']
        excludeFields.forEach(el=>delete(queryObj[el]))
       // console.log({after:queryObj}) //after delete page

        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=>'$'+match)
       // console.log({queryStr})
        this.query.find(JSON.parse(queryStr))

        //gte=greater than or equal
        //lte= lesser than or equal
        //lt=lesser than 
        //gt=greater than

        return this;
    }
    sorting(){
        if (this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ')
            this.query=this.query.sort(sortBy)
            //console.log(sortBy)
        }else{
            this.query=this.query.sort('-createdAt')
        }
        return this ;
    }
    paginating(){
        const page =this.queryString.page *1|| 1
        const limit=this.queryString.limit *1 || 9
        const skip=(page -1)*limit;
        this.query=this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl={
    getProducts:async(req,res)=>{
        try {
           // console.log(req.query)
            const features=new APIfeatures(Product.find(),req.query).filtering().sorting().paginating()
         const products= await features.query
         res.json({
            status:'success',
            result:products.length,
            products:products

         }) 
            
        } catch (err) {
                return res.status(500).json({msg:err.message})            
        }
    },
    createProducts:async(req,res)=>{
        try {
            
            const {product_id,title,price,description,content,images,category}=req.body
            if(!images) return res.status(400).json({msg:'No image upload'})

            const product = await Product.findOne({product_id})
            if(product)
                        return res.status(400).json({msg:'this product already exists'})
            const newProduct=new Product({
                product_id,title:title.toLowerCase(),price,description,content,images,category
            })
            await newProduct.save()
            res.json({msg:"Created a product"})
            
        } catch (err) {
            return res.status(500).json({msg:err.message})
                      
        }
    },
    deleteProducts:async(req,res)=>{
        try {
            await Product.findByIdAndDelete(req.params.id)
            res.json({msg:"Deleted a product "})
            
        } catch (err) {
                return res.status(500).json({msg:err.message})            
        }
    },
    updateProducts:async(req,res)=>{
        try {
            const {title,price,description,content,images,category}=req.body
            if(!images) return res.status(400).json({msg:'No image upload'})

            await Product.findOneAndUpdate({_id:req.params.id},
                {title:title.toLowerCase(),price,description,content,images,category
                    
                })
                res.json({msg:"update a product"})
        } catch (err) {
                return res.status(500).json({msg:err.message})            
        }
    },


}

module.exports=productCtrl