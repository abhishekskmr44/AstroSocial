import User from "../models/User.js";


/***READ***/

export const getUser = async(req,res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message})
    }   
}




export const getUserFriends = async(req,res) => {
  try {
    const {id} = req.params;   

    const user = await User.findById(id)
 
    /***We're gonna make multiple API calls****/
    const friends = await Promise.all(
    user.friends.map((id)=>User.findById(id))
   );
 
   const formattedFriends = friends.map(
     ({_id,firstName, lastName, occupation, location, picturePath}) => {
         return {
             _id,firstName, lastName, occupation, location, picturePath
         }
     }
     );
 
     res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({message: err.message})
  }
}


/****UPDATE****/

export const addRemoveFriend = async(req,res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

/****if friend ID is included in main user friend ID, if so then remove it ***/
        if(user.friends.includes(friendId)){
            /***If friend ID is already part then we have to remove it***/
            user.friends = user.friends.filter((id)=>id !== friendId)
            /***we have to remove user from the friend list*****/
            friend.friends = friend.friends.filter((id)=>id !== id)

        }else{
            /***if they are not included we gonna add them */
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
           );
         
           const formattedFriends = friends.map(
             ({_id,firstName, lastName, occupation, location, picturePath}) => {
                 return {
                     _id,firstName, lastName, occupation, location, picturePath
                 }
             }
        );

     res.status(200).json(formattedFriends);
   
    } catch (err) {
        res.status(404).json({message: err.message}) 
    }
}