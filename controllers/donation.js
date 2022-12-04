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

  if(!(req.user._id == session.metadata.donater_id)||(!user)){
    return res.status(404).json({
      error: "Invalid user for payment",
      message: "Error"
    }); 
  }
  else
  {
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
    const amount = (parseInt(session.amount_total))/100;
    const donationLogData = {
      currency: session.currency,
      session_id : session.id,
      donator_id : user._id,
      donator_name : session.metadata.donator_name,
      fund_id : session.metadata.fund_id,
      amount : amount,
      status : session.status,
      time : session.created,
      payment_status : session.payment_status,
      payment_type : session.payment_type,
    }

    const donationLog = await Donation.create(donationLogData);
    // await donationLog.save();
    console.log(donationLog.id);
    fund.currentValue += amount
    const per =  ( 100 * fund.currentValue ) / fund.goal 
    fund.percent = per >= 100 ? 100 : per;
    fund.totalDonationsCount += 1;
    if(fund.donations==null || fund.first_donated==null){
      fund.first_donated.push(donationLog.id)
    }
    (fund.recent_donated == null) ? (fund.recent_donated.push(donationLog.id)) : (fund.recent_donated[0] = donationLog.id)
    (fund.highest_donated == null) ? (fund.highest_donated.push(donationLog.id), fund.highest_donated_amount = amount) : (
      (fund.highest_donated_amount >= amount) ? (fund.highest_donated[0] = donationLog.id, fund.highest_donated_amount = amount) : ""
    )
    user.donations.push(donationLog.id);
    fund.donations.push(donationLog.id);
    user.created_funds.push(donationLog.fund_id);
    await fund.save();
    await user.save();
    return res.status(201).json({
      message: "Success",
      donationLog
    });
  }
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
      "donater_id": req.user._id,
      "fund_id": req.body.fund_id,
      "donator_name": req.body.donator_name == "null"  ? (req.user.name + req.user.lastname) : req.body.donator_name,
      },
      submit_type: 'donate',
      mode: 'payment',
      cancel_url: "http://gohelpme.online/cancel/{CHECKOUT_SESSION_ID}",
      success_url: "http://gohelpme.online/success/{CHECKOUT_SESSION_ID}",

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
