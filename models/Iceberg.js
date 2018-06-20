const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IcedropCommentSchema = new Schema({
  commentTitle: String,
  commentContent: String,
  commentCreationTime: { type: Date, default: Date.now }
})

const IcedropSchema = new Schema({
  icedropUrl: String,
  //authorId: Schema.Types.ObjectId,
  //authorName: String,
  icedropTitle: String,
  icedropLink: String,
  creationTime: { type: Date, default: Date.now },
  icedropPublicStatus: Boolean,
  comments: [IcedropCommentSchema]
})

const IcebergSchema = new Schema({
  title: String,
  icebergImage: String,
  icedropsNumber: Number,        // mise à jour en fonction de icedrops
  //username: String,
  userId: String,
  icedrops: [IcedropSchema]
})

module.exports = mongoose.model("Iceberg", IcebergSchema)
