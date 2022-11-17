const User = require("../models/user");
const Fund = require("../models/fund");
const Donation = require("../models/donation");
const catchAsync = require("../middleware/catchAsync")


exports.successPayment = catchAsync(async (req, res, next) => {
  
  console.log(req.body.id)

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.retrieve(
    req.body.id
  );

  console.log(session);

  const user = await User.findById(req.user._id);
  const fund = await Fund.findById(session.metadata.fund_id);
  if(!user){
    return res.status(404).json({
      error: "User not found",
      message: "Error"
    }); 
  }
  if(!fund){
    return res.status(404).json({
      error: "Fund not found",
      message: "Error"
    }); 
  }

  const donationLogData = {
    currency: session.currency,
    session_id : session.id,
    donator_id : user._id,
    donator_name : session.metadata.donator_name,
    donator_comment : session.metadata.donator_comment,
    fund_id : session.metadata.fund_id,
    amount : session.amount_total,
    status : session.status,
    time : session.created,
    payment_status : session.payment_status,
    payment_type : session.payment_type,
  }

  const donationLog = await Donation.create(donationLogData);
  // await donationLog.save();
  console.log(donationLog.id);
  fund.donations.push(donationLog.id);
  user.donations.push(donationLog.id);
  await fund.save();
  await user.save();
  return res.status(201).json({
    message: "Success",
    donationLog
  });
});

exports.cancelPayment = catchAsync(async (req, res, next) => {


  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.retrieve(
    req.params.id
  );

  console.log(session);
});


exports.payment = catchAsync(async (req, res, next)=>{
  try
  {
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
    const product = await stripe.products.create({name: req.body.title});
    
    const price = await stripe.prices.create({
      currency: 'usd',
      custom_unit_amount: {enabled: true},
      product: product.id,
    });
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      metadata: {
      "fund_id": req.body.fund_id,
      "donator_name": req.body.donator_name,
      "donator_comment": req.body.donator_comment,
      },
      submit_type: 'donate',
      mode: 'payment',
      cancel_url: "http://localhost:3000/cancel/{CHECKOUT_SESSION_ID}",
      success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",

    });
    console.log(session.url)

    return res.status(200).json({
      message: "Success",
      "redirect_link": session.url,
    }); 
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }

  // stripe.redirectToCheckout({ sessionId: session.url});
});
