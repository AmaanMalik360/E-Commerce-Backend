const Category = require('../modals/category');
const slugify = require('slugify');


function createCategories(categories, parentId = null)
{
    const categoryList = []
    let category;

    if(parentId == null)
    {
        category = categories.filter(cat => cat.parentId == undefined)
    }
    else
    {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for (let cate of category)
    {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }

    return categoryList

}

exports.addCategory = async (req, res) => {

    
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }

    if(req.file){

        categoryObj.categoryImage =  process.env.API + '/public/' + req.file.filename;;
        
    }

    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId
    }

    const cat = new Category(categoryObj)

    cat.save()
    .then(category => {
        res.status(201).json({ category });
    })
    .catch(error => {
        res.status(400).json({ error });
    });
    
    
}

exports.getCategories = async (req,res) => {
    try {
        const categories = await Category.find({})
        const categoryList = createCategories(categories)
        
        return res.status(201).json({categoryList})
        
    } catch (error) {
        
        return res.status(400).json({error})
    }

}
