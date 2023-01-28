import Post from "../models/Post.js";



/***Create*****/

export const createPost = async (req,res) => {
    try {
        /***this is all frontend gonna send us ******/
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })

        await newPost.save();


        /***we need all the posts to return to fromtend****/
        const post = await Post.find();
/********201= you,ve cereated something***********/
       res.status(201).json(post);

    } catch (err) {
        res.status(409).json({message:err.message})
    }   
}



/***READ****/

export const getFeedPosts = async(req,res) => {
 
    try {
        const post = await Post.find();
      /***200=successful ********/
       res.status(200).json(post);
    } catch (err) {
     res.status(404).json({message:err.message})
    }

}



export const getUserPosts = async(req,res)=> {
    try {
      
        const {userId} = req.params;

        const post = await Post.find({userId});
      /***200=successful ********/
       res.status(200).json(post);
    } catch (err) {
     res.status(404).json({message:err.message})
    }
}

/*****UPDATE*****/


export const likePost = async(reqr,res) => {
    try {
    const {id} = req.params;

    const { userId } = req.body;
/**we're grabbing the post info */
    const post = await Post.findById(id);
/***we're grabbing whether user has liked it or not */
    const isLiked = post.likes.get(userId);



/***if it is liked then we gonna delete the user */
    if(isLiked) {
        post.likes.delete(userId);
    }else{
        /**if it is non existent then we gonna set it */
        post.likes.set(userId, true)
    }
     /***we have to update the frontend once you hit the like button****/
    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        {new: true}
    )

      /***200=successful ***so we can update the frontend*****/
       res.status(200).json(updatedPost);
    } catch (err) {
     res.status(404).json({message:err.message})
    }
}