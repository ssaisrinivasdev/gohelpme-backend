const User = require("../models/user");
const Fund = require("../models/fund");
const Donation = require("../models/donation");
const catchAsync = require("../middleware/catchAsync")
const categoryArray = ["Medical","Memorial","Emergency","NonProfit","FinancialEmergency","Animals","Environment",
"Business","Community","Competition","Creative","Event","Faith","Family","Sports","Travel",
"Volunteer","Wishes","Others","All"];

//Give count 
exports.adminDashboard = catchAsync(async (req, res, next) => {
    const category =  req.params.category;
    if(category){

        if(!categoryArray.includes(category)){
            return res.status(404).json({
                error: "Category not found",
                message: "Error",
            });
        }

        const funds =  category == "All" ? 
                    (   
                        await Fund.aggregate(
                            [
                                {
                                    $facet : {
                                        InProgress : [
                                            { $match : {
                                                $and:[
                                                    {"verification_status" : "InProgress" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ],
                                        Approved : [
                                            { $match : {
                                                $and:[
                                                    {"verification_status" : "Approved" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ],
                                        Rejected : [
                                            { $match : {
                                                $and:[
                                                    {"verification_status" : "Rejected" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ]
                                    }
                                }
                            ]
                        )    
                    )
                    :
                    (
                        await Fund.aggregate(
                            [
                                {
                                    $facet : {
                                        InProgress : [
                                            { $match : {
                                                $and:[
                                                    {"category" : category },
                                                    {"verification_status" : "InProgress" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ],
                                        Approved : [
                                            { $match : {
                                                $and:[
                                                    {"category" : category },
                                                    {"verification_status" : "Approved" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ],
                                        Rejected : [
                                            { $match : {
                                                $and:[
                                                    {"category" : category },
                                                    {"verification_status" : "Rejected" }
                                                ]
                                                } 
                                            },
                                            { $group : { _id : null, count : {$sum : 1} } },
                                        ]
                                    }
                                }
                            ]
                        )
                    )
                // console.log(JSON.stringify(funds));
        return res.status(200).json({
                    message: "Success",
                    "category": category,
                    funds,
                });
    }
    else{
        return res.status(404).json({
            error: "Category not entered",
            message: "Error",
        });
    }
    
})