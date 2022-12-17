const User = require("../models/user");
const Fund = require("../models/fund");
const Donation = require("../models/donation");
const Withdrawl = require("../models/withdrawl");
const Query = require("../models/queries");
const Blog = require("../models/blog");
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

        

        
       

       

        return res.status(200).json({
                    message: "Success",
                    "category": category,
                    funds,
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

exports.getFinanceWithDrawls= catchAsync(async (req, res, next) => {
    try{
        const withdrawlRequests = await Withdrawl.aggregate(
            [
                {
                    $facet : {
                        InProgress : [
                            { $match : {
                                $and:[
                                    { "createdAt": { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000 * 14) } } ,
                                    { "withdrawl_status" : "Requested" }
                                ]
                                } 
                            },
                            { $group : { _id : null, count : {$sum : 1}, amount: {$sum: "$withdrawl_amount"} } },
                        ]
                    }
                }
            ]
        );
        return res.status(200).json({
            message: "Success",
            withdrawlRequests
        });
    }
    catch(e){
        return res.status(400).json({
            error: "Error",
            message: e.toString(),
        });
    }    
});

exports.getFinanceDonations= catchAsync(async (req, res, next) => {
    try{
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
        return res.status(200).json({
            message: "Success",
            donationsReceived
        });
    }
    catch(e){
        return res.status(400).json({
            error: "Error",
            message: e.toString(),
        });
    }    
});


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

    const withdrawlRequests = await Withdrawl.aggregate(
        [
            {
                $facet : {
                    InProgress : [
                        { $match : {
                            $and:[
                                {"withdrawl_status" : "Requested" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Approved : [
                        { $match : {
                            $and:[
                                {"withdrawl_status" : "Approved" }
                            ]
                            } 
                        },
                        { $group : { _id : null, count : {$sum : 1} } },
                    ],
                    Rejected : [
                        { $match : {
                            $and:[
                                {"withdrawl_status" : "Rejected" }
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
    let toDate = new Date(req.body.toDate);
    let fromDate = new Date(req.body.fromDate);

    if(fromDate > toDate){
        return res.status(422).json({
            error: "Date range is not acceptable",
            message: ""
          }); 
    }
    else if(toDate == null && fromDate == null){
        toDate = new Date();
        fromDate = toDate.getDate()-1;
        toDate.setDate(toDate.getDate());
    }else if(toDate == null){
        toDate = new Date();
    }else if(fromDate == null){
        fromDate = toDate.getDate()-1;
    }else{
        toDate.setDate(toDate.getDate());
        fromDate.setDate(fromDate.getDate());
    }

    let ver_status = req.body.status == null ? "InProgress" : req.body.status;
    const category = req.body.category == null? "All": req.body.category;
    console.log(ver_status+" "+category)


    const funds = ( category == "All") ? (await Fund.aggregate(
                            [
                                {
                                    $facet : {
                                        Result : [
                                            { $match : {
                                                $and:[
                                                    { "createdAt"          : { $gte: fromDate, $lte: toDate }},
                                                    {"verification_status" : ver_status },
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
                                        ]
                                    }
                                }
                            ]
                        )  
                    ):
                    (
                        await Fund.aggregate(
                            [
                                {
                                    $facet : {
                                        Result : [
                                            { $match : {
                                                $and:[
                                                    { "createdAt"          : { $gte: fromDate, $lte: toDate }},
                                                    {"verification_status" : ver_status },
                                                    {"category"            : category},
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
                                        ]
                                    }
                                }
                            ]
                        )  
                    )
                          
                    

        return res.status(200).json({
            message: "Success",
            funds
        });
                    

})

//Add Get All Withdrawl Request for table in Dashboard
exports.getWithdrawlRequestsList = catchAsync(async (req, res, next) => {

    let toDate = new Date(req.body.toDate);
    let fromDate = new Date(req.body.fromDate);

    if(fromDate > toDate){
        return res.status(422).json({
            error: "Date range is not acceptable",
            message: ""
          }); 
    }
    else if(toDate == null && fromDate == null){
        toDate = new Date();
        fromDate = toDate.getDate()-1;
        toDate.setDate(toDate.getDate());
    }else if(toDate == null){
        toDate = new Date();
    }else if(fromDate == null){
        fromDate = toDate.getDate()-1;
    }else{
        toDate.setDate(toDate.getDate());
        fromDate.setDate(fromDate.getDate());
    }

    const wdReq =  await Withdrawl.aggregate(
        [
            {
                $facet : {
                    Result : [
                        { $match : {
                            $and:[
                                { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                { "withdrawl_status" : req.body.status }
                            ]
                            }
                        },
                            {$project:{
                                "_id":1,
                                "fund":1,
                                "createdAt":1,
                                "owner":1,
                                "withdrawl_status":1,
                                "withdrawl_amount":1,
                                "rejected_reason":1,
                            }
                        }
                    ]
                }
            }
        ]
    )   

        return res.status(200).json({
            message: "Success",
            wdReq
        });
});


//Add Get All Withdrawl Request for table in Dashboard
exports.getBlogsList = catchAsync(async (req, res, next) => {

    let toDate = new Date(req.body.toDate);
    let fromDate = new Date(req.body.fromDate);
    let status = null
    if(req.body.status){
        status = req.body.status
    }
    let keyword = null;
    if(req.body.keyword){
        keyword = new RegExp(req.body.keyword,"i");
    }

    if(fromDate > toDate){
        return res.status(422).json({
            error: "Date range is not acceptable",
            message: ""
          }); 
    }
    else if(toDate == null && fromDate == null){
        toDate = new Date();
        fromDate = toDate.getDate()-1;
        toDate.setDate(toDate.getDate());
    }else if(toDate == null){
        toDate = new Date();
    }else if(fromDate == null){
        fromDate = toDate.getDate()-1;
    }else{
        toDate.setDate(toDate.getDate());
        fromDate.setDate(fromDate.getDate());
    }

    const blogs = (keyword==null) ? (
        (status == null || status == "All")?(
        await Blog.aggregate(
            [
                {
                    $facet : {
                        Result : [
                            { $match : {
                                $and:[
                                    { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                ]
                                }
                            },
                            {$project:{
                                    "_id":1,
                                    "title":1,
                                    "createdAt":1,
                                    "long_description":1,
                                    "images":1,
                                    "status":1,
                                }
                            }
                        ]
                    }
                }
            ]
        ) 
        ):(
            await Blog.aggregate(
                [
                    {
                        $facet : {
                            Result : [
                                { $match : {
                                    $and:[
                                        { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                        {"status": status}
                                    ]
                                    }
                                },
                                    {$project:{
                                        "_id":1,
                                        "title":1,
                                        "createdAt":1,
                                        "long_description":1,
                                        "images":1,
                                        "status":1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            )
        )
    ):(
        (status == null || status == "All")?(
        await Blog.aggregate(
            [
                {
                    $facet : {
                        Result : [
                            { $match : {
                                $and:[
                                    { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                    {"title" : keyword },
                                ]
                                }
                            },
                                {$project:{
                                    "_id":1,
                                    "title":1,
                                    "createdAt":1,
                                    "long_description":1,
                                    "images":1,
                                    "status":1,
                                }
                            }
                        ]
                    }
                }
            ]
        ) 
        ):(
            await Blog.aggregate(
                [
                    {
                        $facet : {
                            Result : [
                                { $match : {
                                    $and:[
                                        { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                        { "title" : keyword },
                                        {"status": status}
                                    ]
                                    }
                                },
                                    {$project:{
                                        "_id":1,
                                        "title":1,
                                        "createdAt":1,
                                        "long_description":1,
                                        "images":1,
                                        "status":1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            )
        )
    )

    return res.status(200).json({
        message: "Success",
        blogs
    });
})


exports.getQueriesList = catchAsync(async (req, res, next) => {

    let toDate = new Date(req.body.toDate);
    let fromDate = new Date(req.body.fromDate);

    if(fromDate > toDate){
        return res.status(422).json({
            error: "Date range is not acceptable",
            message: ""
          }); 
    }
    else if(toDate == null && fromDate == null){
        toDate = new Date();
        fromDate = toDate.getDate()-1;
        toDate.setDate(toDate.getDate());
    }else if(toDate == null){
        toDate = new Date();
    }else if(fromDate == null){
        fromDate = toDate.getDate()-1;
    }else{
        toDate.setDate(toDate.getDate());
        fromDate.setDate(fromDate.getDate());
    }

    const queryReq =  await Query.aggregate(
        [
            {
                $facet : {
                    Result : [
                        { $match : {
                            $and:[
                                { "createdAt"        : { $gte: fromDate, $lte: toDate }},
                                { "ticket_status" : req.body.ticket_status }
                            ]
                            }
                        },
                            {$project:{
                                "_id":1,
                                "full_name":1,
                                "email":1,
                                "message":1,
                                "ticket_status":1,
                                "createdAt":1,
                            }
                        }
                    ]
                }
            }
        ]
    )   

    return res.status(200).json({
        message: "Success",
        queryReq
    });
});