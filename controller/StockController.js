var Production_incharge = require("../models/Stock_M");
///-------all Data Will BE obtain When ORder is Create by Admin/sales /Production Management

// exports.create = async (req, res) => {
//   const qwe = req.body;
//   const feet = 304.8; // 1 feet=304.8mm

//   try {
//     const stock_data = await Production_incharge.find({
//       $and: [
//         {
//           product: qwe.product,
//           company: qwe.company,
//           grade: qwe.grade,
//           topcolor: qwe.topcolor,
//           coating: qwe.coating,
//           temper: qwe.temper,
//           guardfilm: qwe.guardfilm,
//           thickness: qwe.thickness,
//           width: qwe.width,
//           length: qwe.length,
//           pcs: qwe.pcs,
//         },
//       ],
//     });

//     if (stock_data.length === 0) {
//       // Stock doesn't exist, create a new entry
//       const user = new Production_incharge({
//         product: qwe.product,
//         company: qwe.company,
//         grade: qwe.grade,
//         topcolor: qwe.topcolor,
//         coating: qwe.coating,
//         temper: qwe.temper,
//         guardfilm: qwe.guardfilm,
//         thickness: qwe.thickness,
//         width: qwe.width,
//         length: qwe.length,
//         pcs: qwe.pcs,
//         weight: qwe.weight,
//         approx_weight: qwe.approx_weight,
//         batch_number: generateBatchNumber(),
//         ready_production: qwe.ready_production,
//         vehical_no: qwe.vehical_no,
//         vendor: qwe.vendor,
//         production_incharge_name: qwe.production_incharge_name,
//         assign_date: qwe.assign_date,
//         thickness_selected: qwe.thickness_selected,
//         width_selected: qwe.width_selected,
//         color_selected: qwe.color_selected,
//         company_name_selected: qwe.company_name_selected,
//         completion_date: qwe.completion_date,
//         batch_assign: qwe.batch_assign,
//         note: qwe.note,
//         density: qwe.density,
//         approx_length_in_batch: qwe.weight / (qwe.thickness * qwe.width * qwe.density),
//         approx_weight_per_mm: qwe.density * (qwe.thickness * qwe.width),
//         pcs_cut: qwe.pcs_cut,
//         length_per_pcs_cut: qwe.length_per_pcs_cut,
//         approx_weight_cut:
//           qwe.density * qwe.thickness * qwe.width * qwe.pcs_cut * qwe.length_per_pcs_cut,
//         total_length_cut: qwe.pcs_cut * qwe.length_per_pcs_cut,
//       });

//       const Inventor = await user.save();
//       res.status(201).json({ status: 200, msg: "Successfully created", Inventor });
//     } else {
//       console.log("Stock Already Existed");
//       const existingStock = stock_data[0];

//       // Generate a new batch_number for the existing stock
//       const existingStockBatchNumber = generateBatchNumber();

//       // Update the existing stock's batch_numbers array with the new batch_number
//       existingStock.batch_number=existingStockBatchNumber;

//       // Update the weight of the existing stock
//       const total_weight = existingStock.weight + qwe.weight;

//       // Save the updated existing stock
//       existingStock.weight = total_weight;
//       const updatedExistingStock = await existingStock.save();

//       // Create a new stock entry with its own batch_number
//       const newUser = new Production_incharge({
//         // Same properties as the existing stock except for batch_number
//         product: existingStock.product,
//         company: existingStock.company,
//         grade: existingStock.grade,
//         topcolor: existingStock.topcolor,
//         coating: existingStock.coating,
//         temper: existingStock.temper,
//         guardfilm: existingStock.guardfilm,
//         thickness: existingStock.thickness,
//         width: existingStock.width,
//         length: existingStock.length,
//         pcs: existingStock.pcs,
//         weight: qwe.weight,
//         approx_weight: existingStock.approx_weight,
//         batch_number: generateBatchNumber(),
//         ready_production: existingStock.ready_production,
//         vehical_no: existingStock.vehical_no,
//         vendor: existingStock.vendor,
//         production_incharge_name: existingStock.production_incharge_name,
//         assign_date: existingStock.assign_date,
//         thickness_selected: existingStock.thickness_selected,
//         width_selected: existingStock.width_selected,
//         color_selected: existingStock.color_selected,
//         company_name_selected: existingStock.company_name_selected,
//         completion_date: existingStock.completion_date,
//         batch_assign: existingStock.batch_assign,
//         note: existingStock.note,
//         density: existingStock.density,
//         approx_length_in_batch: existingStock.approx_length_in_batch,
//         approx_weight_per_mm: existingStock.approx_weight_per_mm,
//         pcs_cut: existingStock.pcs_cut,
//         length_per_pcs_cut: existingStock.length_per_pcs_cut,
//         approx_weight_cut: existingStock.approx_weight_cut,
//         total_length_cut: existingStock.total_length_cut,
//       });

//       const newStock = await newUser.save();

//       res.status(201).json({
//         status: 200,
//         msg: "Stock updated with new batch_number and new stock created",
//         existingStock: updatedExistingStock,
//         newStock: newStock,
//       });
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Function to generate a unique batch_number for each entry
// function generateBatchNumber() {

//     // You can use a timestamp or any other unique identifier
//     const uniqueIdentifier = Date.now(); // Using timestamp as a unique identifier

//     return `batch-${uniqueIdentifier}`;

// }


exports.create = async (req, res) => {
  const qwe = req.body;

  try {
    const existingStock = await Production_incharge.findOne({
      $and: [
        {
          product: qwe.product,
          company: qwe.company,
          grade: qwe.grade,
          topcolor: qwe.topcolor,
          coating: qwe.coating,
          temper: qwe.temper,
          guardfilm: qwe.guardfilm,
          thickness: qwe.thickness,
          width: qwe.width,
          length: qwe.length,
          pcs: qwe.pcs,
        },
      ],
    });

    if (!existingStock) {
      // Stock doesn't exist, create a new entry for the first batch
      const newBatchNumber = generateBatchNumber();

      const newStock = new Production_incharge({
        product: qwe.product,
        company: qwe.company,
        grade: qwe.grade,
        topcolor: qwe.topcolor,
        coating: qwe.coating,
        temper: qwe.temper,
        guardfilm: qwe.guardfilm,
        thickness: qwe.thickness,
        width: qwe.width,
        length: qwe.length,
        pcs: qwe.pcs,
        weight: qwe.weight,
        approx_weight: qwe.approx_weight,
        batch_number: [newBatchNumber], // Only include the new batch number
        ready_production: qwe.ready_production,
    vehical_no: qwe.vehical_no,
    vendor: qwe.vendor,
    production_incharge_name: qwe.production_incharge_name,
    assign_date: qwe.assign_date,
    thickness_selected: qwe.thickness_selected,
    width_selected: qwe.width_selected,
    color_selected: qwe.color_selected,
    company_name_selected: qwe.company_name_selected,
    completion_date: qwe.completion_date,
    batch_assign: qwe.batch_assign,
    note: qwe.note,
    density: qwe.density,
    approx_length_in_batch:
      qwe.weight / (qwe.thickness * qwe.width * qwe.density), //7.84e-6
    approx_weight_per_mm: qwe.density * (qwe.thickness * qwe.width),
    pcs_cut: qwe.pcs_cut,
    length_per_pcs_cut: qwe.length_per_pcs_cut,
    approx_weight_cut:
      qwe.density *
      qwe.thickness *
      qwe.width *
      qwe.pcs_cut *
      qwe.length_per_pcs_cut,
    total_length_cut: qwe.pcs_cut * qwe.length_per_pcs_cut
        // ... other properties ...
      });

      const savedStock = await newStock.save();

      res.status(201).json({
        status: 200,
        msg: "Successfully created",
        newStock: {
          stockData: savedStock,
          batches: [{ batchNumber: newBatchNumber, originalWeight: qwe.weight, stockData: savedStock }],
        },
      });
    } else {
      // Stock already exists
      console.log("Stock Already Existed");
      const newBatchNumber = generateBatchNumber();

      existingStock.batch_number.push(newBatchNumber); // Add the new batch number to existing batch numbers

      // Create a new instance for the new batch
      const newStockBatch = new Production_incharge({
        product: qwe.product,
        company: qwe.company,
        grade: qwe.grade,
        topcolor: qwe.topcolor,
        coating: qwe.coating,
        temper: qwe.temper,
        guardfilm: qwe.guardfilm,
        thickness: qwe.thickness,
        width: qwe.width,
        length: qwe.length,
        pcs: qwe.pcs,
        weight: qwe.weight,
        approx_weight: qwe.approx_weight,
        batch_number: [newBatchNumber], // Only include the new batch number
        // ... other properties ...
      });

      const savedStockBatch = await newStockBatch.save();

      // Update the weight of the existing stock
      existingStock.weight += qwe.weight;

      await existingStock.save();

      res.status(201).json({
        status: 200,
        msg: "Stock updated with new batch_number",
        existingStock: {
          stockData: existingStock,
          batches: existingStock.batch_number.map((batch) => ({
            batchNumber: batch,
            originalWeight: qwe.weight,
            stockData: { ...existingStock.toObject(), weight: qwe.weight },
          })),
        },
        newStock: {
          stockData: savedStockBatch,
          batches: [{ batchNumber: newBatchNumber, originalWeight: qwe.weight, stockData: savedStockBatch }],
        },
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




function generateBatchNumber() {
  const uniqueIdentifier = Date.now();
  return `batch-${uniqueIdentifier}`;
}








// router.get("/allStocks", async (req, res) => {
//   try {
//     const allStocks = await Production_incharge.find({
//       batch_number: { $exists: true, $ne: [] },
//     });

//     res.status(200).json({
//       status: 200,
//       msg: "Successfully retrieved all stocks",
//       allStocks: allStocks,
//     });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// function generateBatchNumber() {
//   const uniqueIdentifier = Date.now();
//   return `batch-${uniqueIdentifier}`;
// }








//---------------------------------------------------------//

exports.batch_list = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;

    const List = await Production_incharge.find({
      $and: [
        { width: { $eq: width_sel } },
        { thickness: { $eq: thikness_sel } },
        { topcolor: { $eq: color_sel } },
      ],
    });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.batch_get_all = async (req, res) => {
  try {
    let all = mongo.ObjectId(req.params.batch_number);
    const List = await Production_incharge.find(
      { all },
      { _id: 1, weight: 1, used: 1, remaning: 1 }
    );

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.batch_getbyweight = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;
    let company_sel = req.body.company_selected;

    const List = await Production_incharge.find({
      $and: [
        { width: { $eq: width_sel } },
        { thickness: { $eq: thikness_sel } },
        { topcolor: { $eq: color_sel } },
      ],
    }).sort({ weight: 1 });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.batch_sort_by_weight_all_batch = async (req, res) => {
  try {
    const List = await Production_incharge.find({}).sort({ weight: 1 });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.edit = async (req, res) => {
  try {
    const user_data = await Production_incharge.findById(req.params.id);
    if (user_data) {
      const updatedUser = await Production_incharge.findById(
        req.params.id
      ).exec();
      updatedUser.set(req.body);
      const updateSalesorder = await updatedUser.save();
      res.status(200).json({
        status: 200,
        msg: "record sucessfully updated",
        res: updatedUser,
      });
    } else {
      res.json({ status: "400", message: "No Record found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DElete by ID
exports.delete = async (req, res) => {
  try {
    const user_data = await Production_incharge.findById(req.params.id);
    if (user_data) {
      await Production_incharge.findById(req.params.id).deleteOne();
      res.json({ status: "200", message: "User has been deleted " });
    } else {
      res.json({ status: "400", message: "No Record found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//pagination----->get------------>all----->with--------->pagination

//-------add colum and count all weight+pcs
exports.Manoj = async (req, res ,next) => {

    const userList = await Production_incharge.aggregate([
      { $match:
         {"product":"GP ROLL","coating":120,"company":"Manoj"}},
       { $group: {
           _id: {'product':'$product','Company':'$company','Grade':'$grade',	
       	'Grade':'$grade','Topcolor':'$topcolor','coating':'$coating','Temper':'$temper',
       	'Guardfilm':'$guardfilm',	'Thickness':'$thickness','Width':'$width','Batch':'$batch',	'Length':'$length'},
        weight: { $sum:'$weight'}, 
         pcs: { $sum:'$pcs'},
         },
         

       }]);
    res.json({ status: 200, msg: "Data Wrong Hai", res: userList });
};










//pagination

exports.allRecords = async (req, res, next) => {
  const page = parseInt(req.query.page);

  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total_pages = await Production_incharge.countDocuments().exec();

  const result = {};

  if (endIndex < (await Production_incharge.countDocuments().exec())) {
    result.next = {
      page: page + 1,

      limit: limit,

      total_pages: Math.round(total_pages / limit),
    };
  }

  if (startIndex > 0) {
    result.previous = {
      page: page - 1,

      limit: limit,

      total_pages: Math.round(total_pages / limit),
    };
  }
  try {
    result.results = await Production_incharge.find()
      .limit(limit)
      .skip(startIndex);
    res.paginatedResult = result;
    res
      .status(201)
      .json({ status: 200, msg: "records get", output: res.paginatedResult });
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
//--------------------> get  by ID

exports.getbyid = async (req, res) => {
  var StockList = await Production_incharge.findById(req.params.id);
  if (StockList) {
    res.json({ status: 200, msg: "data has been fetched", res: StockList });
  } else {
    res.json({ status: "400", message: "No Record found" });
  }
};
exports.allRecords = async (req, res) => {
  // Rest of the code will go here
  try {
    const resPerPage = 10; // results per page
    const page = req.params.page || 1; // Page
    //const userList = await readymadeProducts.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);  ////
    const userList = await Production_incharge.find().sort({ _id: -1 });
    res.json({ status: 200, msg: "data has been fetched", res: userList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-----------------------**------------------**----------------------**----------------
exports.filter_in_stock = async (req, res) => {
  try {
    let thikness_sel = req.body.thickness_selected;
    let width_sel = req.body.width_selected;
    let color_sel = req.body.color_selected;
    let product_sel = req.body.product_selected;
    let company_sel = req.body.company_selected;
    let length_sel = req.body.length_selected;
    let grade_sel = req.body.grade_selected;
    let coating_sel = req.body.coating_selected;
    let temper_sel = req.body.temper_selected;
    let guardfilm_sel = req.body.guardfilm_selected;
    let batch_number_sel = req.body.batch_number_selected;
    let topcolor_sel = req.body.color_selected;

    let dataArray = [];

    if (thikness_sel) {
      dataArray.push({ thickness: { $eq: thikness_sel } });
    }
    if (width_sel) {
      dataArray.push({ width: { $eq: width_sel } });
    }
    if (color_sel) {
      dataArray.push({ width: { $eq: color_sel } });
    }
    if (product_sel) {
      dataArray.push({ width: { $eq: product_sel } });
    }
    if (company_sel) {
      dataArray.push({ width: { $eq: company_sel } });
    }
    if (length_sel) {
      dataArray.push({ width: { $eq: length_sel } });
    }
    if (grade_sel) {
      dataArray.push({ width: { $eq: grade_sel } });
    }
    if (topcolor_sel) {
      dataArray.push({ width: { $eq: topcolor_sel } });
    }
    if (coating_sel) {
      dataArray.push({ width: { $eq: coating_sel } });
    }
    if (temper_sel) {
      dataArray.push({ width: { $eq: temper_sel } });
    }
    if (guardfilm_sel) {
      dataArray.push({ width: { $eq: guardfilm_sel } });
    }
    if (batch_number_sel) {
      dataArray.push({ width: { $eq: batch_number_sel } });
    }

    // console.log('dataArray >>>', dataArray);

    const List = await Production_incharge.find({
      $or: [
        { thickness: { $eq: thikness_sel } },
        { width: { $eq: width_sel } },
        { product: { $eq: product_sel } },
        { company: { $eq: company_sel } },
        { length: { $eq: length_sel } },
        { grade: { $eq: grade_sel } },
        { topcolor: { $eq: topcolor_sel } },
        { coating: { $eq: coating_sel } },
        { temper: { $eq: temper_sel } },
        { guardfilm: { $eq: guardfilm_sel } },
        { batch_number: { $eq: batch_number_sel } },
        { topcolor: { $eq: color_sel } },

        {
          $and: [{ dataArray }],
        },
      ],
    });

    res.json({ status: 200, msg: "data has been fetched", "list-data": List });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
