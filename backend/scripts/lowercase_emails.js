const connectToDB = require('../src/config/database')
const mongoose = require('mongoose')
const userModel = require('../src/models/user.model')

async function run() {
  try{
    await connectToDB()
    const users = await userModel.find({})
    console.log(`Found ${users.length} users. Processing...`)
    let updated = 0
    for(const u of users){
      const lowered = (u.email || '').trim().toLowerCase()
      if(u.email !== lowered){
        await userModel.updateOne({_id: u._id}, {email: lowered})
        updated++
      }
    }
    console.log(`Updated ${updated} user(s) to lowercase emails.`)
    process.exit(0)
  }catch(err){
    console.error('Migration error:', err)
    process.exit(1)
  }
}

run()
