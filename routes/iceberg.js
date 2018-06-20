const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const Iceberg = require('../models/Iceberg')

/* ///////////////////////////   GET ALL ICEBERG      /////////////////////////// */
router.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (!getToken(req.headers)) {
    return res.status(401).send({success: false, msg: 'Unauthorized.'})
  }

  Iceberg.find({userId: req.user.id}, function (error, icebergs) {
    if (error) {
      console.error(error)
    }

    res.json(icebergs)
  })
})

// Fetch single post
router.get('/:id', passport.authenticate('jwt', {session: false}), function (req, res) {

  if (!getToken(req.headers)) {
    return res.status(401).send({success: false, msg: 'Unauthorized.'})
  }
  console.log(req.params.id)
  Iceberg.findById(req.params.id, function (err, iceberg) {
    if (err) {
      console.log(err)
      return res.status(404).send({success: false, msg: 'Not Found'})
    }

    res.json(iceberg)
  })
})

/* ///////////////////////////    ADD NEW ICEBERG      /////////////////////////// */
router.post('/', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (!getToken(req.headers)) {
    return res.status(401).send({success: false, msg: 'Unauthorized.'})
  }

  let newIceberg = new Iceberg({
    title: req.body.title,
    icebergImage: req.body.icebergImage,
    icedropsNumber: 0, // fonction de icedrops
    userId: req.user.id,
    icedrops: []
  })

  newIceberg.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Iceberg saved successfully!'
    })
  })
})

// Update a post
router.put('/:id', (req, res) => {

  Iceberg.findById(req.body._id, function (error, iceberg) {
    if (error) {
      console.error(error)
    }

    iceberg.title = req.body.title
    iceberg.icebergImage = req.body.icebergImage
    iceberg.userId = req.body.userId

    if (req.body.icedrops) {
      iceberg.icedrops = req.body.icedrops
    }
    iceberg.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
router.delete('/:id', (req, res) => {
  Iceberg.remove({
    _id: req.params.id
  }, function (err, iceberg) {
    if (err) {
      res.send(err)
    }
    res.send({
      success: true
    })
  })
})

module.exports = router
