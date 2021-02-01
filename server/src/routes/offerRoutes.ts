import { Request, Response, Router } from 'express';
import { authentication } from '../utils/authentication';
import Offer, { IOfferModel } from '../models/offerModel';
import User from '../models/userModel';
import mongooseUniqueValidator from 'mongoose-unique-validator';
const mongoose = require('mongoose');


const router: Router = Router();

//get all offers (public info)
router.get('/', async function (req: Request, res: Response, next) {
  
  const offers = await Offer.find({}).catch(next)

  res.json(offers.map((offers: { toJSON: () => any; }) => offers.toJSON())); //change this to some to publicJSON or so

});


//get offer public details by id



//post new offer
router.post('/', authentication.required , async function (req: Request, res: Response, next) {

  const user = await User.findById(req.body.authUser.id).catch(next)
  if (!user) return res.sendStatus(401)

  const newOffer = new Offer({...req.body, owner: req.body.authUser.id})

  const savedOffer = await newOffer.save().catch(next)

  if (savedOffer) return res.json(savedOffer.toJSON())

});



// delete Offer
router.delete('/:id', authentication.required, async function (req: Request, res: Response, next) {

  if (!req.body.authUser) return res.sendStatus(401)

  const offer = await Offer.findById(req.params.id).catch(next)
  if(!offer) return res.sendStatus(404)

  if (req.body.authUser.id.toString() === offer.owner.toString()) {
    await Offer.findByIdAndDelete(req.params.id).catch(next)
    return res.sendStatus(204)
  }

  return res.sendStatus(403);

});

//get logged in users own offers
router.get('/my-offers', authentication.required,  async function (req: Request, res: Response, next) {

  console.log('received my-offers request')

  if (!req.body.authUser) return res.sendStatus(401)

  console.log(req.body.authUser.id)

  const myOffers = await Offer.find({owner: req.body.authUser.id}).catch(next)

  res.json(myOffers); //change this to some to publicJSON or so

});

router.get('/:id', async function (req: Request, res: Response, next) {

  const offer = await Offer.findById(req.params.id).catch(next)

  res.json(offer.toJSON())

});

// // Favorite an Offer
// router.post('/:Offer/favorite', authentication.required, function (req: Request, res: Response, next) {
//   const OfferId = req.Offer._id;

//   User.findById(req.payload.id).then(function (user) {
//     if (!user) {
//       return res.sendStatus(401);
//     }

//     return user.favorite(OfferId).then(function () {
//       return req.Offer.updateFavoriteCount().then(function (Offer) {
//         return res.json({Offer: Offer.toJSONFor(user)});
//       });
//     });
//   }).catch(next);
// });

// // Unfavorite an Offer
// router.delete('/:Offer/favorite', authentication.required, function (req: Request, res: Response, next) {
//   const OfferId = req.Offer._id;

//   User.findById(req.payload.id).then(function (user) {
//     if (!user) {
//       return res.sendStatus(401);
//     }

//     return user.unfavorite(OfferId).then(function () {
//       return req.Offer.updateFavoriteCount().then(function (Offer) {
//         return res.json({Offer: Offer.toJSONFor(user)});
//       });
//     });
//   }).catch(next);
// });

// // return an Offer's comments
// router.get('/:Offer/comments', authentication.optional, function (req: Request, res: Response, next) {
//   Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
//     return req.Offer.populate({
//       path    : 'comments',
//       populate: {
//         path: 'author'
//       },
//       options : {
//         sort: {
//           createdAt: 'desc'
//         }
//       }
//     }).execPopulate().then(function (Offer) {
//       return res.json({
//         comments: req.Offer.comments.map(function (comment) {
//           return comment.toJSONFor(user);
//         })
//       });
//     });
//   }).catch(next);
// });

// // create a new comment
// router.post('/:Offer/comments', authentication.required, function (req: Request, res: Response, next) {
//   User.findById(req.payload.id)
//     // @ts-ignore
//     .then(function (user) {
//       if (!user) {
//         return res.sendStatus(401);
//       }

//       const comment     = new Comment(req.body.comment);
//       comment.Offer = req.Offer;
//       comment.author  = user;

//       return comment.save().then(function () {
//         req.Offer.comments.push(comment);

//         return req.Offer.save().then(function (Offer) {
//           res.json({comment: comment.toJSONFor(user)});
//         });
//       });
//     }).catch(next);
// });

// router.delete('/:Offer/comments/:comment', authentication.required, function (req: Request, res: Response, next) {
//   if (req.comment.author.toString() === req.payload.id.toString()) {
//     // @ts-ignore
//     req.Offer.comments.remove(req.comment._id);
//     req.Offer.save()
//       .then(() => Comment.find({_id: req.comment._id}).remove().exec())
//       .then(function () {
//         res.sendStatus(204);
//       });
//   } else {
//     res.sendStatus(403);
//   }
// });


export const OfferRoutes: Router = router;
