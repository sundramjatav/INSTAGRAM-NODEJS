const {userModel} = require("./models/user")

async function UserSearch(){
    // const allUsers = await userModel.find({},{_id:0,name:1,picture:1}) // 0 is the not include fields, 1 is the include fields
    const allUsers = await userModel.find({})
    console.log(allUsers)
}
UserSearch()