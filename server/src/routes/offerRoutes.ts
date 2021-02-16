import { Request, Response, Router } from 'express';
import { authentication } from '../utils/authentication';
import Offer, { IOfferModel } from '../models/offerModel';
import User from '../models/userModel';


const router: Router = Router();

//get all offers (public info)
router.get('/', async function (req: Request, res: Response, next) {
  
  const offers = await Offer.find({}).catch(next)

  res.json(offers.map((offers: { toListJSON: () => any; }) => offers.toListJSON())); //change this to some to publicJSON or so

});



//post new offer
router.post('/', authentication.required , async function (req: Request, res: Response, next) {

  const user = await User.findById(req.body.authUser.id).catch(next)

  if (!user) return res.sendStatus(401)

  const newOffer = new Offer({...req.body, owner: req.body.authUser.id})

  const savedOffer = await newOffer.save().catch(next)

  if (savedOffer) return res.json(savedOffer.toListJSON())

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

  if (!req.body.authUser) return res.sendStatus(401)

  const myOffers = await Offer.find({ owner: req.body.authUser.id }).catch(next)

  res.json(myOffers.map((o: { toDisplayJSON: () => IOfferModel; }) => o.toDisplayJSON()));

});


//get detailed public info
router.get('/:id', async function (req: Request, res: Response, next) {

  const offer = await Offer.findById(req.params.id).populate('owner', { username: 1 }).catch(next)

  res.json(offer.toDisplayJSON())

});

//update offer by id
router.put('/:id', authentication.required, async function (req: Request, res: Response, next) {

  if (!req.body.authUser) return res.sendStatus(401)

  const offer = await Offer.findById(req.params.id).catch(next)
  if(!offer) return res.sendStatus(404)

  if (req.body.authUser.id.toString() === offer.owner.toString()) {

    const {authUser, ...offerData} = req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(req.body.id, offerData, { new: true }).catch(next)
    res.json(updatedOffer.toJSON())
  }

})



export const OfferRoutes: Router = router;
