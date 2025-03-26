

const { Sales, Transaction } = require('../model/Sales');
const sequelize = require('../dbConfig');
const Customer = require('../model/Customer');
const Product = require('../model/Products');
const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const RentImages = require('../model/RentImages');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/rentImages');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage }).array('images', 4);


const createSale = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const {
            customerId, guarantorId, productId, saleDate, cashierName,
            driverId, refund, meeterBefore, note, price, extraCharges, totalAmount,
            paymentType, paidAmount, due
        } = req.body;

        // Validate the refund field
        const refundValue = refund === '' || refund === null ? 0 : parseInt(refund, 10);

        // Create the sale record
        const sale = await Sales.create({
            customerId,
            guarantorId: guarantorId || null,
            productId,
            saleDate,
            cashierName,
            driverId: driverId || null,
            paymentStatus: 'pending',
            status: 'rent',
            refund: refundValue,  
            meeterBefore,   
            note
        }, { transaction: t });

        // Create the transaction record
        const transaction = await Transaction.create({
            salesId: sale.salesId,
            pId: productId,
            price: Number(price),
            extraCharges: Number(extraCharges),
            totalAmount: Number(totalAmount),
            paymentType,
            paidAmount: Number(paidAmount),
            due: Number(due)
        }, { transaction: t });

        // Update sale with transaction ID
        await sale.update({ 
            transactionId: transaction.transactionId 
        }, { transaction: t });

        // Handle image uploads and save paths correctly
        if (req.files && req.files.length > 0) {
            const imageRecord = {
                salesId: sale.salesId,
                imageOne: null,
                imageTwo: null,
                imageThree: null,
                imageFour: null
            };

            // Map each file to the corresponding image field
            req.files.forEach((file, index) => {
                const imageFieldName = `image${['One', 'Two', 'Three', 'Four'][index]}`;
                imageRecord[imageFieldName] = `/uploads/rentImages/${file.filename}`;
            });

            // Create the rentImages record
            await RentImages.create(imageRecord, { transaction: t });
        }

        await t.commit();
        res.status(201).json({ 
            success: true,
            sale, 
            transaction
        });

    } catch (error) {
        await t.rollback();
        console.error('Error creating sale:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};




//worked
// const getAllSales = async (req, res) => {
//     try {
//         const sales = await Sales.findAll({ include: [Transaction] });
//         res.status(200).json(sales);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getAllSales = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const sales = await Sales.findAll({
            include: [Transaction],
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getRentImagesBySalesId = async (req, res) => {
    try {
        const { salesId } = req.params;

        const rentImages = await RentImages.findOne({
            where: { salesId }
        });

        if (!rentImages) {
            return res.status(404).json({ message: 'No images found for this sale' });
        }

        res.status(200).json(rentImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const getAllSales = async (req, res) => {
//     try {
//       const sales = await Sale.findAll({
//         include: [
//           { model: Customer, attributes: ['cusName'] },
//           { model: Product, attributes: ['productName'] }
//         ]
//       });
//       res.json(sales);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const getSaleById = async (req, res) => {
    try {
        const sale = await Sales.findByPk(req.params.id, { include: [Transaction] });
        if (!sale) return res.status(404).json({ message: 'Sale not found' });
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const updateSale = async (req, res) => {
//     const t = await sequelize.transaction();

//     try {
//         const {
//             customerId, guarantorId, productId, saleDate, cashierName,
//             driverId, note, price, extraCharges, totalAmount,
//             paymentType, paidAmount, due , returnDate
//         } = req.body;

//         const sale = await Sales.findByPk(req.params.id);
//         if (!sale) {
//             await t.rollback();
//             return res.status(404).json({ message: 'Sale not found' });
//         }

//         await sale.update({
//             customerId,
//             guarantorId: guarantorId || null,
//             productId,
//             saleDate,
//             cashierName,
//             driverId,
//             note
//         }, { transaction: t });

//         const transaction = await Transaction.findOne({ where: { salesId: sale.salesId } });
//         if (transaction) {
//             await transaction.update({
//                 returnDate,
//                 price,
//                 extraCharges,
//                 totalAmount,
//                 paymentType,
//                 paidAmount,
//                 due
//             }, { transaction: t });
//         }

//         await t.commit();
//         res.status(200).json({ sale, transaction });
//     } catch (error) {
//         await t.rollback();
//         res.status(500).json({ error: error.message });
//     }
// };


//update working

// const updateSale = async (req, res) => {
//     const t = await sequelize.transaction();
  
//     try {
//       const {
//         customerId, guarantorId, productId, saleDate, cashierName,
//         driverId, note, price, extraCharges, totalAmount,
//         paymentType, paidAmount, due, returnDate
//       } = req.body;
  
//       const sale = await Sales.findByPk(req.params.id);
//       if (!sale) {
//         await t.rollback();
//         return res.status(404).json({ message: 'Sale not found' });
//       }
  
//       await sale.update({
//         customerId,
//         guarantorId: guarantorId || null,
//         productId,
//         saleDate,
//         cashierName,
//         driverId,
//         note
//       }, { transaction: t });
  
//       const transaction = await Transaction.findOne({ where: { salesId: sale.salesId } });
//       if (transaction) {
//         await transaction.update({
//           returnDate,
//           price,
//           extraCharges,
//           totalAmount,
//           paymentType,
//           paidAmount,
//           due
//         }, { transaction: t });
//       }
  
//       await t.commit();
//       res.status(200).json({ sale, transaction });
//     } catch (error) {
//       await t.rollback();
//       res.status(500).json({ error: error.message });
//     }
//   };

const updateSale = async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const {
        customerId, guarantorId, productId, saleDate, cashierName,
        driverId, note, price, extraCharges, totalAmount,
        payingAmount, due, returnDate
      } = req.body;
  
      const sale = await Sales.findByPk(req.params.id);
      if (!sale) {
        await t.rollback();
        return res.status(404).json({ message: 'Sale not found' });
      }
  
      await sale.update({
        customerId,
        guarantorId: guarantorId || null,
        productId,
        saleDate,
        cashierName,
        driverId,
        note
      }, { transaction: t });
  
      const transaction = await Transaction.findOne({ 
        where: { salesId: sale.salesId } 
      });
  
      if (transaction) {
        // Add new payment to existing paidAmount
        const updatedPaidAmount = transaction.paidAmount + payingAmount;
  
        await transaction.update({
          returnDate,
          price,
          extraCharges,
          totalAmount,
          paidAmount: updatedPaidAmount,
          due: due // Use the calculated due amount from frontend
        }, { transaction: t });
      }
  
      await t.commit();
      
      // Fetch updated records to return
      const updatedSale = await Sales.findByPk(req.params.id, {
        include: [Transaction]
      });
      
      res.status(200).json(updatedSale);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  };

const deleteSale = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const sale = await Sales.findByPk(req.params.id);
        if (!sale) {
            await t.rollback();
            return res.status(404).json({ message: 'Sale not found' });
        }

        await Transaction.destroy({ where: { salesId: sale.salesId }, transaction: t });
        await sale.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

// const getAllSalesHire = async (req, res) => {
//     try {
//         // Fetch only sales where the status is 'hire' and include the associated transactions
//         const sales = await Sales.findAll({
//             where: { status: 'hire' },  // Filter by 'hire' status
//             include: [Transaction]      // Include associated Transaction data
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "hire" found' });
//         }

//         res.status(200).json(sales);  // Return the filtered sales data
//     } catch (error) {
//         res.status(500).json({ error: error.message });  // Handle any errors
//     }
// };

const getAllSalesHire = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const sales = await Sales.findAll({
            where: { status: 'hire' },  // Filter by 'hire' status
            include: [Transaction],      // Include associated Transaction data
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]  // Order by creation date
        });

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales with status "hire" found' });
        }

        res.status(200).json(sales);  // Return the filtered and paginated sales data
    } catch (error) {
        res.status(500).json({ error: error.message });  // Handle any errors
    }
};


// const getAllSalesRent = async (req, res) => {
//     try {
         
//         const sales = await Sales.findAll({
//             where: { status: 'rent' },   
//             include: [Transaction]       
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "rent" found' });
//         }

//         res.status(200).json(sales);   
//     } catch (error) {
//         res.status(500).json({ error: error.message });   
//     }
// };

// const getAllSalesRent = async (req, res) => {
//     try {
//         const { page = 1, pageSize = 10 } = req.query;
//         const offset = (page - 1) * pageSize;

//         const sales = await Sales.findAll({
//             where: { status: 'rent' },  // Filter by 'rent' status
//             include: [Transaction],     // Include associated Transaction data
//             limit: parseInt(pageSize),
//             offset: parseInt(offset),
//             order: [['createdAt', 'DESC']]  // Order by creation date
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "rent" found' });
//         }

//         res.status(200).json(sales);  // Return the filtered and paginated sales data
//     } catch (error) {
//         res.status(500).json({ error: error.message });  // Handle any errors
//     }
// };

const getAllSalesRent = async (req, res) => {
    try {
        // Make pagination optional
        const { page, pageSize } = req.query;
        
        // Base query options
        const queryOptions = {
            where: { status: 'rent' },
            include: [Transaction],
            order: [['createdAt', 'DESC']]
        };
        
        // Only add pagination if both parameters are provided
        if (page && pageSize) {
            const offset = (parseInt(page) - 1) * parseInt(pageSize);
            queryOptions.limit = parseInt(pageSize);
            queryOptions.offset = offset;
        }
        
        // Add explicit attributes to exclude problematic fields
        // This is a workaround if you can't modify the model right away
        queryOptions.attributes = {
            exclude: ['meeterBefore', 'meeterAfter'] // Exclude any columns that might not exist
        };
        
        const sales = await Sales.findAll(queryOptions);
        
        // Always return 200 with data, even if empty
        return res.status(200).json(sales);
        
    } catch (error) {
        console.error('Error in getAllSalesRent:', error);
        // Return a more client-friendly error message
        res.status(500).json({ 
            error: "Database error. Please contact support." 
        });
    }
};


const hireCreate = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            customerId, guarantorId, productId, saleDate, cashierName,
            driverId, note, price, extraCharges, totalAmount,
            paymentType, paidAmount, due
        } = req.body;

        const sale = await Sales.create({
            customerId,
            guarantorId: guarantorId || null,
            productId,
            saleDate,
            cashierName,
            driverId,
            paymentStatus: 'pending', 
            status: 'hire',
            note
        }, { transaction: t });

    
        const transaction = await Transaction.create({
            salesId: sale.salesId,
            price,
            extraCharges,
            totalAmount,
            paymentType,
            paidAmount,
            due,
            pId: productId
        }, { transaction: t });

        // Update the Sale record with the transactionId
        await sale.update({ transactionId: transaction.transactionId }, { transaction: t });

        // Commit the transaction
        await t.commit();

        // Send the response
        res.status(201).json({ sale, transaction });
    } catch (error) {
        // Rollback the transaction in case of error
        await t.rollback();
        console.error('Error creating sale:', error);
        res.status(500).json({ error: error.message });
    }
};

const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        // Validate date parameters
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                error: 'Both startDate and endDate are required' 
            });
        }

        // Define time grouping formats based on groupBy parameter
        const timeFormats = {
            day: '%Y-%m-%d',
            week: '%Y-%U',
            month: '%Y-%m',
            year: '%Y'
        };

        const format = timeFormats[groupBy] || timeFormats.day;

        // Perform optimized aggregate query
        const revenue = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'timePeriod'],
                [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalRevenue'],
                [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                paidAmount: {
                    [Op.gt]: 0  // Only include transactions with positive amounts
                }
            },
            group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format)],
            order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'ASC']],
            raw: true
        });

        // Calculate summary statistics
        const summary = {
            totalRevenue: revenue.reduce((sum, record) => sum + parseFloat(record.totalRevenue), 0),
            totalTransactions: revenue.reduce((sum, record) => sum + parseInt(record.transactionCount), 0),
            averageRevenuePerPeriod: revenue.length > 0 
                ? (revenue.reduce((sum, record) => sum + parseFloat(record.totalRevenue), 0) / revenue.length).toFixed(2)
                : 0
        };

        res.status(200).json({
            groupedBy: groupBy,
            timeRange: {
                start: startDate,
                end: endDate
            },
            summary,
            revenueData: revenue
        });

    } catch (error) {
        console.error('Error in revenue analytics:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// const getAllTransactions = async (req, res) => {
//     try {
//         const transaction = await Transaction.findAll();
//         res.status(200).json(transaction);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getAllTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const transactions = await Transaction.findAll({
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]  // Order by creation date
        });

        res.status(200).json(transactions);  // Return the paginated transactions
    } catch (error) {
        res.status(500).json({ message: error.message });  // Handle any errors
    }
};

// const getAllSalesWithTransactions = async (req, res) => {
//     try {
//         const sales = await Sales.findAll({
//             include: [
//                 {
//                     model: Transaction,
//                     attributes: ['transactionId', 'pId', 'price', 'totalAmount', 'paidAmount', 'due', 'paymentType'],
//                 },
//                 {
//                     model: Customer,
//                     attributes: ['cusName'], // Fetch customer name
//                 },
//                 {
//                     model: Product,
//                     attributes: ['productName'], // Fetch product name
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });

//         res.status(200).json(sales);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getCurrentMonthTransactions = async (req, res) => {
    try {
        // Get the first and last date of the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Fetch transactions only from the current month
        const transactions = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getCurrentMonthSales = async (req, res) => {
    try {
        // Get the first and last date of the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Fetch transactions only from the current month
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createSale, 
    getAllSales, 
    getSaleById, 
    updateSale, 
    deleteSale, 
    getAllSalesHire , 
    getAllSalesRent , 
    hireCreate ,
    getRevenueAnalytics, 
    getAllTransactions,
    getCurrentMonthTransactions,
    getCurrentMonthSales,
    getRentImagesBySalesId 
   
    

  };
