const User = require("../models/user");
const Fund = require("../models/fund");
const Donation = require("../models/donation");
const catchAsync = require("../middleware/catchAsync")
const categoryArray = ["Medical","Memorial","Emergency","NonProfit","FinancialEmergency","Animals","Environment",
"Business","Community","Competition","Creative","Event","Faith","Family","Sports","Travel",
"Volunteer","Wishes","Others","All"];

//Give count 
exports.fundsVerificationDetails = catchAsync(async (req, res, next) => {
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

        

        
        const donationsReceived = await Donation.aggregate(
            [
                {
                    $facet : {
                        InProgress : [
                            { $match : {
                                $and:[
                                    { "createdAt": { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000*14) } } ,
                                ]
                                } 
                            },
                            { $group : { _id : null, count : {$sum : 1}, amount: {$sum: "$amount"} } },
                        ]
                    }
                }
            ]
        );

        // const withdrawlRequests = await Fund.aggregate(
        //     [
        //         {
        //             $facet : {
        //                 InProgress : [
        //                     { $match : {
        //                         $and:[
        //                             { "createdAt": { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 14) } } ,
        //                             { "withdrawl_request_status" : "Requested" }
        //                         ]
        //                         } 
        //                     },
        //                     { $group : { _id : null, count : {$sum : 1}, amount: {$sum: "$amount"} } },
        //                 ]
        //             }
        //         }
        //     ]
        // );

        return res.status(200).json({
                    message: "Success",
                    "category": category,
                    funds,
                    donationsReceived,
                    // withdrawlRequests
                });
    }
    else{
        return res.status(404).json({
            error: "Category not entered",
            message: "Error",
        });
    }
    
})


exports.usersPaymentVerificationDetails = catchAsync(async (req, res, next) => {

    const usersVerificaitonStatus= await User.aggregate(
        [
            {
                $facet : {
                    InProgress : [
                        { $match : {
                            $and:[
                                {"payment_request" : "Requested" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Approved : [
                        { $match : {
                            $and:[
                                {"payment_request" : "Approved" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Rejected : [
                        { $match : {
                            $and:[
                                {"payment_request" : "Rejected" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ]
                }
            }
        ]
    );
    
    return res.status(200).json({
        message: "Success",
        usersVerificaitonStatus,
    });
})

exports.withdrawlVerificationDetails = catchAsync(async (req, res, next) => {

    const withdrawlRequests = await Fund.aggregate(
        [
            {
                $facet : {
                    InProgress : [
                        { $match : {
                            $and:[
                                {"withdrawl_request_status" : "Requested" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Approved : [
                        { $match : {
                            $and:[
                                {"withdrawl_request_status" : "Approved" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Rejected : [
                        { $match : {
                            $and:[
                                {"withdrawl_request_status" : "Rejected" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ]
                }
            }
        ]
    );

    
    return res.status(200).json({
        message: "Success",
        withdrawlRequests,
    });
})


exports.fundApprovalsListDetails = catchAsync(async (req, res, next) => {

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
                                                {$project:{
                                                    "_id":1,
                                                    "title":1,
                                                    "createdAt":1,
                                                    "goal":1,
                                                    "category":1,
                                                    "fund_type":1,
                                                    "verification_status":1,
                                                }
                                            }
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

})