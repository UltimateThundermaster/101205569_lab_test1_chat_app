const mongoose = require('mongoose')

exports.connectDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to mongodb')
  } catch (error) {
    console.log(error.message)
  }
}