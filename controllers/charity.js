const catchAsync = require('../middleware/catchAsync');
const Charity = require("../models/charity");


exports.createNewCharity = catchAsync(async (req, res, next) => {

    try
    {
        if(req.files){
          req.body.image = req.files[0].location
          const charity = await Charity.create(req.body);
          return res.status(200).json({
              message: "Success", 
              charity
          });
        }
        return res.status(404).json({
          error: "Error",
          message:"Image is not uploaded",
        }); 
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
});

exports.getAllCharities = catchAsync(async (req, res, next) => {

    try
    {

      var page = req.query.page <= 0 ? 1 : req.query.page;
      var rangeStart = ((page - 1) * 10)+1;
      const keyword = new RegExp(req.query.keyword,"i");

      const charities = await Charity.aggregate([
        { 
          $facet : {
            metaInfo : [
              { $match : {
                          $and: [
                            {$or:[{ "name" : keyword }, { "keywords" : keyword }]}
                        ]}
              },
              { $group : { _id : null, count : {$sum : 1} } }
            ],
            actualData : [
              { $match : {
                          $and: [
                            {$or:[{ "name" : keyword }, { "keywords" : keyword }]}
                        ]}},
              { $skip  : rangeStart-1 },
              { $limit : 10 },
              {$sort: {_id: -1}}
            ]
          }
        }
      ]);
      const totalresultsfound = charities[0]?.metaInfo[0]?.count == null ? 0 : charities[0]?.metaInfo[0]?.count;
        
      return res.status(200).json({
        message: "Success",
        results: totalresultsfound,
        current: parseInt(page),
        pages: totalresultsfound==null ? 0 : (Math.ceil(totalresultsfound/6)),
        "charities": charities[0]?.actualData == null ? '[]' : charities[0]?.actualData
      });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
});

exports.deleteCharity = catchAsync(async (req, res, next) => {

    try
    {
      await Charity.findOneAndRemove({_id: req.params.id})
      return res.status(200).json({
          message: "Success"
      });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
});

exports.getCharity = catchAsync(async (req, res, next) => {

    try
    {
      const charityFound = await Charity.findById(req.params.id)
      if (charityFound) {
        return res.status(200).json({
            message: "Success", 
            charityFound
        });
      }
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
});

exports.modifyCharity = catchAsync(async (req, res, next) => {

  try
  {
    const charityFound = await Charity.findById(req.params.id)
    if (charityFound) {
      const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      });
      return res.status(200).json({
          message: "Success", 
          charity
      });
    }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});