/// Initializing ///
const { query } = require("express");
const express = require("express");
const app = express();
const port = 14702;
var mysql = require("mysql");
var multer = require('multer');
var cors = require('cors')
var bodyParser = require('body-parser');
var moment = require('moment');
const axios = require("axios")



app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' })); // support json encoded bodies


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});


/// Connecting to mysql ///
var connection = mysql.createConnection({
  host: "122.166.2.21",
  user: "root",
  password: "Krishna@12",
  database: "pms",
});


// /// Connecting to mysql ///
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Krishna@12",
//   database: "housekeeping",
// });


/// Checking mysql connection ///
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to mysql server!");
});


/// Set Up Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '_' + Date.now())
  }
})


/// Create Multer instance
var upload = multer({ storage: storage })


/// Listening to port ///
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// Contains Special characters check
function containsSpecialChars(str) {
  const SpecialChars = "!@#$%^&*()_+\"-=[]{};':\\|,.<>/?~`";

  const result = SpecialChars.split("").some((specialChar) => {
    if (str.includes(specialChar)) {
      return true;
    }

    return false;
  });

  return result;
}


// For checking Alphabet
function alpha(string) {
  const hasAlphabet = /[a-zA-Z]/.test(string);
  return hasAlphabet;
}


// For checking digits
function digit(string) {
  const hasDigits = /\d/.test(string);
  return hasDigits;
}


//Validation Functions
function validate(type, min, max, checkspecialchar, field, value) {
  if (type == '1') {
    if (alpha(value)) {
      console.log(field + ' cannot contain alphabet')
      return true
    }
    else {
      return false
    }
  }
  if (type == '2') {                                      //type 2 : contains only alphabets
    if (digit(value)) {
      console.log(field + ' cannot contain digit')
      return true
    }
    else {
      return false
    }
  }

  if (value.length < min) {
    console.log('Length of ' + field + ' cannot be less than' + min)
    return true
  }
  if (value.length > max) {
    console.log('Length of ' + field + ' cannot be more than ' + max)
    return true
  }

  if (checkspecialchar == 'SpecialChars') {
    if (containsSpecialChars(value)) {
      console.log(field + ' cannot contain special characters')
      return true
    }
  }
}


// Validation Function
function validate2(field, value, min, max, checkspecialchar, type) {
  if (value.length < min) {
    console.log("Length of " + field + " cannot be less than " + min);
    return true;
  }
  if (value.length > max) {
    console.log("Length of " + field + " cannot be more than " + max);
    return true;
  }
  if (checkspecialchar == "SpecialChars") {
    if (containsSpecialChars(value)) {
      console.log(field + " cannot contain special characters");
      return true;
    }
  }
  if (type == "1") {
    //type 1 : contains only digits
    if (alpha(value)) {
      console.log(field + " cannot contain alphabet");
      return true;
    }
  }
  if (type == "2") {
    //type 2 : contains only alphabets
    if (digit(value)) {
      console.log(field + " cannot contain digit");
      return true;
    }
  }
  return false;
}

















//-----------// Configuration Insert Functions (POST) //-----------//
// --------------// MSTUSER1//---------------------------//

//function to Add extras
const addExtra = async (extraCode, description, groupID, subGroupID, remarks, type, percentage, amount, pieces, trips, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM extra WHERE extraCode = ? `;
    const values = [extraCode];
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('Extra Code already exists'));
      }
      else {
        const sql = `INSERT INTO extra (extraCode, description, groupID, subGroupID, remarks, type, percentage, amount, pieces, trips, isActive) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertValues = [extraCode, description, groupID, subGroupID, remarks, type, percentage, amount, pieces, trips, isActive];

        if ((extraCode == undefined) || (groupID == undefined) || (remarks == undefined) || (type == undefined) || (isActive == undefined) || (subGroupID == undefined)) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// Function to add Room Inventory
const addRoomInventory = async (roomID, numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM roomInventory WHERE roomID = ? `;
    const values = [roomID];
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('taxName already exists'));
      }
      else {
        const sql = `INSERT INTO roomInventory ( roomID, numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID) VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?)`
        const insertValues = [roomID, numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID];

        if ((roomID == undefined) || (numAvlRooms == undefined) || (numSellCtrlRooms == undefined) || (numOodRooms == undefined) || (numOverbookedRooms == undefined) || (sellLimit == undefined) || (date == undefined) || (roomTypeID == undefined)) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// Function to add Room Inventory Forecast
const addRoomInventoryForecast = async (roomType, date, noOfUnits) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO roomInventoryForecast (roomType, date, noOfUnits) VALUES ( ?, ?, ?)`;
    const values = [roomType, date, noOfUnits]
    if ((roomType == undefined || roomType == '') || (date == undefined || date == '') || (noOfUnits == undefined || noOfUnits == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("roomType", roomType, 1, 20, "", "1") || validate2("noOfUnits", noOfUnits, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// Function to add Room Type
const addRoomType = async (roomType, maxAdults, maxChildren, totalNumOfRooms, isActive, roomClassID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM roomType WHERE roomType = ? `;
    const values = [roomType];
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Room Type already exists'));
      }
      else {
        const sql = `INSERT INTO roomType (roomType, maxAdults, maxChildren, totalNumOfRooms, isActive, roomClassID) VALUES ( ?, ?, ?, ?, ?, ? )`;
        const insertValues = [roomType, maxAdults, maxChildren, totalNumOfRooms, isActive, roomClassID];

        if ((roomType == undefined || roomType == '') || (maxAdults == undefined || maxAdults == '') || (maxChildren == undefined || maxChildren == '') || (totalNumOfRooms == undefined || totalNumOfRooms == '') || (isActive == undefined || isActive == '') || (roomClassID == undefined || roomClassID == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function to add Room Wise Inventory
const addRoomWiseInventory = async (roomNo, date, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO roomWiseInventory( roomNo, date, status) VALUES ( ?, ?, ? )';
    const values = [roomNo, date, status]
    if ((roomNo == undefined || roomNo == '') || (date == undefined || date == '') || (status == undefined || status == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("roomNo", roomNo, 1, 20, "", "1") || validate2("status", status, 1, 20, "", "1")) {
      console.log("Invalid Parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This is the Function to add ReservationExtra to database
const addReservationExtra = async (reservationID, extraID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO reservationExtras(reservationID,extraID) VALUES (?,?)`;
    const values = [reservationID, extraID]
    if ((reservationID == undefined || reservationID == '') || (extraID == undefined || extraID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add Out Of Order/Service to database
const addOutOfOrderOrService = async (fromDate, toDate, status, returnStatus, remarks, reasonID, roomID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO outOfOrderAndService(fromDate,toDate,status, returnStatus,remarks,reasonID,roomID) VALUES (?,?,?,?,?,?,?)`;
    const values = [fromDate, toDate, status, returnStatus, remarks, reasonID, roomID]
    if ((fromDate == undefined || fromDate == '') || (toDate == undefined || toDate == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// Function to add Transaction Code
const addTransactionCode = async (transactionCode, description, groupID, subGroupID, baseRate, taxPercentage, discountAllowed, isAllowance, isActive, allowanceCodeID) => {
  return new Promise((resolve, reject) => {
    // console.log(taxID)
    const sql = `INSERT INTO transactionCode (transactionCode, description,groupID, subGroupID,baseRate, taxPercentage, discountAllowed, isAllowance, isActive, 
    allowanceCodeID) VALUES ( ?,?,?,?,?,?,?,?,?,?)`;
    const values = [transactionCode, description, groupID, subGroupID,
      baseRate, taxPercentage, discountAllowed, isAllowance, isActive, allowanceCodeID]
    console.log(values)
    if ((transactionCode == undefined || transactionCode == '') || (baseRate == undefined || baseRate == '') || (discountAllowed == undefined ||
      discountAllowed == '') || (isAllowance == undefined || isAllowance == '') || (allowanceCodeID == undefined || allowanceCodeID == '') ||
      (groupID == undefined || groupID == '') || (subGroupID == undefined || subGroupID == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("transactionCode", transactionCode, 1, 20, "", "1") || validate2("baseRate", baseRate, 1, 20, "", "1") ||
      validate2("discountAllowed", discountAllowed, 1, 20, "", "1") || validate2("isAllowance", isAllowance, 1, 20, "", "1") ||
      validate2("isActive", isActive, 1, 20, "", "1") || validate2("allowanceCodeID", allowanceCodeID, 1, 20, "", "1") ||
      validate2("groupID", groupID, 1, 20, "", "1") || validate2("subGroupID", subGroupID, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
          // const transactionCodeID = result.insertId; // Get the ID of the newly inserted row
          // const taxPercentageSql = `INSERT INTO transactionCodeTaxes (transactionCodeID, taxID) VALUES (?, ?)`;
          // const taxPercentageValues = [transactionCodeID, taxID];
          // console.log(taxPercentageValues)
          // connection.query(taxPercentageSql, taxPercentageValues, (error, result) => {
          //   if (error) {
          //     reject(error);
          //   }
          //   else {
          //     resolve(result);
          //   }
          // });
        }
      });
    }
  });
}
















// --------------// MSTUSER2//---------------------------//
/// This is the Function to add block to database
const addBlock = async (block) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM block WHERE block = ? `;
    const values = [block];
    // console.log(values)

    connection.query(query, values, (error, result) => {
      console.log(result.length)
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        console.log(result)
        // The floor and blockID already exist
        reject(new Error('The block  already exists'));
      }
      else {
        const sql = `INSERT INTO block (block) VALUES (?)`;
        const insertValues = [block];

        if (block === undefined || block === '') {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add floors to database
const addFloor = async (floor, blockID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM floor WHERE floor = ? AND blockID = ?`;
    const values = [floor, blockID];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('The floor and block combination already exists'));
      }
      else {
        const sql = `INSERT INTO floor (floor, blockID) VALUES (?, ?)`;
        const insertValues = [floor, blockID];

        if (floor === undefined || floor === '' || blockID === undefined || blockID === '') {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


///This is the Function to add hotelDetails to database
const addHotelDetails = async (name, email, phoneNumber, address, city, state, postalCode, country, logo, fax, currency, hotelGroup) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM hotelDetails WHERE name = ? `;
    const values = [nameD];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('The Hotel  already exists'));
      }
      else {
        const sql = `INSERT INTO hotelDetails (name, email, phoneNumber, address, city, state, postalCode, country, logo, fax, currency, hotelGroup) VALUES (?, ?)`;
        const insertValues = [floor, blockID];
        if ((name == undefined || name == '') || (email == undefined || email == '') || (phoneNumber == undefined || phoneNumber == '') || (address == undefined || address == '') || (city == undefined || city == '') || (phoneNumber == undefined || phoneNumber == '')) {
          console.log("ERROR ,Parameters missing")
        }
        else if (validate(2, 4, 9, "", "name", name) || validate(2, 1, 9, "", "hotelGroup", hotelGroup)) {
          console.log("resend parameter")
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add marketCode to database
const addMarketCode = async (marketCode, description, isActive, marketGroupID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM marketCode WHERE marketCode = ? `;
    const values = [marketCode];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('The marketCode already exists'));
      }
      else {
        const sql = `INSERT INTO marketCode (marketCode ,description, isActive,marketGroupID) VALUES (?,?,?,?)`;
        const insertValues = [marketCode, description, isActive, marketGroupID];

        if ((marketCode == undefined || marketCode == '') || (isActive == undefined || isActive == '') || (marketGroupID == undefined || marketGroupID == '')) {
          //       console.log("ERROR ,Parameters missing")
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add marketGroup to database
const addMarketGroup = async (marketGroup, description, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM marketGroup WHERE marketGroup = ? `;
    const values = [marketGroup, description, isActive];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('The marketGroup already exists'));
      }
      else {
        const sql = `INSERT INTO marketGroup (marketGroup, description, isActive)) VALUES (?,?,?)`;
        const insertValues = [marketGroup, description, isActive];

        if ((marketGroup == undefined || marketGroup == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add NightAudit details to database.   
const addNightAudit = async (businessDate, notes, createdAt, createdBy, countryAndStateCheck, arrivalsNotYetCheckedIn, depaturesNotCheckedOut, rollingBusinessDate, postingRoomAndTax, printingReports) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO nightAudit(businessDate ,notes, createdAt ,createdBy, countryAndStateCheck, arrivalsNotYetCheckedIn, depaturesNotCheckedOut, rollingBusinessDate, postingRoomAndTax, printingReports) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    const values = [businessDate, notes, createdAt, createdBy, countryAndStateCheck, arrivalsNotYetCheckedIn, depaturesNotCheckedOut, rollingBusinessDate, postingRoomAndTax, printingReports]

    if ((businessDate == undefined || businessDate == '') || (notes == undefined || notes == '') || (createdAt == undefined || createdAt == '') || (createdBy == undefined || createdBy == '') || (countryAndStateCheck == undefined || countryAndStateCheck == '') || (arrivalsNotYetCheckedIn == undefined || arrivalsNotYetCheckedIn == '') || (depaturesNotCheckedOut == undefined || depaturesNotCheckedOut == '') || (rollingBusinessDate == undefined || rollingBusinessDate == '') || (postingRoomAndTax == undefined || postingRoomAndTax == '') || (printingReports == undefined || printingReports == '')) {

      console.log("ERROR ,Parameters missing")
    }

    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};



/// This is the Function to add PackageGroup to database
const addPackageGroup = async (packageGroup, description, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM packageGroup WHERE packageGroup = ?`;
    const values = [packageGroup];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('The packageGroup already exists'));
      }
      else {
        const sql = `INSERT INTO packageGroup (packageGroup ,description, isActive) VALUES (?,?,?)`;
        const insertValues = [packageGroup, description, isActive];

        if ((packageGroup == undefined || packageGroup == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};



/// This is the Function to add RateClass details to database
const addRateClass = async (rateClass, description, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM rateClass WHERE rateClass = ?`;
    const values = [rateClass];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('Rate Class already exists'));
      }
      else {
        const sql = `INSERT INTO rateClass(rateClass, description, isActive) VALUES (?,?,?)`;
        const insertValues = [rateClass, description, isActive];

        if ((rateClass == undefined || rateClass == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add RateCategory  details to database. 
const addRateCategory = async (rateCategory, description, isActive, rateClassID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM rateCategory WHERE rateCategory = ?`;
    const values = [rateCategory];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('The rateCategory already exists'));
      }
      else {
        const sql = `INSERT INTO rateCategory (rateCategory, description, isActive, rateClassID) VALUES (?,?,?,?)`;
        const insertValues = [rateCategory, description, isActive, rateClassID];

        if ((rateCategory == undefined || rateCategory == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add RateCode details to database
const addRateCode = async (rateCode, description, beginSellDate, endSellDate, daysApplicable, printRate, dayUse, discount, discountAmount, discountPercentage, complementary, houseUse, isActive, marketID, packageID, packageTransactionCodeID, rateCategoryID, sourceID, tansactionCodeID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM rateCode WHERE rateCode = ? `;
    const values = [rateCode];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Rate Code combination already exists'));
      }
      else {
        const sql = `INSERT INTO rateCode (rateCode, description, beginSellDate, endSellDate, daysApplicable, printRate, dayUse, discount, discountAmount, discountPercentage, complementary, houseUse, isActive, marketID, packageID, packageTransactionCodeID, rateCategoryID, sourceID, tansactionCodeID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const insertValues = [rateCode, description, beginSellDate, endSellDate, daysApplicable, printRate, dayUse, discount, discountAmount, discountPercentage, complementary, houseUse, isActive, marketID, packageID, packageTransactionCodeID, rateCategoryID, sourceID, tansactionCodeID];

        if ((rateCode == undefined || rateCode == '') || (beginSellDate == undefined || beginSellDate == '') || (endSellDate == undefined || endSellDate == '') || (daysApplicable == undefined || daysApplicable == '') || (printRate == undefined || printRate == '') || (dayUse == undefined || dayUse == '') || (discount == undefined || discount == '') || (discountAmount == undefined || discountAmount == '') || (discountPercentage == undefined || discountPercentage == '') || (complementary == undefined || complementary == '') || (houseUse == undefined || houseUse == '') || (isActive == undefined || isActive == '') || (marketID == undefined || marketID == '') || (packageID == undefined || packageID == '') || (packageTransactionCodeID == undefined || packageTransactionCodeID == '') || (rateCategoryID == undefined || rateCategoryID == '') || (sourceID == undefined || sourceID == '') || (tansactionCodeID == undefined || tansactionCodeID == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add RateSummary to database
const addRateSummary = async (reservationID, date, rateCodeID, dailyDetails, roomRevenue, roomTax, packageRevenue, packageTax, subTotal, totalTaxGenerated, total) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO rateSummary (,reservationID ,date, rateCodeID, dailyDetails, roomRevenue, roomTax,packageRevenue, packageTax, subTotal, totalTaxGenerated,total) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [reservationID, date, rateCodeID, dailyDetails, roomRevenue, roomTax, packageRevenue, packageTax, subTotal, totalTaxGenerated, total]
    if ((reservationID == undefined || reservationID == '') || (date == undefined || date == '') || (rateCodeID == undefined || rateCodeID == '') || (dailyDetails == undefined || dailyDetails == '') || (roomRevenue == undefined || roomRevenue == '') || (roomTax == undefined || roomTax == '') || (packageRevenue == undefined || packageRevenue == '') || (packageTax == undefined || packageTax == '') || (subTotal == undefined || subTotal == '') || (totalTaxGenerated == undefined || totalTaxGenerated == '') || (total == undefined || total == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate(1, 1, 9, "SpecialChars", "rateCodeID", rateCodeID) || validate(1, 1, 9, "SpecialChars", "roomTax", roomTax) || validate(1, 1, 9, "SpecialChars", "packageTax", packageTax)) {
      console.log("resend parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add ReservationGroup to database
const addReservationGroup = async (groupCode, description, costCenter, isActive) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO reservationsGroup(groupCode ,description, costCenter ,isActive) VALUES (?,?,?,?)`;
    const values = [groupCode, description, costCenter, isActive]
    console.log(values)
    if ((groupCode == undefined || groupCode == '') || (costCenter == undefined || costCenter == '') || (isActive == undefined || isActive == '')) {

      console.log("ERROR ,Parameters missing")
    }
    else if (validate(1, 1, 9, "", "isActive", isActive)) {
      console.log(values)
      console.log("resend parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add SubGroup to database
const addSubGroup = async (subGroup, description, groupID, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM subGroup WHERE subGroup = ?`;
    const values = [subGroup];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('SubGroup already exists'));
      }
      else {
        const sql = `INSERT INTO subGroup (subGroup, description, groupID, isActive) VALUES (?,?,?,?)`
        const insertValues = [subGroup, description, groupID, isActive];

        if ((subGroup == undefined || subGroup == '') || (isActive == undefined || isActive == '') || (groupID == undefined || groupID == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add user details to database
const adduser = async (firstName, lastName, email, password, department, isAccountManager, isActive, isStaff, isSuperUser) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user WHERE email = ?`;
    const values = [email];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('User already exists'));
      }
      else {
        const sql = `INSERT INTO user (firstName, lastName, email, password, department, isAccountManager, isActive, isStaff, isSuperUser) VALUES (?,?,?,?,?,?,?,?,?)`;
        const insertValues = [firstName, lastName, email, password, department, isAccountManager, isActive, isStaff, isSuperUser];

        if ((firstName == undefined || firstName == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function to add Custom User
const addCustomUser = async (password, lastLogin, isSuperuser, firstName, lastName, isStaff, isActive, dateJoined, isAccountManager, email, departmentID, designation) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO customUser( password, lastLoginlastLogin, isSuperuser, firstName, lastName, isStaff, isActive, dateJoined, isAccountManager, email,  departmentID, designation) VALUES ( ?, ?, ? )';
    const values = [roomNo, date, status]
    if ((passwordpassword == undefined || password == '') || (lastLogin == undefined || lastLogin == '') || (firstName == undefined || firstName == '') || (lastName == undefined || lastName == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("password", password, 1, 20, "", "") || validate2("lastLogin", lastLogin, 1, 20, "", "") || validate2("firstName", firstName, 1, 30, "", "2") || validate2("lastName", lastName, 1, 20, "", "2")) {
      console.log("Invalid Parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}
















//-----------// Other Insert Functions (POST) //-----------//


/// This Function is to add Booker
const addBooker = async (account, name, emailID, phone, addressLine1, addressLine2, country, state, city, postalCode, isActive) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO booker(account, name, emailID, phone, addressLine1, addressLine2, country, state, city, postalCode, isActive) VALUES  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [account, name, emailID, phone, addressLine1, addressLine2, country, state, city, postalCode, isActive]
    console.log(values)
    if ((account == undefined || account == '') || (name == undefined || name == '') || (emailID == undefined || emailID == '') || (phone == undefined || phone == '') || (addressLine1 == undefined || addressLine1 == '') || (addressLine2 == undefined || addressLine2 == '') || (country == undefined || country == '') || (state == undefined || state == '') || (city == undefined || city == '') || (postalCode == undefined || postalCode == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("account", account, 1, 20, "SpecialChars", "") || validate2("name", name, 1, 20, "SpecialChars", "2") || validate2("emailID", emailID, 1, 20, "", "2") || validate2("phone", phone, 1, 13, "", "1") || validate2("addressLine1", addressLine1, 1, 255, "", "") || validate2("addressLine2", addressLine2, 1, 255, "", "") || validate2("country", country, 1, 20, "SpecialChars", "2") || validate2("state", state, 1, 20, "SpecialChars", "2") || validate2("city", city, 1, 20, "SpecialChars", "2") || validate2("postalCode", postalCode, 1, 10, "", "1") || validate2("isActive", isActive, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Cancellation
const addCancellation = async (reservation, groupReservation, reasonCode, remarks, cancellationType, paymentTransaction, cancellationDate) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO cancellation ( reservation, groupReservation, reasonCode, remarks, cancellationType, paymentTransaction, cancellationDate) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
    const values = [reservation, groupReservation, reasonCode, remarks, cancellationType, paymentTransaction, cancellationDate]
    console.log(values)
    if ((reservation == undefined || reservation == '') || (groupReservation == undefined || groupReservation == '') || (reasonCode == undefined || reasonCode == '') || (remarks == undefined || remarks == '') || (cancellationType == undefined || cancellationType == '') || (paymentTransaction == undefined || paymentTransaction == '') || (cancellationDate == undefined || cancellationDate == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("reservation", reservation, 1, 20, "", "1") || validate2("groupReservation", groupReservation, 1, 20, "", "1") || validate2("reasonCode", reasonCode, 1, 20, "", "") || validate2("remarks", remarks, 1, 255, "SpecialChars", "") || validate2("cancellationType", cancellationType, 1, 20, "SpecialChars", "") || validate2("paymentTransaction", paymentTransaction, 1, 20, "", "1") || validate2("cancellationDate", cancellationDate, 1, 255, "", "")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Commission
const addCommission = async (commissionCode, description, commissionPercentage, tax, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM commission WHERE commissionCode = ?`;
    const values = [commissionCode];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('Commission Code already exists'));
      }
      else {
        const sql = `INSERT INTO commission (commissionCode, description, commissionPercentage, tax, isActive) VALUES (?,?,?,?,?)`;
        const insertValues = [commissionCode, description, commissionPercentage, tax, isActive];

        if ((commissionCode == undefined || commissionCode == '') || (commissionPercentage == undefined || commissionPercentage == '') || (tax == undefined || tax == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function is to add Change Room
const addChangeRoom = async (clientID, bookingID, floor, guestName, roomType, oldRoomNumber, newRoomNumber) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO changeRoom ( clientID, bookingID, floor, guestName, roomType,oldRoomNumber,newRoomNumber) VALUES (  ?, ?, ?, ?, ?, ?, ?)`;
    const values = [clientID, bookingID, floor, guestName, roomType, oldRoomNumber, newRoomNumber]
    console.log(values)
    if ((clientID == undefined || clientID == '') || (bookingID == undefined || bookingID == '') || (floor == undefined || floor == '') || (guestName == undefined || guestName == '') || (roomType == undefined || roomType == '') || (oldRoomNumber == undefined || oldRoomNumber == '') || (newRoomNumber == undefined || newRoomNumber == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("clientID", clientID, 1, 20, "", "1") || validate2("bookingID", bookingID, 1, 20, "", "1") || validate2("floor", floor, 1, 20, "", "") || validate2("guestName", guestName, 1, 20, "SpecialChars", "2") || validate2("oldRoomNumber", oldRoomNumber, 1, 20, "", "1") || validate2("newRoomNumber", newRoomNumber, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Documents
const addDocuments = async (documentType, reservation, invoice, document) => {
  return new Promise((resolve, reject) => {
    const query = ` SELECT * FROM documents WHERE documentType = ?`;
    const values = [documentType];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('The documentType already exists'));
      }
      else {
        const sql = `INSERT INTO documents (documentType, reservation, invoice, document) VALUES (?,?,?,?)`;
        const insertValues = [documentType, reservation, invoice, document];

        if ((documentType == undefined || documentType == '') || (reservation == undefined || reservation == '') || (invoice == undefined || invoice == '') || (document == undefined || document == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};

/// This Function is to add Document Type
const addDocumentType = async (documentType) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO documentType ( documentType) VALUES ( ?)`;
    const values = [documentType]
    if ((documentType == undefined || documentType == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("documentType", documentType, 1, 255, "", "")) {
      console.log("Invalid document or size")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Extra Group
const addExtraGroup = async (extraID, groupID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO extraGroup (extraID, groupID) VALUES ( ?, ?)`;
    const values = [extraID, groupID]
    if ((extraID == undefined || extraID == '') || (groupID == undefined || groupID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("extraID", extraID, 1, 20, "", "1") || validate2("groupID", groupID, 1, 20, "", "1")) {
      console.log("Invalid Parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Fixed Charge
const addFixedCharge = async (reservation, guestProfileID, frequency, beginDate, endDate, transactionCode, amount, quantity, supplement) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO fixedCharge ( reservation, guestProfileID, frequency, beginDate, endDate, transactionCode, amount, quantity, supplement) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [reservation, guestProfileID, frequency, beginDate, endDate, transactionCode, amount, quantity, supplement]
    if ((reservation == undefined || reservation == '') || (guestProfileID == undefined || guestProfileID == '') || (frequency == undefined || frequency == '') || (beginDate == undefined || beginDate == '') || (endDate == undefined || endDate == '') || (transactionCode == undefined || transactionCode == '') || (amount == undefined || amount == '') || (quantity == undefined || quantity == '') || (supplement == undefined || supplement == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("reservation", reservation, 1, 20, "", "1") || validate2("amount", amount, 1, 20, "", "1") || validate2("guestProfileID", guestProfileID, 1, 20, "", "1") || validate2("frequency", frequency, 1, 20, "SpecialChars", "") || validate2("transactionCode", transactionCode, 1, 20, "", "1") || validate2("quantity", quantity, 1, 20, "", "1") || validate2("supplement", supplement, 1, 200, "", "")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Forex
const addForex = async (room, reservation, guestProfileID, currency, rateForTheDay, amount, equivalentAmount, CGST, SGST, total, remarks) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO forex ( room, reservation, guestProfileID, currency, rateForTheDay, amount, equivalentAmount, CGST, SGST, total, remarks) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [room, reservation, guestProfileID, currency, rateForTheDay, amount, equivalentAmount, CGST, SGST, total, remarks]
    if ((room == undefined || room == '') || (reservation == undefined || reservation == '') || (guestProfileID == undefined || guestProfileID == '') || (currency == undefined || currency == '') || (rateForTheDay == undefined || rateForTheDay == '') || (amount == undefined || amount == '') || (equivalentAmount == undefined || equivalentAmount == '') || (CGST == undefined || CGST == '') || (SGST == undefined || SGST == '') || (total == undefined || total == '') || (remarks == undefined || remarks == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("room", room, 1, 20, "", "1") || validate2("reservation", reservation, 1, 20, "", "1") || validate2("guestProfileID", guestProfileID, 1, 20, "", "1") || validate2("currency", currency, 1, 20, "SpecialChars", "2") || validate2("rateForTheDay", rateForTheDay, 1, 200, " ", " ") || validate2("amount", amount, 1, 20, "", "1") || validate2("equivalentAmount", equivalentAmount, 1, 20, "", "1") || validate2("CGST", CGST, 1, 20, "", "1") || validate2("SGST", SGST, 1, 20, "", "1") || validate2("total", total, 1, 20, "", "1") || validate2("remarks", remarks, 1, 200, "", "")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Group Reservation Room Type
const addGroupReservationRoomType = async (groupReservation, roomType, rateCode, rateAmount, numberOfRooms, numberOfPickedRooms) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO groupReservationRoomType (groupReservation, roomType, rateCode, rateAmount, numberOfRooms, numberOfPickedRooms) VALUES ( ?, ?, ?, ?, ?, ?)`;
    const values = [groupReservation, roomType, rateCode, rateAmount, numberOfRooms, numberOfPickedRooms]
    if ((groupReservation == undefined || groupReservation == '') || (roomType == undefined || roomType == '') || (rateCode == undefined || rateCode == '') || (rateAmount == undefined || rateAmount == '') || (numberOfRooms == undefined || numberOfRooms == '') || (numberOfPickedRooms == undefined || numberOfPickedRooms == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("groupReservation", groupReservation, 1, 20, "", "1") || validate2("roomType", roomType, 1, 20, "", "1") || validate2("rateCode", rateCode, 1, 20, "", "1") || validate2("rateAmount", rateAmount, 1, 20, "", "1") || validate2("numberOfRooms", numberOfRooms, 1, 20, "", "1") || validate2("numberOfPickedRooms", numberOfPickedRooms, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add addReservationType
const addReservationType = async (reservationType, isActive) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO reservationType ( reservationType, isActive) VALUES ( ?, ?)`;
    const values = [reservationType, isActive]
    console.log(values)
    if ((reservationType == undefined || reservationType == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("reservationType", reservationType, 3, 255, "", '2') || validate2("isActive", isActive, 1, 20, "", '0')) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error)
          reject(error);
        }
        else {
          console.log(result)
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Room Class
const addRoomClass = async (roomClass, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM roomClass WHERE roomClass = ? `;
    const values = [roomClass];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Room Class already exists'));
      }
      else {
        const sql = `INSERT INTO roomClass (roomClass, isActive) VALUES (?, ?)`;
        const insertValues = [roomClass, isActive];

        if ((roomClass == undefined || roomClass == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function is to add Split Transaction
const addSplitTransaction = async (transaction, splitBy, amount, percentage, splitAmount, splitAmountWithTax) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO splitTransaction ( transaction, splitBy, amount, percentage, splitAmount, splitAmountWithTax) VALUES ( ?, ?, ?, ?, ?, ?)`;
    const values = [transaction, splitBy, amount, percentage, splitAmount, splitAmountWithTax]
    console.log(values)
    if ((transaction == undefined || transaction == '') || (splitBy == undefined || splitBy == '') || (amount == undefined || amount == '') || (percentage == undefined || percentage == '') || (splitAmount == undefined || splitAmount == '') || (splitAmountWithTax == undefined || splitAmountWithTax == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("transaction", transaction, 1, 20, "", "1") || validate2("amount", amount, 1, 20, "", "1") || validate2("percentage", percentage, 1, 20, "", "1") || validate2("splitAmount", splitAmount, 1, 20, "", "1") || validate2("splitBy", splitBy, 1, 20, "", "") || validate2("splitAmountWithTax", splitAmountWithTax, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Ticket
const addTicket = async (createdBy, createdAt, room, area, category, priority, subject, description, status, agent, SLADateAndTime, fileUpload) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ticket ( createdBy, createdAt, room, area, category, priority, subject, description, status, agent, SLADateAndTime ,fileUpload) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [createdBy, createdAt, room, area, category, priority, subject, description, status, agent, SLADateAndTime, fileUpload]
    if ((createdBy == undefined || createdBy == '') || (room == undefined || room == '') || (area == undefined || area == '') || (category == undefined || category == '') || (priority == undefined || priority == '') || (subject == undefined || subject == '') || (fileUpload == undefined || fileUpload == '') || (status == undefined || status == '') || (agent == undefined || agent == '') || (SLADateAndTime == undefined || SLADateAndTime == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("createdBy", createdBy, 1, 20, "", "") || validate2("room", room, 1, 20, "", "1") || validate2("category ", category, 1, 20, "SpecialChars", "1") || validate2("priority", priority, 0, 20, "SpecialChars", "") || validate2("status", status, 1, 20, "SpecialChars", "2") || validate2("agent", agent, 1, 20, "", "1") || validate2("fileUpload ", fileUpload, 1, 255, "", "")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}

/// This Function is to add Ticket Category
const addTicketCategory = async (ticketCategoryCode, description) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ticketCategory (ticketCategoryCode, description) VALUES ( ?, ?)`;
    const values = [ticketCategoryCode, description]
    if ((ticketCategoryCode == undefined || ticketCategoryCode == '') || (description == undefined || description == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("ticketCategoryCode", ticketCategoryCode, 1, 20, "", "")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Transaction
const addTransaction = async (folio, transactionCode, reservation, guestProfileID, companyORAgent, baseAmount, createdAt, createdBy, remarks, room, quantity, package, rateCode, supplement, date, description, discountAmount, discountPercentage, transactionType, isDeposit, taxPercentage, CGST, SGST, total, serviceChargeORCommissionPercentage, serviceChargeORCommission, serviceChargeORCommissionTaxPercentage, serviceChargeORCommissionCGST, serviceChargeORCommissionSGST, totalWithServiceChargeORCommission, isServiceChargeCancelled, isCancelled, POSBillNumber, POSSession, allowanceTransaction, invoice, card) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO transaction (  folio, transactionCode,   reservation, guestProfileID,  companyORAgent,   baseAmount, createdAt, createdBy, remarks,  room,   quantity, package, rateCode, supplement,  date,   description,  discountAmount, discountPercentage, transactionType, isDeposit, taxPercentage, CGST, SGST,  total,  serviceChargeORCommissionPercentage, serviceChargeORCommission, serviceChargeORCommissionTaxPercentage,   serviceChargeORCommissionCGST, serviceChargeORCommissionSGST, totalWithServiceChargeORCommission,   isServiceChargeCancelled, isCancelled, POSBillNumber,   POSSession, allowanceTransaction,   invoice,  card) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?)`;
    const values = [folio, transactionCode, reservation, guestProfileID, companyORAgent, baseAmount, createdAt, createdBy, remarks, room, quantity, package, rateCode, supplement, date, description, discountAmount, discountPercentage, transactionType, isDeposit, taxPercentage, CGST, SGST, total, serviceChargeORCommissionPercentage, serviceChargeORCommission, serviceChargeORCommissionTaxPercentage, serviceChargeORCommissionCGST, serviceChargeORCommissionSGST, totalWithServiceChargeORCommission, isServiceChargeCancelled, isCancelled, POSBillNumber, POSSession, allowanceTransaction, invoice, card]

    if ((folio == undefined || folio == '') || (transactionCode == undefined || transactionCode == '') || (reservation == undefined || reservation == '') || (guestProfileID == undefined || guestProfileID == '') || (companyORAgent == undefined || companyORAgent == '') || (baseAmount == undefined || baseAmount == '') || (createdAt == undefined || createdAt == '') || (createdBy == undefined || createdBy == '') || (remarks == undefined || remarks == '') || (room == undefined || room == '') || (quantity == undefined || quantity == '') || (package == undefined || package == '') || (rateCode == undefined || rateCode == '') || (supplement == undefined || supplement == '') || (date == undefined || date == '') || (description == undefined || description == '') || (discountAmount == undefined || discountAmount == '') || (discountPercentage == undefined || discountPercentage == '') || (transactionType == undefined || transactionType == '') || (isDeposit == undefined || isDeposit == '') || (taxPercentage == undefined || taxPercentage == '') || (CGST == undefined || CGST == '') || (SGST == undefined || SGST == '') || (total == undefined || total == '') || (serviceChargeORCommissionPercentage == undefined || serviceChargeORCommissionPercentage == '') || (serviceChargeORCommission == undefined || serviceChargeORCommission == '') || (serviceChargeORCommissionTaxPercentage == undefined || serviceChargeORCommissionTaxPercentage == '') || (serviceChargeORCommissionCGST == undefined || serviceChargeORCommissionCGST == '') || (serviceChargeORCommissionSGST == undefined || serviceChargeORCommissionSGST == '') || (totalWithServiceChargeORCommission == undefined || totalWithServiceChargeORCommission == '') || (isServiceChargeCancelled == undefined || isServiceChargeCancelled == '') || (isCancelled == undefined || isCancelled == '') || (POSBillNumber == undefined || POSBillNumber == '') || (POSSession == undefined || POSSession == '') || (allowanceTransaction == undefined || allowanceTransaction == '') || (invoice == undefined || invoice == '') || (card == undefined || card == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("folio", folio, 1, 20, "", "1") || validate2("transactionCode", transactionCode, 1, 20, "", "1") || validate2("reservation", reservation, 1, 20, "", "1") || validate2("guestProfileID", guestProfileID, 1, 20, "", "1") || validate2("companyORAgent", companyORAgent, 1, 255, "", "") || validate2("baseAmount", baseAmount, 1, 20, "", "1") || validate2("createdBy", createdBy, 1, 20, "", "2") || validate2("remarks", remarks, 1, 255, "", "") || validate2("room", room, 1, 20, "", "1") || validate2("quantity", quantity, 1, 20, "", "1") || validate2("package", package, 1, 20, "", "1") || validate2("rateCode", rateCode, 1, 20, "", "1") || validate2("supplement", supplement, 1, 255, "", "") || validate2("description", description, 1, 255, "", "") || validate2("discountAmount", discountAmount, 1, 20, "", "") || validate2("discountPercentage", discountPercentage, 1, 20, "", "") || validate2("transactionType", transactionType, 1, 255, "", "") || validate2("isDeposit", isDeposit, 1, 20, "", "1") || validate2("taxPercentage", taxPercentage, 1, 20, "", "1") || validate2("CGST", CGST, 1, 20, "", "1") || validate2("SGST", SGST, 1, 20, "", "1") || validate2("total", total, 1, 20, "", "1") || validate2("serviceChargeORCommissionPercentage", serviceChargeORCommissionPercentage, 1, 20, "", "1") || validate2("serviceChargeORCommission", serviceChargeORCommission, 1, 20, "", "1") || validate2("serviceChargeORCommissionTaxPercentage", serviceChargeORCommissionTaxPercentage, 1, 20, "", "1") || validate2("serviceChargeORCommissionCGST", serviceChargeORCommissionCGST, 1, 20, "", "1") || validate2("serviceChargeORCommissionSGST", serviceChargeORCommissionSGST, 1, 20, "", "1") || validate2("totalWithServiceChargeORCommission", totalWithServiceChargeORCommission, 1, 20, "", "1") || validate2("isServiceChargeCancelled", isServiceChargeCancelled, 1, 20, "", "1") || validate2("isCancelled", isCancelled, 1, 20, "", "") || validate2("POSBillNumber", POSBillNumber, 1, 255, "", "1") || validate2("POSSession", POSSession, 1, 255, "", "1") || validate2("allowanceTransaction", allowanceTransaction, 1, 15, "", "1") || validate2("invoice", invoice, 1, 20, "", "1") || validate2("card", card, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add WaitList
const addWaitList = async (reservation, waitListSequence, date) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO waitList (reservation, waitListSequence, date) VALUES (?, ?, ?)`;
    const values = [reservation, waitListSequence, date]
    if ((reservation == undefined || reservation == '') || (waitListSequence == undefined || waitListSequence == '') || (date == undefined || date == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate2("reservation", reservation, 1, 20, "", "1") || validate2("waitListSequence", waitListSequence, 1, 20, "", "1")) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}



















//   Extra Added Insert Function
/// This is the Function to add Card details 
const addCardDetails = async (guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVVno, maskedCVV) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO cardDetails (guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVVno, maskedCVV) VALUES (?,?,?,?,?,?,?,?)`;
    const values = [guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVVno, maskedCVV]
    if ((guestProfileIDguestProfileID == undefined || guestProfileID == '') || (paymentTypeID == undefined || paymentTypeID == '') || (guestProfileID == undefined || guestProfileID == '')) {
      console.log("ERROR ,Parameters missing")
    }

    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add Department
const addDepartment = async (departmentName, isActive) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO department (departmentName, isActive) VALUES (?,?)`;
    const values = [departmentName, isActive]
    if ((departmentName == undefined || departmentName == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }

    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add tax to database
const addIdDetails = async (guestID, IDType, idNumber, issueDate, expiryDate, issuePlace, name, idFile) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM idDetails WHERE guestID = ? AND IDType = ?`;
    const values = [guestID, IDType];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('The idDetails combination already exists'));
      }
      else {
        const sql = `INSERT INTO idDetails (guestID, IDType, idNumber,issueDate, expiryDate,issuePlace, name, idFile ) VALUES (?,?,?,?,?,?,?,?)`;
        const insertValues = [guestID, IDType, idNumber, issueDate, expiryDate, issuePlace, name, idFile];

        if ((IDType == undefined || IDType == '') || (name == undefined || name == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function is to add Packages
const addPackage = async (packageCode, description, beginSellDate, endSellDate, basePrice, taxAmount, totalAmount, calculationRule, postingRhythm, rateInclusion, isActive, packageGroupID, transactionCodeID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM package WHERE packageCode = ?`;
    const values = [packageCode];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('The packageGroup already exists'));
      }
      else {
        const sql = `INSERT INTO package(packageCode, description, beginSellDate, endSellDate, basePrice, taxAmount, totalAmount, calculationRule, postingRhythm, rateInclusion, isActive, packageGroupID, transactionCodeID)) VALUES  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertValues = [packageCode, description, beginSellDate, endSellDate, basePrice, taxAmount, totalAmount, calculationRule, postingRhythm, rateInclusion, isActive, packageGroupID, transactionCodeID];
        if ((packageCode == undefined || packageCode == '') || (description == undefined || description == '') || (beginSellDate == undefined || beginSellDate == '') || (endSellDate == undefined || endSellDate == '') || (basePrice == undefined || basePrice == '') || (taxAmount == undefined || taxAmount == '') || (totalAmount == undefined || totalAmount == '') || (calculationRule == undefined || calculationRulecalculationRule == '') || (postingRhythm == undefined || postingRhythm == '') || (rateInclusion == undefined || rateInclusion == '') || (isActive == undefined || isActive == '') || (packageGroupID == undefined || packageGroupID == '') || (transactionCodeID == undefined || transactionCodeID == '')) {

          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This Function is to add Pick up Drop Details
const addPickUpDropDetails = async (type, date, time, stationCode, carrierCode, transportType, remarks) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO pickupdropDetails(type, date, time, stationCode, carrierCode, transportType , remarks) VALUES  ( ?, ?, ?, ?, ?, ?, ?)`;
    const values = [type, date, time, stationCode, carrierCode, transportType, remarks]
    console.log(values)
    if ((type == undefined || type == '') || (date == undefined || date == '') || (time == undefined || time == '') || (stationCode == undefined || stationCode == '') || (carrierCode == undefined || carrierCode == '') || (transportType == undefined || transportType == '')) {
      console.log("ERROR ,Parameters missing")
    }
    // else if (validate2("packageCode", packageCode, 1, 20, "SpecialChars", "") || validate2("basePrice", basePrice, 1, 20, "", "1") || validate2("taxAmount", taxAmount, 1, 20, "", "1") || validate2("totalAmount", totalAmount, 1, 20, "", "1") || validate2("isActive", isActive, 1, 20, "", "1")) {
    // console.log("Invalid parameter")
    // }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Reason Group
const addReasonGroup = async (reasonGroup, description) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO reasonGroup(reasonGroup, description) VALUES  ( ?, ?)`;
    const values = [reasonGroup, description]
    console.log(values)
    if ((reasonGroup == undefined || reasonGroup == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Room Discrepancy
const addRoomDiscrepency = async (roomNumber, frontOfficeStatus, housekeepingStatus, frontOfficePAX, housekeepingPAX, discrepancy) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO roomDiscrepency(roomNumber, frontOfficeStatus, housekeepingStatus, frontOfficePAX, housekeepingPAX, discrepancy) VALUES  ( ?, ?, ?, ?, ?, ?,)`;
    const values = [roomNumber, frontOfficeStatus, housekeepingStatus, frontOfficePAX, housekeepingPAX, discrepancy]
    console.log(values)
    if ((roomNumber == undefined || roomNumber == '') || (frontOfficeStatus == undefined || frontOfficeStatus == '') || (housekeepingStatus == undefined || housekeepingStatus == '') || (discrepancy == undefined || discrepancy == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This Function is to add Sharing ID
const addSharingID = async (sharingID, numberOfReservations, exemptAfter, apply, applyOnRackRate) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO sharingID( sharingID, numberOfReservations,exemptAfter, apply, applyOnRackRate) VALUES  ( ?, ?, ?, ?, ?)`;
    const values = [sharingID, numberOfReservations, exemptAfter, apply, applyOnRackRate]
    console.log(values)
    if ((sharingID == undefined || sharingID == '') || (numberOfReservations == undefined || numberOfReservations == '') || (exemptAfter == undefined || exemptAfter == '') || (apply == undefined || apply == '') || (applyOnRackRate == undefined || applyOnRackRate == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


///This is the Function to add VIP
const addVIP = async (vipType, vipLevel) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM vip WHERE vipType = ? `;
    const values = [vipType];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('VIP Type already exists'));
      }
      else {
        const sql = `INSERT INTO vip (vipType, vipLevel) VALUES (?, ?)`;
        const insertValues = [vipType, vipLevel];

        if (vipType === undefined || vipType === '') {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};




















// -------- MSTUSER2 -------- //
///This is the Function to add Accounts to database
const addAccounts = async (accountName, accountType, commision, email, phoneNumber, addressLine1, addressLine2, country, state, city, postalCode, isActive, gstID, IATA, isBTCApproved, secondaryEmail, createdBy, createdAt, modifiedBy, modifiedAt, rateCode, notes, accountManagerID, financialAssociateID, creditLimit, tenure, attachment) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO accounts(accountName, accountType,commision, email, phoneNumber, addressLine1, addressLine2, country, state, city, postalCode, isActive, gstID, IATA, isBTCApproved, secondaryEmail, createdBy, createdAt, modifiedBy, modifiedAt, rateCode, notes,  accountManagerID, financialAssociateID, creditLimit, tenure, attachment) VALUES (?,?,?,?,? ,?,?,?,?,?, ?,?,?,?,? ,?,?,?,?,? ,?,?,?,?,? ,?,?)`;

    const values = [accountName, accountType, commision, email, phoneNumber, addressLine1, addressLine2, country, state, city, postalCode, isActive, gstID, IATA, "0", secondaryEmail, "createdBy", "1", "modifiedBy", "1", rateCode, notes, "1", "1", "123", "tenure", "attachment"]
    console.log(values)
    if ((accountName == undefined)) {
      console.log("ERROR ,Parameters missing")
    }
    // else if (validate(1, 1, 9, "SpecialChars", "isActive", isActive) || validate(1, 1, 9, "SpecialChars", "isBTCApproved", isBTCApproved) || validate(1, 1, 20, "SpecialChars", "commision", commision)) {
    //   console.log("resend parameter    // }")

    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.insertId);
        }
      });
    }
  });
};


/// This is the Function to add CompanyDetails to database.
const addCompanyDetails = async (companyName, contractStartDate, contractEndDate, contractRate) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO companyDetails (companyName, contractStartDate, contractEndDate,contractRate) VALUES (?,?,?,?)`;
    const values = [companyName, contractStartDate, contractEndDate, contractRate]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the Function to add folio details to database.
const addFolio = async (folioNumber, balance, reservationID, roomID, guestID, company, isSettled, isCancelled) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO folio(folioNumber ,balance, reservationID ,roomID, guestID, company/Agent, isSettled, isCancelled) VALUES (?,?,?,?,?,?,?,?)`;
    const values = [folioNumber, balance, reservationID, roomID, guestID, company / Agent, isSettled, isCancelled]
    if ((folioNumber == undefined || folioNumber == '') || (balance == undefined || balance == '') || (reservationID == undefined || reservationID == '') || (roomID == undefined || roomID == '') || (guestID == undefined || guestID == '') || (company == undefined || company == '') || (isSettled == undefined || isSettled == '') || (isCancelled == undefined || isCancelled == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate(1, 3, 9, "SpecialChars", "folioNumber", folioNumber) || validate(1, 3, 9, "SpecialChars", "balance", balance) || validate(1, 3, 20, "SpecialChars", "reservationID", reservationID) || validate(1, 3, 20, "SpecialChars", "roomID", roomID)) {
      console.log("resend parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add Rate to database.
const addRate = async (roomType, date, rateType, baseAmount, package, surgePrice) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO companyDetails (  roomType,  date, rateType, baseAmount,package, surgePrice) VALUES (?,?,?,?,?,?,?)`;
    const values = [roomType, date, rateType, baseAmount, package, surgePrice]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate(1, 1, 20, "SpecialChars", "hotelID", hotelID)) {
      console.log("resend parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add RateCodeRoomRate to database
const addRateCodeRoomRate = async (rateCodeID, roomTypeID, oneAdultPrice, twoAdultPrice, threeAdultPrice, extraAdultPrice, extraChildPrice) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO rateCodeRoomRate(rateCodeID ,roomTypeID, oneAdultPrice, twoAdultPrice, threeAdultPrice, extraAdultPrice, extraChildPrice ) VALUES (?,?,?,?,?,?,?)`;
    const values = [rateCodeID, roomTypeID, oneAdultPrice, twoAdultPrice, threeAdultPrice, extraAdultPrice, extraChildPrice]
    if ((rateCodeID == undefined || rateCodeID == '') || (roomTypeID == undefined || roomTypeID == '') || (oneAdultPrice == undefined || oneAdultPrice == '') || (twoAdultPrice == undefined || twoAdultPrice == '') || (threeAdultPrice == undefined || threeAdultPrice == '') || (extraAdultPrice == undefined || extraAdultPrice == '') || (extraChildPrice == undefined || extraChildPrice == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        console.log(error)
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add RateSetup to database
const addRateSetUp = async (rateCode, description, accounts, rateCategory, marketCode, source, roomType, package, transactionCodes, isActive, rateClassID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO rateSetUp(  rateCode, description, accounts,rateCategory,marketCode ,source, roomType, package, transactionCodes, isActive, rateClassID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [rateCode, description, accounts, rateCategory, marketCode, source, roomType, package, transactionCodes, isActive, rateClassID]
    if ((rateCode == undefined || rateCode == '') || (description == undefined || description == '') || (accounts == undefined || accounts == '') || (rateCategory == undefined || rateCategory == '') || (marketCode == undefined || marketCode == '') || (source == undefined || source == '') || (roomType == undefined || roomType == '') || (package == undefined || package == '') || (transactionCodes == undefined || transactionCodes == '') || (isActive == undefined || isActive == '') || (rateClassID == undefined || rateClassID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if (validate(1, 4, 9, "SpecialChars", "hotelID", hotelID)) {
      console.log("resend parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add room to database
const addRoom = async (roomNumber, roomStatus, frontOfficeStatus, reservationStatus, isActive, floorID, blockID, isSmokingDetails, roomTypeID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM room WHERE roomNumber = ? `;
    const values = [roomNumber];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('RoomNumber already exists'));
      }
      else {
        const sql = `INSERT INTO room (roomNumber, roomStatus, frontOfficeStatus, reservationStatus, isActive, floorID, blockID, isSmokingDetails, roomTypeID) VALUES (?,?,?,?,?,?,?,?,?)`;
        const insertValues = [roomNumber, roomStatus, frontOfficeStatus, reservationStatus, isActive, floorID, blockID, isSmokingDetails, roomTypeID];

        if ((roomNumber == undefined || roomNumber == '') || (roomStatus == undefined || roomStatus == '') || (frontOfficeStatus == undefined) || (reservationStatus == undefined) || (floorID == undefined) || (blockID == undefined) || (isSmokingDetails == undefined) || (roomTypeID == undefined)) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add Routing to database
const addRouting = async (routingType, entireStay, beginDate, endDate, routeToRoom, routeToWindow, reservationID, routingToGuest, routingToAccount, routingForGuest, paymentType, transactionCodes) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO routing (  routingType, entireStay, beginDate, endDate, routeToRoom, routeToWindow, reservationID, routingToGuest, routingToAccount, routingForGuest, paymentType, transactionCodes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [routingType, entireStay, beginDate, endDate, routeToRoom, routeToWindow, reservationID, routingToGuest, routingToAccount, routingForGuest, paymentType, transactionCodes]
    if ((routingType == undefined || routingType == '') || (entireStay == undefined || entireStay == '') || (beginDate == undefined || beginDate == '') || (endDate == undefined || endDate == '') || (routeToRoom == undefined || routeToRoom == '') || (routeToWindow == undefined || routeToWindow == '') || (reservationID == undefined || reservationID == '') || (routingToGuest == undefined || routingToGuest == '') || (routingToAccount == undefined || routingToAccount == '') || (routingForGuest == undefined || routingForGuest == '')(paymentType == undefined || paymentType == '') || (transactionCodes == undefined || transactionCodes == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


/// This is the Function to add specials to database
const addSpecials = async (preference, description, isActive, specialGroupID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM specials WHERE preference = ? `;
    const values = [preference];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Preference already exists'));
      }
      else {
        const sql = `INSERT INTO specials(preference, description, isActive,specialGroupID) VALUES (?,?,?,?)`;
        const insertValues = [preference, description, isActive, specialGroupID];

        if ((preference == undefined || preference == '') || (description == undefined || description == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add VisaDetails to database
const addVisaDetails = async (reservation, visaNumber, guestProfileID, issueDate, ExpiryDate) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM visaDetails WHERE visaNumber = ? `;
    const values = [visaNumber];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('visaNumber already exists'));
      }
      else {
        const sql = `INSERT INTO visaDetails(reservation, visaNumber, guestProfileID, issueDate, ExpiryDate) VALUES (?,?,?,?,?)`;
        const insertValues = [reservation, visaNumber, guestProfileID, issueDate, ExpiryDate];

        if ((reservation == undefined || reservation == '') || (visaNumber == undefined || visaNumber == '') || (guestProfileID == undefined || guestProfileID == '') || (issueDate == undefined || issueDate == '') || (ExpiryDate == undefined || ExpiryDate == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


///This is the Function to add Booking Details for reservation////////
const addBookingDetails = async (reservationType, roomType, waitlistReason, market, rate, waitlistComment, source, agent, origin, totalCostOfStay, arrivalTime, package, inventoryItems) => {
  return new Promise((resolve, reject) => {
    // console.log("hii")
    const sql = `INSERT INTO bookingDetails(reservationType, roomType,waitlistReason,market, rate, waitlistComment, source, agent, origin,totalCostOfStay, arrivalTime, package, inventoryItems) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [reservationType, roomType, waitlistReason, market, rate, waitlistComment, source, agent, origin, totalCostOfStay, arrivalTime, package, inventoryItems]
    console.log(values)
    if ((reservationType == undefined || reservationType == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};












// ------ MSTUSER3 ------ //
/// This Function is to add Adjust Transaction
const addAdjustTransaction = async (adjustBy, amount, percentage, reasonCodeID, reasonText, reference) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO adjustTransaction ( adjustBy, amount, percentage, reasonCodeID, reasonText, reference) VALUES ( ?, ?, ?, ?, ?, ?)`;
    const values = [adjustBy, amount, percentage, reasonCodeID, reasonText, reference]
    if ((adjustBy == undefined || adjustBy == '') || (amount == undefined || amount == '') || (percentage == undefined || percentage == '') || (reasonCodeID == undefined || reasonCodeID == '') || (reasonText == undefined || reasonText == '') || (reference == undefined || reference == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('adjustBy', adjustBy, 1, 20, '', '1')) || (validate('amount', amount, 1, 20, '', '1')) || (validate('percentage', percentage, 1, 20, '', '1')) || (validate('reasonCodeID', reasonCodeID, 1, 20, '', '1')) || (validate('reasonText', reasonText, 3, 255, '', '0')) || (validate('reference', reference, 1, 20, '', '1'))) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This is the Function to add Passer By details.
const addPasserBy = async (guestProfileID, marketCode, sourceCode, roomClass, modifiedAt, modifiedBy) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO passerBy ( guestProfileID, marketCode, sourceCode, roomClass, modifiedAt, modifiedBy ) VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [guestProfileID, marketCode, sourceCode, roomClass, modifiedAt, modifiedBy]

    if ((guestProfileID == undefined || guestProfileID == '') || (marketCode == undefined || marketCode == '') || (sourceCode == undefined || sourceCode == '') || (roomClass == undefined || roomClass == '') || (modifiedAt == undefined || modifiedAt == '') || (modifiedBy == undefined || modifiedBy == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('guestProfileID', guestProfileID, 1, 20, '', '1')) || (validate('marketCode', marketCode, 1, 20, '', '1')) || (validate('sourceCode', sourceCode, 1, 20, '', '1')) || (validate('roomClass', roomClass, 1, 20, '', '1')) || (validate('modifiedAt', modifiedAt, 3, 255, '', '0')) || (validate('modifiedBy', modifiedBy, 3, 255, '', '0'))) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


/// This is the Function to add Group Reservation. 
const addGroupReservation = async (groupName, arrivalDate, departureDate, paymentTypeID, companyID, travelAgentID, nights, status, sourceID, marketID, origin, reservationTypeID, rateCodeID, rate, packageID, PAXno, cutOfDate, totalRooms) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO groupReservation (groupName, arrivalDate, departureDate, paymentTypeID, companyID, travelAgentID, nights, status, sourceID, marketID, origin, reservationTypeID, rateCodeID, rate, packageID, PAXno, cutOfDate, totalRooms ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [groupName, arrivalDate, departureDate, paymentTypeID, companyID, travelAgentID, nights, status, sourceID, marketID, origin, reservationTypeID, rateCodeID, rate, packageID, PAXno, cutOfDate, totalRooms]

    if ((groupName == undefined || groupName == '') || (arrivalDate == undefined || arrivalDate == '') || (departureDate == undefined || departureDate == '') || (paymentTypeID == undefined || paymentTypeID == '') || (companyID == undefined || companyID == '') || (travelAgentID == undefined || travelAgentID == '') || (nights == undefined || nights == '') || (status == undefined || status == '') || (sourceID == undefined || sourceID == '') || (marketID == undefined || marketID == '') || (origin == undefined || origin == '') || (reservationTypeID == undefined || reservationTypeID == '') || (rateCodeID == undefined || rateCodeID == '') || (rate == undefined || rate == '') || (packageID == undefined || packageID == '') || (PAXno == undefined || PAXno == '') || (cutOfDate == undefined || cutOfDate == '') || (totalRooms == undefined || totalRooms == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('groupName', groupName, 1, 20, '', '1')) || (validate('arrivalDate', arrivalDate, 3, 30, 'SpecialChars', '0')) || (validate('departureDate', departureDate, 3, 30, 'SpecialChars', '0')) || (validate('paymentTypeID', paymentTypeID, 1, 20, '', '1')) || (validate('companyID', companyID, 1, 20, '', '1')) || (validate('travelAgentID', travelAgentID, 1, 20, '', '1')) || (validate('nights', nights, 1, 20, '', '1')) || (validate('status', status, 1, 10, '', '1')) || (validate('sourceID', sourceID, 1, 20, '', '1')) || (validate('marketID', marketID, 1, 10, '', '1')) || (validate('origin', origin, 3, 30, 'SpecialChars', '0')) || (validate('reservationTypeID', reservationTypeID, 1, 20, '', '1')) || (validate('rateCodeID', rateCodeID, 1, 20, '', '1')) || (validate('rate', rate, 1, 20, '', '1')) || (validate('packageID', packageID, 1, 20, '', '1')) || (validate('PAXno', PAXno, 1, 20, '', '1')) || (validate('cutOfDate', cutOfDate, 1, 20, '', '1')) || (validate('totalRooms', totalRooms, 1, 20, '', '1'))) {
      console.log("Invalid parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


// /// This is the Function to add Reservation. 
// const addReservation = async (guestProfileID, reservationID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults, numberOfChildren, numberOfRooms, roomTypeID, selectedRoom, rateCodeID, rate, roomToCharge, packageID, extrasID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, poNumber, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, preferences, comments, billingInstruction) => {
//   return new Promise((resolve, reject) => {
//     let query = `INSERT INTO reservation (guestProfileID, reservationID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults,numberOfChildren, numberOfRooms, roomTypeID, selectedRoom, rateCodeID, rate, roomToCharge, packageID, extrasID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, poNumber, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, preferences, comments, billingInstruction ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
//     let values = [guestProfileID, reservationID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults, numberOfChildren, numberOfRooms, roomTypeID, selectedRoom, rateCodeID, rate, roomToCharge, packageID, extrasID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, poNumber, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, preferences, comments, billingInstruction]

//     if ((guestProfileID == undefined || guestProfileID == '') || (reservationID == undefined || reservationID == '') || (sharingID == undefined || sharingID == '') || (arrivalDate == undefined || arrivalDate == '') || (numberOfNights == undefined || numberOfNights == '') || (departureDate == undefined || departureDate == '') || (numberOfAdults == undefined || numberOfAdults == '') || (numberOfChildren == undefined || numberOfChildren == '') || (numberOfRooms == undefined || numberOfRooms == '') || (roomTypeID == undefined || roomTypeID == '') || (selectedRoom == undefined || selectedRoom == '') || (rateCodeID == undefined || rateCodeID == '') || (rate == undefined || rate == '') || (roomToCharge == undefined || roomToCharge == '') || (packageID == undefined || packageID == '') || (extrasID == undefined || extrasID == '') || (blockCodeID == undefined || blockCodeID == '') || (ETA == undefined || ETA == '') || (ETD == undefined || ETD == '') || (reservationTypeID == undefined || reservationTypeID == '') || (marketID == undefined || marketID == '') || (sourceID == undefined || sourceID == '') || (origin == undefined || origin == '') || (paymentTypeID == undefined || paymentTypeID == '') || (cardDetailsID == undefined || cardDetailsID == '') || (balance == undefined || balance == '') || (splitBy == undefined || splitBy == '') || (companyID == undefined || companyID == '') || (agentID == undefined || agentID == '') || (bookerID == undefined || bookerID == '') || (printRate == undefined || printRate == '') || (reservationStatus == undefined || reservationStatus == '') || (commission == undefined || commission == '') || (poNumber == undefined || poNumber == '') || (totalDiscount == undefined || totalDiscount == '') || (totalBaseAmount == undefined || totalBaseAmount == '') || (totalExtraCharge == undefined || totalExtraCharge == '') || (totalTax == undefined || totalTax == '') || (totalPayment == undefined || totalPayment == '') || (stayTotal == undefined || stayTotal == '') || (travelAgentCommission == undefined || travelAgentCommission == '') || (totalCostOfStay == undefined || totalCostOfStay == '') || (pickUpID == undefined || pickUpID == '') || (dropID == undefined || dropID == '')) {
//       console.log("ERROR ,Parameters missing")
//     }
//     else if ((validate('hotelID', hotelID, 1, 20, '', '1')) || (validate('guestProfileID', guestProfileID, 1, 20, '', '1')) || (validate('reservationID', reservationID, 1, 20, '', '1')) || (validate('sharingID', sharingID, 1, 20, '', '1')) || (validate('arrivalDate', arrivalDate, 3, 30, 'SpecialChars', '0')) || (validate('numberOfNights', numberOfNights, 1, 20, '', '1')) || (validate('departureDate', departureDate, 3, 30, 'SpecialChars', '0')) || (validate('numberOfAdults', numberOfAdults, 1, 20, '', '1')) || (validate('numberOfChildren', numberOfChildren, 1, 20, '', '1')) || (validate('numberOfRooms', numberOfRooms, 1, 20, '', '1')) || (validate('roomTypeID', roomTypeID, 1, 10, '', '1')) || (validate('selectedRoom', selectedRoom, 1, 20, '', '1')) || (validate('rateCodeID', rateCodeID, 1, 20, '', '1')) || (validate('rate', rate, 1, 20, '', '1')) || (validate('rate', rate, 1, 20, '', '1')) || (validate('roomToCharge', roomToCharge, 1, 20, '', '1')) || (validate('packageID', packageID, 1, 20, '', '1')) || (validate('extrasID', extrasID, 1, 20, '', '1')) || (validate('blockCodeID', blockCodeID, 1, 20, '', '1')) || (validate('ETA', ETA, 3, 30, 'SpecialChars', '0')) || (validate('ETD', ETD, 3, 30, 'SpecialChars', '0')) || (validate('reservationTypeID', reservationTypeID, 1, 20, '', '1')) || (validate('marketID', marketID, 1, 20, '', '1')) || (validate('sourceID', sourceID, 1, 20, '', '1')) || (validate('origin', origin, 3, 30, 'SpecialChars', '0')) || (validate('paymentTypeID', paymentTypeID, 1, 20, '', '1')) || (validate('cardDetailsID', cardDetailsID, 1, 20, '', '1')) || (validate('balance', balance, 1, 20, '', '1')) || (validate('splitBy', splitBy, 1, 20, '', '1')) || (validate('companyID', companyID, 1, 20, '', '1')) || (validate('agentID', agentID, 1, 20, '', '1')) || (validate('bookerID', bookerID, 1, 20, '', '1')) || (validate('printRate', printRate, 1, 1, '', '1')) || (validate('reservationStatus', reservationStatus, 3, 45, 'SpecialChars', '0')) || (validate('commission', commission, 1, 10, 'SpecialChars', '0')) || (validate('poNumber', poNumber, 3, 30, 'SpecialChars', '0')) || (validate('totalDiscount', totalDiscount, 3, 20, '', '1')) || (validate('totalBaseAmount', totalBaseAmount, 1, 20, '', '1')) || (validate('totalExtraCharge', totalExtraCharge, 1, 20, '', '1')) || (validate('totalTax', totalTax, 1, 20, '', '1')) || (validate('totalPayment', totalPayment, 1, 20, '', '1')) || (validate('stayTotal', stayTotal, 1, 20, '', '1')) || (validate('travelAgentCommission', travelAgentCommission, 1, 20, '', '1')) || (validate('totalCostOfStay', totalCostOfStay, 1, 20, '', '1')) || (validate('pickUpID', pickUpID, 1, 20, '', '1')) || (validate('dropID', dropID, 1, 20, '', '1'))) {
//       console.log("Invalid parameter")
//     }
//     else {
//       connection.query(query, values, (error, result) => {
//         if (error) {
//           reject(error);
//         }
//         else {
//           resolve(result);
//         }
//       });
//     })
// }


/// This is the Function to add Source details
const addSource = async (sourceCode, description, isActive, sourceGroupID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM source WHERE sourceCode = ?`;
    const values = [sourceCode];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Source Code already exists'));
      }
      else {
        const sql = `INSERT INTO source (sourceCode, description, isActive, sourceGroupID) VALUES (?,?,?,?)`;
        const insertValues = [sourceCode, description, isActive, sourceGroupID];

        if ((sourceCode == undefined || sourceCode == '') || (isActive == undefined || isActive == '') || (sourceGroupID == undefined || sourceGroupID == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add Guest details
const addGuest = async (firstName, lastName, salutation, guestID) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO guestBasicProfile ( firstName, lastName, salutation, guestID ) VALUES (?, ?, ?, ?)`;
    let values = [firstName, lastName, salutation, guestID]

    if ((firstName == undefined || firstName == '') || (lastName == undefined || lastName == '') || (guestID == undefined || guestID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('firstName', firstName, 3, 30, 'SpecialChars', '2')) || (validate('lastName', lastName, 3, 30, 'SpecialChars', '2')) || (validate('guestID', guestID, 1, 20, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}



/// This is the Function to add Source Group details
const addSourceGroup = async (sourceGroup, description, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM sourceGroup WHERE sourceGroup = ?`;
    const values = [sourceGroup];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Source Group already exists'));
      }
      else {
        const sql = `INSERT INTO sourceGroup (sourceGroup, description, isActive) VALUES (?,?,?)`;
        const insertValues = [sourceGroup, description, isActive];
        console.log(insertValues)

        if ((sourceGroup == undefined || sourceGroup == '') || (description == undefined || description == '') || (isActive == undefined || isActive == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


/// This is the Function to add Document details
const addDocumentDetails = async (guestProfileID, idType, issuePlace, idFile, issueDate, expiryDate) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO documentDetails ( guestProfileID, idType, issuePlace, idFile, issueDate, expiryDate ) VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [guestProfileID, idType, issuePlace, idFile, issueDate, expiryDate]

    if ((guestProfileID == undefined || guestProfileID == '') || (idType == undefined || idType == '') || (issuePlace == undefined || issuePlace == '') || (idFile == undefined || idFile == '') || (issueDate == undefined || issueDate == '') || (expiryDate == undefined || expiryDate == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('guestProfileID', guestProfileID, 1, 20, '', '1')) || (validate('idType', idType, 3, 30, 'SpecialChars', '0')) || (validate('issuePlace', issuePlace, 3, 30, 'SpecialChars', '2')) || (validate('idFile', idFile, 3, 255, '', '0')) || (validate('issueDate', issueDate, 1, 30, 'SpecialChars', '0')) || (validate('expiryDate', expiryDate, 1, 30, 'SpecialChars', '0'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the Function to add GuestAdddress details
const addGuestAddress = async (guestProfileID, country, nationality, state, city, postalCode, gstID, phoneNumber, email) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO guestAddress ( guestProfileID, country, nationality, state, city, postalCode, gstID, phoneNumber, email ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [guestProfileID, country, nationality, state, city, postalCode, gstID, phoneNumber, email]

    if ((guestProfileID == undefined || guestProfileID == '') || (country == undefined || country == '') || (nationality == undefined || nationality == '') || (state == undefined || state == '') || (city == undefined || city == '') || (postalCode == undefined || postalCode == '') || (gstID == undefined || gstID == '') || (phoneNumber == undefined || phoneNumber == '') || (email == undefined || email == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('guestProfileID', guestProfileID, 1, 20, '', '1')) || (validate('country', country, 3, 30, 'SpecialChars', '2')) || (validate('nationality', nationality, 3, 30, 'SpecialChars', '2')) || (validate('state', state, 3, 30, 'SpecialChars', '2')) || (validate('city', city, 3, 30, 'SpecialChars', '2')) || (validate('postalCode', postalCode, 3, 30, '', '1')) || (validate('gstID', gstID, 1, 30, 'SpecialChars', '0')) || (validate('phoneNumber', phoneNumber, 1, 15, '', '1')) || (validate('email', email, 1, 30, '', '0'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the Function to add GuestPreference details
const addGuestPreference = async (guestProfileID, preferenceID) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO guestPreference ( guestProfileID, preferenceID ) VALUES (?, ?, ?)`;
    let values = [guestProfileID, preferenceID]

    if ((guestProfileID == undefined || guestProfileID == '') || (preferenceID == undefined || preferenceID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('guestProfileID', guestProfileID, 1, 20, '', '1')) || (validate('preferenceID', preferenceID, 1, 20, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the Function to add Membership Details 
const addMembershipDetails = async (guestID, membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate, isPrimary) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO membershipDetails ( guestID,membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate, isPrimary) VALUES (?, ?, ?, ?, ?, ?,?,?)`;
    let values = [guestID, membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate, isPrimary]

    if ((nameOnCard == undefined || nameOnCard == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}
// const addMembershipDetails = async (membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate) => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM membershipDetails WHERE guestID = ? `;
//     const values = [guestID];

//     connection.query(query, values, (error, result) => {
//       if (error) {
//         reject(error);
//       }
//       else if (result.length > 0) {
//         // The floor and blockID already exist
//         reject(new Error('Membership Details already exists'));
//       }
//       else {
//         const sql = `INSERT INTO membershipDetails (membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate) VALUES (?,?,?,?,?,?)`;
//         const insertValues = [membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate];

//         if (nameOnCard == undefined || nameOnCard == '') {
//           reject(new Error('Parameters missing'));
//         } else {
//           connection.query(sql, insertValues, (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           });
//         }
//       }
//     });
//   });
// };


////////////// This is the Function to add MembershipLevel details
// const addMembershipLevel = async (membershipLevel, description, isActive) => {
//   return new Promise((resolve, reject) => {

//     let query = `INSERT INTO membershipLevel ( membershipLevel, description, isActive ) VALUES ( ?, ?, ?)`;
//     let values = [membershipLevel, description, isActive]

//     if ((membershipLevel == undefined || membershipLevel == '') || (isActive == undefined || isActive == '')) {
//       console.log("ERROR ,Parameters missing")
//     }
//     else if ((validate('membershipLevel', membershipLevel, 3, 30, 'SpecialChars', '0')) || (validate('isActive', isActive, 1, 1, '', '1'))) {
//       console.log("Invalid format")
//     }
//     else {
//       connection.query(query, values, (err, result) => {
//         if (err) {
//           reject(err)
//         }
//         else {
//           resolve(result)
//         }
//       })
//     }
//   })
// }
const addMembershipLevel = async (membershipLevel, description, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM membershipLevel WHERE membershipLevel = ? `;
    const values = [membershipLevel];

    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        // The floor and blockID already exist
        reject(new Error('Membership Level already exists'));
      }
      else {
        const sql = `INSERT INTO membershipLevel (membershipLevel, description, isActive) VALUES (?,?,?)`;
        const insertValues = [membershipLevel, description, isActive];

        if (membershipLevel == undefined || membershipLevel == '') {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};

////////////// This is the Function to add MembershipType details
const addMembershipType = async (membershipType, description, isActive) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO membershipType ( membershipType, description, isActive ) VALUES (?, ?, ?)`;
    let values = [membershipType, description, isActive]

    if ((membershipType == undefined || membershipType == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('membershipType', membershipType, 3, 30, 'SpecialChars', '0')) || (validate('isActive', isActive, 1, 1, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}
// const addMembershipType = async (membershipType, description, isActive) => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM membershipType WHERE membershipType = ?`;
//     const values = [membershipType];

//     connection.query(query, values, (error, result) => {
//       if (error) {
//         reject(error);
//       } 
//       else if (result.length > 0) {
//         reject(new Error('membershipType already exists'));
//       } 
//       else {
//         const sql = `INSERT INTO membershipType (membershipType, description, isActive) VALUES (?,?,?)`;
//         const insertValues = [membershipType, description, isActive];

//         if ((membershipType == undefined || membershipType == '') ) {
//           reject(new Error('Parameters missing'));
//         } else {
//           connection.query(sql, insertValues, (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           });
//         }
//       }
//     });
//   });
// };

////////////// This is the Function to add PaymentType details
const addPaymentType = async (paymodeTypeCode, description, isActive, transactionCodeID) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO paymentType (  paymodeTypeCode, description, isActive, transactionCodeID ) VALUES (?, ?, ?, ?)`;
    let values = [paymodeTypeCode, description, isActive, transactionCodeID]

    if ((paymodeTypeCode == undefined || paymodeTypeCode == '') || (description == undefined || description == '') || (isActive == undefined || isActive == '') || (transactionCodeID == undefined || transactionCodeID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('paymodeTypeCode', paymodeTypeCode, 3, 30, 'SpecialChars', '0')) || (validate('description', description, 3, 30, 'SpecialChars', '0')) || (validate('isActive', isActive, 1, 1, '', '1')) || (validate('transactionCodeID', transactionCodeID, 1, 9, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the Function to add PickupAndDrop details
const addPickupAndDrop = async (type, date, time, stationCode, carrierCode, transportType, remarks) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO pickupdropDetails (  type, date, time, stationCode, carrierCode, transportType, remarks ) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
    let values = [type, date, time, stationCode, carrierCode, transportType, remarks]

    if ((type == undefined || type == '') || (date == undefined || date == '') || (time == undefined || time == '') || (stationCode == undefined || stationCode == '') || (carrierCode == undefined || carrierCode == '') || (transportType == undefined || transportType == '') || (remarks == undefined || remarks == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('type', type, 3, 255, 'SpecialChars', '2')) || (validate('date', date, 3, 30, 'SpecialChars', '2')) || (validate('time', time, 3, 30, 'SpecialChars', '2')) || (validate('stationCode', stationCode, 3, 255, 'SpecialChars', '2')) || (validate('carrierCode', carrierCode, 3, 255, 'SpecialChars', '2')) || (validate('transportType', transportType, 3, 255, 'SpecialChars', '2'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the Function to add ReservationPreferenceGroup details
const addReservationPreferenceGroup = async (preferenceGroup, description, isActive) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO reservationPreferenceGroup (  preferenceGroup, description, isActive ) VALUES ( ?, ?, ?)`;
    let values = [preferenceGroup, description, isActive]

    if ((preferenceGroup == undefined || preferenceGroup == '') || (isActive == undefined || isActive == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('preferenceGroup', preferenceGroup, 3, 255, '', '0')) || (validate('isActive', isActive, 1, 1, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the Function to add ReservationPreference details
const addReservationPreference = async (preference, description, isActive, preferenceGroupID) => {
  return new Promise((resolve, reject) => {

    let query = `INSERT INTO reservationPreference ( preference, description, isActive, preferenceGroupID ) VALUES ( ?, ?, ?, ?)`;
    let values = [preference, description, isActive, preferenceGroupID]

    if ((preference == undefined || preference == '') || (isActive == undefined || isActive == '') || (preferenceGroupID == undefined || preferenceGroupID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('preference', preference, 3, 255, '', '0')) || (validate('isActive', isActive, 1, 1, '', '1')) || (validate('preferenceGroupID', preferenceGroupID, 1, 20, '', '1'))) {
      console.log("Invalid format")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}





/////// New Table Functions and API's


////////////// This is the Function to add paymentCode to database
const addPaymentCode = async (paymentTypeCode, description, isActive, transactionCode) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO paymentCode (paymentTypeCode, description, isActive, transactionCode) VALUES (?,?,?,?)`;
    const values = [paymentTypeCode, description, isActive, transactionCode]
    console.log(values)
    if ((paymentTypeCode == undefined || paymentTypeCode == '') || (isActive == undefined || isActive == '') || (transactionCode == undefined || transactionCode == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};



////////////// This is the Function to add group to database
// const addGroup = async (name) => {
//   return new Promise((resolve, reject) => {
//     const sql = `INSERT INTO groups(name) VALUES (?)`;
//     const values = [name]
//     console.log(values)
//     if ((name == undefined || name == '') ) {
//       console.log("ERROR ,Parameters missing")
//     }
//     else {
//       connection.query(sql, values, (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       });
//     }
//   });
// };
const addGroup = async (groupCode, description, costCenter, isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM groups WHERE groupCode = ? `;
    const values = [groupCode];
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('Group Code already exists'));
      }
      else {
        const sql = `INSERT INTO groups (groupCode,description,costCenter, isActive) VALUES (?,?,?,?)`;
        const insertValues = [groupCode, description, costCenter, isActive];

        if ((groupCode == undefined || groupCode == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


////////////// This is the Function to add tax to database
// const addTax= async (taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note, isActive) => {
//   return new Promise((resolve, reject) => {
//     const sql = `INSERT INTO tax (taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note, isActive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
//     const values = [taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note, isActive]
//     console.log(values)
//     if ((taxName == undefined || taxName == '') || (taxCode == undefined || taxCode == '') || (appliesFrom == undefined || appliesFrom == '')) {
//       console.log("ERROR ,Parameters missing")
//     }
//     else {
//       connection.query(sql, values, (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       });
//     }
//   });
// };
const addTax = async (taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note,
  isActive) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tax WHERE taxName = ? `;
    const values = [taxName];
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else if (result.length > 0) {
        reject(new Error('taxName already exists'));
      }
      else {
        const sql = `INSERT INTO tax (taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, 
        applyTaxOnRackRate, note, isActive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const insertValues = [taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate,
          note, isActive];

        if ((taxName == undefined || taxName == '') || (taxCode == undefined || taxCode == '') || (appliesFrom == undefined || appliesFrom == '')) {
          reject(new Error('Parameters missing'));
        } else {
          connection.query(sql, insertValues, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};

////////////// This is the Function to add tax to database
const addTaxGeneration = async (fromAmount, toAmount, percentage, taxID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO taxGeneration (fromAmount, toAmount, percentage, taxID) VALUES (?,?,?,?)`;
    const values = [fromAmount, toAmount, percentage, taxID]
    console.log(values)
    if ((fromAmount == undefined || fromAmount == '') || (toAmount == undefined || toAmount == '') || (percentage == undefined || percentage == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


////////////// This is the Function to add rateCodeExtras to database
const addRateCodeExtas = async (rateCodeID, extraID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO rateCodeExtras (rateCodeID, extraID)) VALUES (?,?)`;
    const values = [rateCodeID, extraID]
    if ((rateCodeID == undefined || rateCodeID == '') || (extraID == undefined || extraID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


////////////// This is the Function to add rateCodeExtras to database
const addRateCodeRoomTypes = async (rateCodeID, roomTypeID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO rateCodeRoomTypes (rateCodeID, roomTypeID)) VALUES (?,?)`;
    const values = [rateCodeID, roomTypeID]
    if ((rateCodeID == undefined || rateCodeID == '') || (roomTypeID == undefined || roomTypeID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};



////////////// This is the Function to add Invoice to database
const addInvoice = async (folio, invoiceDate, invoiceAmount, isCancelled, reservationID, guest, company, settelment, agent, source, isRevoked) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO invoice (folio, invoiceDate, invoiceAmount, isCancelled, reservationID, guest, company, settelment, agent, source, isRevoked) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [folio, invoiceDate, invoiceAmount, isCancelled, reservationID, guest, company, settelment, agent, source, isRevoked]
    if ((invoiceDate == undefined || invoiceDate == '') || (invoiceAmount == undefined || invoiceAmount == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};



////////////// This is the Function to add Assign Room to Occupancy
const addAssignRoomToOccupancy = async (reservationID, fromDate, toDate, roomID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO roomOccupancy (reservationID, fromDate, toDate, roomID) VALUES (?,?,?,?)`;
    const values = [reservationID, fromDate, toDate, roomID]
    if ((fromDate == undefined || fromDate == '') || (toDate == undefined || toDate == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};

















//-----------// Configuration Insert API (POST) //-----------//



// --------------// MSTUSER1//---------------------------//

////// API for add Extra
app.post('/addextra', async (req, res) => {
  try {
    const { extraCode, description, groupID, subGroupID, remarks, type, percentage, amount, pieces, trips, isActive, } = req.body;
    const result = await addExtra(extraCode, description, groupID, subGroupID, remarks, type, percentage, amount, pieces, trips, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Room Inventory
app.post('/addroominventory', async (req, res) => {
  try {
    const { roomID, numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID } = req.body;
    const result = await addRoomInventory(roomID, numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID);
    console.log(res)
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Added successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
});



////// API for add Room Inventory Forecast
app.post('/addroominventoryforecast', async (req, res) => {
  try {
    const { roomType, date, noOfUnits } = req.body;
    const result = await addRoomInventoryForecast(roomType, date, noOfUnits);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Inventory Forecast added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


app.post('/addroomtype', async (req, res) => {
  try {
    const { roomType, maxAdults, maxChildren, totalNumOfRooms, isActive, roomClassID } = req.body;
    const result = await addRoomType(roomType, maxAdults, maxChildren, totalNumOfRooms, isActive, roomClassID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Type added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Room Wise Inventory
app.post('/addroomwiseinventory', async (req, res) => {
  try {
    const { roomNo, date, status } = req.body;
    const result = await addRoomWiseInventory(roomNo, date, status);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Wise Inventory added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Transaction Code
app.post('/addtransactioncode', async (req, res) => {
  try {
    const { transactionCode, description, groupID, subGroupID,
      baseRate, taxPercentage, discountAllowed, isAllowance, isActive, allowanceCodeID,
      commissionOrServiceChargePercentage } = req.body;
    const result = await addTransactionCode(transactionCode, description, groupID, subGroupID,
      baseRate, taxPercentage, discountAllowed, isAllowance, isActive, allowanceCodeID,
      commissionOrServiceChargePercentage);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Transaction Code added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})




// --------------// MSTUSER2//---------------------------//

/////////////// API TO ADD Block Details
app.post('/block', async (req, res) => {
  try {
    const { block } = req.body;
    const result = await addBlock(block);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted Block Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)

    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      error: error
    })
  }
});


/////////////// API TO ADD Floor Details
app.post('/floor', async (req, res) => {
  try {
    const { floor, blockID } = req.body;
    console.log(floor, blockID)
    const result = await addFloor(floor, blockID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted Floor Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD hotelDetails
app.post('/hotelDetails', async (req, res) => {
  try {
    const { name, email, phoneNumber, address, city, state, postalCode, country, logo, fax, currency, hotelGroup } = req.body;
    const result = await addHotelDetails(name, email, phoneNumber, address, city, state, postalCode, country, logo, fax, currency, hotelGroup);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added hotelDetails Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD MarketCode Details
app.post('/marketCode', async (req, res) => {
  try {
    const { marketCode, description, isActive, marketGroupID } = req.body;
    const result = await addMarketCode(marketCode, description, isActive, marketGroupID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted MarketGroup Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: res.statusCode,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD marketGroup Details
app.post('/marketGroup', async (req, res) => {
  try {
    const { marketGroup, description, isActive } = req.body;
    const result = await addMarketGroup(marketGroup, description, isActive);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added MarketCode Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD NightAudit Details
app.post('/nightAudit', async (req, res) => {
  try {
    const { businessDate, notes, createdAt, createdBy, countryAndStateCheck, arrivalsNotYetCheckedIn, depaturesNotCheckedOut, rollingBusinessDate, postingRoomAndTax, printingReports } = req.body;

    const result = await addNightAudit(businessDate, notes, createdAt, createdBy, countryAndStateCheck, arrivalsNotYetCheckedIn, depaturesNotCheckedOut, rollingBusinessDate, postingRoomAndTax, printingReports);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted nightAudit Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD packageGroup Details
app.post('/packagegroup', async (req, res) => {
  try {
    const { packageGroup, description, isActive } = req.body;
    const result = await addPackageGroup(packageGroup, description, isActive);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted PackageGroup Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateClass Details
app.post('/rateClass', async (req, res) => {
  try {
    const { rateClass, description, isActive } = req.body;
    const result = await addRateClass(rateClass, description, isActive);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted rateCategory Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateCategory Details
app.post('/rateCategory', async (req, res) => {
  try {
    const { rateCategory, description, isActive, rateClassID } = req.body;
    const result = await addRateCategory(rateCategory, description, isActive, rateClassID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted rateCategory Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateCode Details
app.post('/rateCode', async (req, res) => {
  try {
    const { rateCode, description, beginSellDate, endSellDate, daysApplicable, printRate, dayUse, discount, discountAmount, discountPercentage, complementary, houseUse, isActive, marketID, packageID, packageTransactionCodeID, rateCategoryID, sourceID, tansactionCodeID } = req.body;
    const result = await addRateCode(rateCode, description, beginSellDate, endSellDate, daysApplicable, printRate, dayUse, discount, discountAmount, discountPercentage, complementary, houseUse, isActive, marketID, packageID, packageTransactionCodeID, rateCategoryID, sourceID, tansactionCodeID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted rateCode Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateSummary Details
app.post('/RateSummary', async (req, res) => {
  try {
    const { reservationID, date, rateCodeID, dailyDetails, roomRevenue, roomTax, packageRevenue, packageTax, subTotal, totalTaxGenerated, total } = req.body;
    const result = await addRateSummary(reservationID, date, rateCodeID, dailyDetails, roomRevenue, roomTax, packageRevenue, packageTax, subTotal, totalTaxGenerated, total);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted RateSummary Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD ReservationGroup Details
app.post('/ReservationGroup', async (req, res) => {
  try {
    const { groupCode, description, costCenter, isActive } = req.body;
    const result = await addReservationGroup(groupCode, description, costCenter, isActive);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted ReservationGroup Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD SubGroup Details
app.post('/SubGroup', async (req, res) => {
  try {
    const { subGroup, description, groupID, isActive, } = req.body;
    const result = await addSubGroup(subGroup, description, groupID, isActive);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted SubGroup Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD User Details
app.post('/user', async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, isAccountManager, isActive, isStaff, isSuperUser } = req.body;
    const result = await adduser(firstName, lastName, email, password, department, isAccountManager, isActive, isStaff, isSuperUser);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted user Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



/////////////// API TO ADD user Details
app.post('/addAccounts', async (req, res) => {
  try {
    const { accountName, accountType, commision, email, phoneNumber, addressLine1, addressLine2, country, state, city, postalCode, isActive, gstID, IATA, isBTCApproved, secondaryEmail, createdBy, createdAt, modifiedBy, modifiedAt, rateCode, notes, accountManagerID, financialAssociateID, creditLimit, tenure, attachment } = req.body;
    const result = await addAccounts(accountName, accountType, commision, email, phoneNumber, addressLine1, addressLine2, country, state, city, postalCode, isActive, gstID, IATA, isBTCApproved, secondaryEmail, createdBy, createdAt, modifiedBy, modifiedAt, rateCode, notes, accountManagerID, financialAssociateID, creditLimit, tenure, attachment);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted accounts Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD CompanyDetails Details
app.post('/CompanyDetails', async (req, res) => {
  try {
    const { companyName, contractStartDate, contractEndDate, contractRate } = req.body;
    const result = await addCompanyDetails(companyName, contractStartDate, contractEndDate, contractRate);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted CompanyDetails Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD folio Details
app.post('/folio', async (req, res) => {
  try {
    const { folioNumber, balance, reservationID, roomID, guestID, company, isSettled, isCancelled } = req.body;
    const result = await addFolio(folioNumber, balance, reservationID, roomID, guestID, company, isSettled, isCancelled);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted folio Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD Rate Details
app.post('/rate', async (req, res) => {
  try {
    const { roomType, date, rateType, baseAmount, package, surgePrice } = req.body;
    const result = await addRate(roomType, date, rateType, baseAmount, package, surgePrice);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted Rate Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateCodeRoomRate Details
app.post('/addrateCodeRoomRate', async (req, res) => {
  try {
    const { rateCodeID, roomTypeID, oneAdultPrice, twoAdultPrice, threeAdultPrice, extraAdultPrice, extraChildPrice } = req.body;

    const result = await addRateCodeRoomRate(rateCodeID, roomTypeID, oneAdultPrice, twoAdultPrice, threeAdultPrice, extraAdultPrice, extraChildPrice);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted RateCodeRoomRate Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateSetup Details
app.post('/RateSetup', async (req, res) => {
  try {
    const { rateCode, description, accounts, rateCategory, marketCode, source, roomType, package, transactionCodes, isActive, rateClassID } = req.body;
    const result = await addRateSetUp(rateCode, description, accounts, rateCategory, marketCode, source, roomType, package, transactionCodes, isActive, rateClassID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted RateSetup Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD Room Details
app.post('/room', async (req, res) => {
  try {
    const { roomNumber, roomStatus, frontOfficeStatus, reservationStatus, isActive, floorID, blockID, isSmokingDetails, roomTypeID } = req.body;
    const result = await addRoom(roomNumber, roomStatus, frontOfficeStatus, reservationStatus, isActive, floorID, blockID, isSmokingDetails, roomTypeID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted Room Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD Routing Details
app.post('/Routing', async (req, res) => {
  try {
    const { routingType, entireStay, beginDate, endDate, routeToRoom, routeToWindow, reservationID, routingToGuest, routingToAccount, routingForGuest, paymentType, transactionCodes } = req.body;
    const result = await addRouting(routingType, entireStay, beginDate, endDate, routeToRoom, routeToWindow, reservationID, routingToGuest, routingToAccount, routingForGuest, paymentType, transactionCodes);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted Routing Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD specials Details
app.post('/specials', async (req, res) => {
  try {
    const { preference, description, isActive, specialGroupID } = req.body;
    const result = await addSpecials(preference, description, isActive, specialGroupID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfull",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD VisaDetails Details
app.post('/visaDetails', async (req, res) => {
  try {
    const { reservation, visaNumber, guestProfileID, issueDate, ExpiryDate } = req.body;
    const result = await addVisaDetails(reservation, visaNumber, guestProfileID, issueDate, ExpiryDate);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully posted VisaDetails Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});





/////////////// API TO ADD guestProfile Details
app.post('/guestProfile', async (req, res) => {
  try {
    const { reservationID, salutation, name, email, phoneNumber, gstID, nationality, dob, vipID, addressOne, addressTwo, anniversary, companyID,
      country, state, notes, city, postalCode, guestpreferencenotes, guestType, guestStatus, lastVisit, isActive, isBlackListed, lastRateID, lastRoomID, negotiatedRateID } = req.body;
    const result = await addGuestProfile(reservationID, salutation, name, email, phoneNumber, gstID, nationality, dob, vipID, addressOne, addressTwo, anniversary, companyID,
      country, state, notes, city, postalCode, guestpreferencenotes, guestType, guestStatus, lastVisit, isActive, isBlackListed, lastRateID, lastRoomID, negotiatedRateID);

    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added guestProfile Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});




/////////////// API TO ADD guestProfile Details
app.post('/bookingDetails', async (req, res) => {
  try {
    const { reservationType, roomType, waitlistReason, market, rate, waitlistComment, source, agent, origin, totalCostOfStay, arrivalTime, package, inventoryItems } = req.body;
    const result = await addBookingDetails(reservationType, roomType, waitlistReason, market, rate, waitlistComment, source, agent, origin, totalCostOfStay, arrivalTime, package, inventoryItems);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added guestProfile Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});

















//-----------// Other Insert API (POST) //-----------//


// --------- MSTUSER1 --------- //

////// API for add Booker
app.post('/addbooker', async (req, res) => {
  try {
    const { account, name, emailID, phone, addressLine1, addressLine2, country, state, city, postalCode, isActive } = req.body;
    const result = await addBooker(account, name, emailID, phone, addressLine1, addressLine2, country, state, city, postalCode, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booker Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Cancellation
app.post('/addcancellation', async (req, res) => {
  try {
    const { reservation, groupReservation, reasonCode, remarks, cancellationType, paymentTransaction, cancellationDate } = req.body;
    const result = await addCancellation(reservation, groupReservation, reasonCode, remarks, cancellationType, paymentTransaction, cancellationDate);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Cancellation Done Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Out Of Order / Service
app.post('/addOutOfOrderOrService', async (req, res) => {
  try {
    const { fromDate, toDate, status, returnStatus, remarks, reasonID, roomID } = req.body;
    const result = await addOutOfOrderOrService(fromDate, toDate, status, returnStatus, remarks, reasonID, roomID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Out Of Order / Service added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Commission
app.post('/addcommission', async (req, res) => {
  try {
    const { commissionCode, description, commissionPercentage, tax, isActive } = req.body;
    const result = await addCommission(commissionCode, description, commissionPercentage, tax, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Commission added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Change Room
app.post('/addchangeroom', async (req, res) => {
  try {
    const { clientID, bookingID, floor, guestName, roomType, oldRoomNumber, newRoomNumber } = req.body;
    const result = await addChangeRoom(clientID, bookingID, floor, guestName, roomType, oldRoomNumber, newRoomNumber);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Change Room added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Documents
app.post('/adddocuments', upload.fields([{ name: 'document' }]), async (req, res) => {
  try {
    const { documentType, reservation, invoice } = req.body;
    let document = (req.files['document']);
    const result = await addDocuments(documentType, reservation, invoice, document[0].originalname);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Documents added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Document Type
app.post('/adddocumenttype', async (req, res) => {
  try {
    const { documentType } = req.body;
    const result = await addDocumentType(documentType);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Documents added Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Extra Group
app.post('/addextragroup', async (req, res) => {
  try {
    const { extraID, groupID } = req.body;
    const result = await addExtraGroup(extraID, groupID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra Group added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Fixed Charge
app.post('/addfixedcharge', async (req, res) => {
  try {
    const { reservation, guestProfileID, frequency, beginDate, endDate, transactionCode, amount, quantity, supplement } = req.body;
    const result = await addFixedCharge(reservation, guestProfileID, frequency, beginDate, endDate, transactionCode, amount, quantity, supplement);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Fixed Charge added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Forex
app.post('/addforex', async (req, res) => {
  try {
    const { room, reservation, guestProfileID, currency, rateForTheDay, amount, equivalentAmount, CGST, SGST, total, remarks } = req.body;
    const result = await addForex(room, reservation, guestProfileID, currency, rateForTheDay, amount, equivalentAmount, CGST, SGST, total, remarks);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Forex added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add group reservation room type
app.post('/addgroupreservationroomtype', async (req, res) => {
  try {
    const { groupReservation, roomType, rateCode, rateAmount, numberOfRooms, numberOfPickedRooms } = req.body;
    const result = await addGroupReservationRoomType(groupReservation, roomType, rateCode, rateAmount, numberOfRooms, numberOfPickedRooms);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Group Reservation room type added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Reservatiion Type
app.post('/addreservationtype', async (req, res) => {
  try {
    const { reservationType, isActive } = req.body;
    // console.log(reservationType,isActive)
    const result = await addReservationType(reservationType, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reservation Type added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Rooms Class
app.post('/addroomclass', async (req, res) => {
  try {
    const { roomClass, isActive } = req.body;
    const result = await addRoomClass(roomClass, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Class added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Split Transaction
app.post('/addsplittransaction', async (req, res) => {
  try {
    const { transaction, splitBy, amount, percentage, splitAmount, splitAmountWithTax } = req.body;
    const result = await addSplitTransaction(transaction, splitBy, amount, percentage, splitAmount, splitAmountWithTax);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Split Transaction added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Ticket
app.post('/addticket', upload.fields([{ name: 'fileUpload' }]), async (req, res) => {
  try {
    const { createdBy, createdAt, room, area, category, priority, subject, description, status, agent, SLADateAndTime } = req.body;
    let fileUpload = (req.files['fileUpload']);
    const result = await addTicket(createdBy, createdAt, room, area, category, priority, subject, description, status, agent, SLADateAndTime, fileUpload[0].originalname);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Ticket added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Ticket Category
app.post('/addticketcategory', async (req, res) => {
  try {
    const { ticketCategoryCode, description } = req.body;
    const result = await addTicketCategory(ticketCategoryCode, description);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Ticket Category added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Transaction
app.post('/addtransaction', async (req, res) => {
  try {
    const { folio, transactionCode, reservation, guestProfileID, companyORAgent, baseAmount, createdAt, createdBy, remarks, room, quantity, package, rateCode, supplement, date, description, discountAmount, discountPercentage, transactionType, isDeposit, taxPercentage, CGST, SGST, total, serviceChargeORCommissionPercentage, serviceChargeORCommission, serviceChargeORCommissionTaxPercentage, serviceChargeORCommissionCGST, serviceChargeORCommissionSGST, totalWithServiceChargeORCommission, isServiceChargeCancelled, isCancelled, POSBillNumber, POSSession, allowanceTransaction, invoice, card } = req.body;
    const result = await addTransaction(folio, transactionCode, reservation, guestProfileID, companyORAgent, baseAmount, createdAt, createdBy, remarks, room, quantity, package, rateCode, supplement, date, description, discountAmount, discountPercentage, transactionType, isDeposit, taxPercentage, CGST, SGST, total, serviceChargeORCommissionPercentage, serviceChargeORCommission, serviceChargeORCommissionTaxPercentage, serviceChargeORCommissionCGST, serviceChargeORCommissionSGST, totalWithServiceChargeORCommission, isServiceChargeCancelled, isCancelled, POSBillNumber, POSSession, allowanceTransaction, invoice, card);

    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Transaction added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add WaitList
app.post('/addwaitlist', async (req, res) => {
  try {
    const { reservation, waitListSequence, date } = req.body;
    const result = await addWaitList(reservation, waitListSequence, date);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Wait List added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add VIP
app.post('/addvip', async (req, res) => {
  try {
    const { vipType, vipLevel } = req.body;
    const result = await addVIP(vipType, vipLevel);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'VIP added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



// ------ Extra added Apis ----- //


// ----- MSTUSER1 ------//


////// API for add Custom User
app.post('/addcustomuser', async (req, res) => {
  try {
    const { password, lastLogin, isSuperuser, firstName, lastName, isStaff, isActive, dateJoined, isAccountManager, email, departmentID, designation } = req.body;
    const result = await addCustomUser(password, lastLogin, isSuperuser, firstName, lastName, isStaff, isActive, dateJoined, isAccountManager, email, departmentID, designation);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Custom User added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Department
app.post('/adddepartment', async (req, res) => {
  try {
    const { departmentName, isActive } = req.body;
    const result = await addDepartment(departmentName, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Department Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



/////////////// API TO ADD Tax  Details
app.post('/addIdDetails', async (req, res) => {
  console.log('api call')
  try {
    const { guestID, IDType, idNumber, issueDate, expiryDate, issuePlace, name, idFile } = req.body;
    const result = await addIdDetails(guestID, IDType, idNumber, issueDate, expiryDate, issuePlace, name, idFile);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added ID Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});

/////////////// API TO ADD Packages
app.post('/addpackage', async (req, res) => {
  try {
    const { packageCode, description, beginSellDate, endSellDate, basePrice, taxAmount, totalAmount, calculationRule, postingRhythm, rateInclusion, isActive, packageGroupID, transactionCodeID } = req.body;
    const result = await addPackage(packageCode, description, beginSellDate, endSellDate, basePrice, taxAmount, totalAmount, calculationRule, postingRhythm, rateInclusion, isActive, packageGroupID, transactionCodeID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Package",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD Pick Up Drop Details
app.post('/addpickupdropdetails', async (req, res) => {
  try {
    const { type, date, time, stationCode, carrierCode, transportType, remarks } = req.body;
    const result = await addPickUpDropDetails(type, date, time, stationCode, carrierCode, transportType, remarks);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Pick Up Drop Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



////// API for add Reason Group
app.post('/addreasongroup', async (req, res) => {
  try {
    const { reasonGroup, description } = req.body;
    const result = await addReasonGroup(reasonGroup, description);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reason Group added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



////// API for add Room Discrepancy
app.post('/addroomdiscrepency', async (req, res) => {
  try {
    const { roomNumber, frontOfficeStatus, housekeepingStatus, frontOfficePAX, housekeepingPAX, discrepancy } = req.body;
    const result = await addRoomDiscrepency(roomNumber, frontOfficeStatus, housekeepingStatus, frontOfficePAX, housekeepingPAX, discrepancy);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Discrepancy added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



////// API for add Sharer ID
app.post('/addsharingID', async (req, res) => {
  try {
    const { sharingID, numberOfReservations, exemptAfter, apply, applyOnRackRate } = req.body;
    const result = await addSharingID(sharingID, numberOfReservations, exemptAfter, apply, applyOnRackRate);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Sharer ID added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})




////// API for add Reason Code
app.post('/addreasoncode', async (req, res) => {
  try {
    const { hotelID, reasonGroupID, reasonCode, description } = req.body;
    const result = await addReasonCode(hotelID, reasonGroupID, reasonCode, description);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reason Code added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Card Deatils
app.post('/addcarddetails', async (req, res) => {
  try {
    const { guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVVno, maskedCVV } = req.body;
    const result = await addCardDetails(guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVVno, maskedCVV);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: ' Card Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Invoice
app.post('/addinvoice', async (req, res) => {
  try {
    const { folio, invoiceDate, invoiceAmount, isCancelled, reservationID, guest, company, settelment, agent, source, isRevoked } = req.body;
    const result = await addInvoice(folio, invoiceDate, invoiceAmount, isCancelled, reservationID, guest, company, settelment, agent, source, isRevoked);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Invoice Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add GuestPreference details
app.post('/addguestpreference', async (req, res) => {
  try {
    const { guestProfileID, preferenceID } = req.body;
    const result = await addGuestPreference(guestProfileID, preferenceID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Guest Preference Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add Membership Details
app.post('/addmembershipdetails', async (req, res) => {
  try {
    const { guestID, membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate, isPrimary } = req.body;
    const result = await addMembershipDetails(guestID, membershipType, membershipNo, nameOnCard, membershipSince, membershipLevel, expiryDate, isPrimary);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Membership Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add MembershipLevel Details
app.post('/addmembershiplevel', async (req, res) => {
  try {
    const { membershipLevel, description, isActive } = req.body;
    const result = await addMembershipLevel(membershipLevel, description, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MembershipLevel Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add MembershipType Details
app.post('/addmembershipType', async (req, res) => {
  try {
    const { membershipType, description, isActive } = req.body;
    const result = await addMembershipType(membershipType, description, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Membership Type Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add PaymentType Details
app.post('/addpaymenttype', async (req, res) => {
  try {
    const { paymodeTypeCode, description, isActive, transactionCodeID } = req.body;
    const result = await addPaymentType(paymodeTypeCode, description, isActive, transactionCodeID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Payment Type Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add Pickup And Drop Details
app.post('/addpickupanddrop', async (req, res) => {
  try {
    const { type, date, time, stationCode, carrierCode, transportType, remarks } = req.body;
    const result = await addPickupAndDrop(type, date, time, stationCode, carrierCode, transportType, remarks);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Pickup and Drop added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add ReservationPreferenceGroup Details
app.post('/addreservationpreferencegroup', async (req, res) => {
  try {
    const { preferenceGroup, description, isActive } = req.body;
    const result = await addReservationPreferenceGroup(preferenceGroup, description, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reservation Preference Group added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add Reservation Preference Details
app.post('/addreservationpreference', async (req, res) => {
  try {
    const { preference, description, isActive, preferenceGroupID } = req.body;
    const result = await addReservationPreference(preference, description, isActive, preferenceGroupID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reservation Preference added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


//        --------        //

////// API for add Adjust Transaction
app.post('/addAdjustTransaction', async (req, res) => {
  try {
    const { adjustBy, amount, percentage, reasonCodeID, reasonText, reference } = req.body;
    const result = await addAdjustTransaction(adjustBy, amount, percentage, reasonCodeID, reasonText, reference);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Passer By
app.post('/addPasserBy', async (req, res) => {
  try {
    const { guestProfileID, marketCode, sourceCode, roomClass, modifiedAt, modifiedBy } = req.body;
    const result = await addPasserBy(guestProfileID, marketCode, sourceCode, roomClass, modifiedAt, modifiedBy);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Group Reservation
app.post('/addGroupReservation', async (req, res) => {
  try {
    const { groupName, arrivalDate, departureDate, paymentTypeID, companyID, travelAgentID, nights, status, sourceID, marketID, origin, reservationTypeID, rateCodeID, rate, packageID, PAXno, cutOfDate, totalRooms } = req.body;
    const result = await addGroupReservation(groupName, arrivalDate, departureDate, paymentTypeID, companyID, travelAgentID, nights, status, sourceID, marketID, origin, reservationTypeID, rateCodeID, rate, packageID, PAXno, cutOfDate, totalRooms);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Reservation
app.post('/addReservation', async (req, res) => {
  try {
    const { guestProfileID, reservationID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults, numberOfChildren, numberOfRooms, roomTypeID, selectedRoom, rateCodeID, rate, roomToCharge, packageID, extrasID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, poNumber, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, preferences, comments, billingInstruction } = req.body;
    const result = await addReservation(guestProfileID, reservationID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults, numberOfChildren, numberOfRooms, roomTypeID, selectedRoom, rateCodeID, rate, roomToCharge, packageID, extrasID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, poNumber, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, preferences, comments, billingInstruction);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Source
app.post('/addSource', async (req, res) => {
  try {
    const { sourceCode, description, isActive, sourceGroupID } = req.body;
    const result = await addSource(sourceCode, description, isActive, sourceGroupID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Guest
app.post('/addGuest', async (req, res) => {
  try {
    const { firstName, lastName, salutation, guestID } = req.body;
    const result = await addGuest(firstName, lastName, salutation, guestID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Source Group
app.post('/addSourceGroup', async (req, res) => {
  try {
    const { sourceGroup, description, isActive } = req.body;
    const result = await addSourceGroup(sourceGroup, description, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Source Group added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Department
app.post('/addDepartment', async (req, res) => {
  try {
    const { departmentName, isActive } = req.body;
    const result = await addDepartment(departmentName, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Document Details 
app.post('/addDocumentDetails', async (req, res) => {
  try {
    const { guestProfileID, idType, issuePlace, idFile, issueDate, expiryDate } = req.body;
    const result = await addDocumentDetails(guestProfileID, idType, issuePlace, idFile, issueDate, expiryDate);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Guest Address
app.post('/addGuestAddress', async (req, res) => {
  try {
    const { guestProfileID, country, nationality, state, city, postalCode, gstID, phoneNumber, email } = req.body;
    const result = await addGuestAddress(guestProfileID, country, nationality, state, city, postalCode, gstID, phoneNumber, email);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

//  -----------  //




////// API for add GuestPreference details
app.post('/addguestpreference', async (req, res) => {
  try {
    const { guestProfileID, preferenceID } = req.body;
    const result = await addGuestPreference(guestProfileID, preferenceID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Guest Preference Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add Membership Details
app.post('/addmembershipdetails', async (req, res) => {
  try {
    const { guestProfileID, membershipID, nameOnCard, startDate, endDate, membershipLevelID, membershipTypeID } = req.body;
    const result = await addMembershipDetails(guestProfileID, membershipID, nameOnCard, startDate, endDate, membershipLevelID, membershipTypeID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Membership Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add MembershipLevel Details
app.post('/addmembershiplevel', async (req, res) => {
  try {
    const { membershipLevel, isActive } = req.body;
    const result = await addMembershipLevel(membershipLevel, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MembershipLevel Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



////// API for add MembershipType Details
app.post('/addmembershipType', async (req, res) => {
  try {
    const { membershipType, isActive } = req.body;
    const result = await addMembershipType(membershipType, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Membership Type Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add PaymentType Details
app.post('/addpaymenttype', async (req, res) => {
  try {
    const { paymodeTypeCode, description, isActive, transactionCodeID } = req.body;
    const result = await addPaymentType(paymodeTypeCode, description, isActive, transactionCodeID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Payment Type Details added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add Pickup And Drop Details
app.post('/addpickupanddrop', async (req, res) => {
  try {
    const { type, date, time, stationCode, carrierCode, transportType, remarks } = req.body;
    const result = await addPickupAndDrop(type, date, time, stationCode, carrierCode, transportType, remarks);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Pickup and Drop added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


////// API for add ReservationPreferenceGroup Details
app.post('/addreservationpreferencegroup', async (req, res) => {
  try {
    const { preferenceGroup, description, isActive } = req.body;
    const result = await addReservationPreferenceGroup(preferenceGroup, description, isActive);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reservation Preference Group added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})

////// API for add Reservation Preference Details
app.post('/addreservationpreference', async (req, res) => {
  try {
    const { preference, description, isActive, preferenceGroupID } = req.body;
    const result = await addReservationPreference(preference, description, isActive, preferenceGroupID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reservation Preference added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})



/////////////// API TO ADD Payment Code  Details
app.post('/addPaymentCode', async (req, res) => {
  try {
    const { paymentTypeCode, description, isActive, transactionCode } = req.body;
    const result = await addPaymentCode(paymentTypeCode, description, isActive, transactionCode);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added PaymentCode Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



/////////////// API TO ADD Tax  Details
app.post('/addGroup', async (req, res) => {
  console.log('api call')
  try {
    const { groupCode, description, costCenter, isActive } = req.body;
    const result = await addGroup(groupCode, description, costCenter, isActive);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added group Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD Tax  Details
app.post('/addTax', async (req, res) => {
  console.log('api call')
  try {
    const { taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note, isActive } = req.body;
    const result = await addTax(taxName, taxCode, appliesFrom, exemptAfter, postingType, Amount, applyOnPax, taxPercentage, noOfSlabs, applyTax, applyTaxOnRackRate, note, isActive);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Tax Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD addTaxGeneration Reservation  Details
app.post('/addTaxGeneration', async (req, res) => {
  console.log('api call')
  try {
    const { fromAmount, toAmount, percentage, taxID } = req.body;
    const result = await addTaxGeneration(fromAmount, toAmount, percentage, taxID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added TaxGeneration Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateCodeExtas Reservation  Details
app.post('/addRateCodeExtas', async (req, res) => {
  console.log('api call')
  try {
    const { rateCodeID, roomTypeID } = req.body;
    const result = await addRateCodeExtas(rateCodeID, roomTypeID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added RateCodeExtas Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/////////////// API TO ADD RateCodeRoomTypes Reservation  Details
app.post('/addRateCodeRoomTypes', async (req, res) => {
  console.log('api call')
  try {
    const { rateCodeID, roomTypeID } = req.body;
    const result = await addRateCodeRoomTypes(rateCodeID, roomTypeID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added RateCodeRoomTypes Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});






// /////////////// API TO ADD guestProfile Details
// app.post('/guestProfile', async (req, res) => {
//   try {
//     const { firstName, lastName, salutation,guestStatus, addressOne, addressTwo, country, state, city, postalCode, gstID, anniversary,  nationality, dob, phoneNumber, email,notes,guestType, lastVisit, isActive ,isBlackListed, companyID, lastRateID, lastRoomID, negotiatedRateID,vipID  } = req.body;
//     const result = await addGuestProfile(firstName, lastName, salutation,guestStatus, addressOne, addressTwo, country, state, city, postalCode, gstID, anniversary,  nationality, dob, phoneNumber, email,notes,guestType, lastVisit, isActive ,isBlackListed, companyID, lastRateID, lastRoomID, negotiatedRateID,vipID);
//     res.status(200).send({
//       status: 'success',
//       statuscode: res.statusCode,
//       message: "Succesfully added guestProfile Details",
//       data: result
//     })
//   }
//   catch (error) {
//     console.log(error)
//     res.status(403).send({
//       status: "Failed",
//       statusCode: 403,
//       message: "Forbidden"
//     })
//   }
// });



/////////////// API TO ADD Assigned Room Details to roomOccupancy
app.post('/addassignroomtooccupancy', async (req, res) => {
  try {
    const { reservationID, fromDate, toDate, roomID } = req.body;
    const result = await addAssignRoomToOccupancy(reservationID, fromDate, toDate, roomID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added AssignRoom To Room Occupancy Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});




















//-----------// Configuration Select Functions (GET) //-----------//


// --------- MSTUSER1 -------- //

////// Function to select Extra
const getExtra = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT *, groups.groupCode, subGroup.subGroup FROM extra INNER JOIN groups ON groups.id= extra.groupID INNER JOIN subGroup ON subGroup.id= extra.subGroupID`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Room Inventory
const getRoomInventory = async (hotelID, inventory_date) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomInventory WHERE hotelID=? OR inventory_date=?`;
    const values = [hotelID, inventory_date]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Room Inventory Forecast
const getRoomInventoryForecast = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomInventoryForecast WHERE hotelID`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Room Wise Inventory
const getRoomWiseInventory = async (date) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomWiseInventory WHERE date=?`;
    const values = [date]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  })
};




////// Function to select Room Wise Inventory By HotelID
const getRoomWiseInventoryByHotelID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomWiseInventory WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  })
};

////// Function to select out Of Order / Service
const getOutOfOrderOrService = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT outOfOrderAndService.hotelID,roomID,outOfOrderAndService.id,roomNumber,roomTypeID,status,fromDate,toDate,reasonCode,remarks,returnStatus,startTime,endTime FROM outOfOrderAndService INNER join room on room.id=outOfOrderAndService.roomID INNER join reason on reason.id=outOfOrderAndService.reasonID WHERE outOfOrderAndService.hotelID=? ORDER BY id DESC`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        const modifiedResult = result.map((row) => {
          const fromDate = moment(row.fromDate).format('YYYY-MM-DD');
          const toDate = moment(row.toDate).format('YYYY-MM-DD');
          return {
            ...row,
            fromDate,
            toDate,
          };
        });

        console.log(modifiedResult[0])
        resolve(modifiedResult);
      }
    });
  })
};


////// Function to select Room Type
const getRoomType = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomType WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Transaction Code
const getTransactionCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT transactionCode.id,transactionCode,transactionCode.description,transactionCode.baseRate,groupCode,subGroup FROM transactionCode INNER JOIN groups ON groupID = groups.id INNER JOIN subGroup ON subGroupID = subGroup.id ORDER By transactionCode.id DESC
`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select payment type related to POS
const getPaymentTypeTransactionCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT transactionCode.hotelID, transactionCode.id ,transactionCode.transactionCode,transactionCode.description, transactionCode.groupID FROM transactionCode WHERE groupID=6`;
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Room Availability
const getRoomInventoryAvailability = async (hotelID, fromDate, toDate, roomTypeID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT numAvlRooms, date, roomTypeID FROM roomInventory WHERE hotelID=? AND date BETWEEN ? AND ? AND roomTypeID=?`;
    const values = [hotelID, fromDate, toDate, roomTypeID]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// This is the function to get block from the Database
const getBlock = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM block where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////////////// This is the function to get floor from the Database
const getFloor = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM floor INNER JOIN block ON floor.blockID = block.id`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get hotelDetails from the Database
const gethotelDetails = async (name) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM hotelDetails `;
    const values = [name]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get marketCode from the Database.
const getmarketCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT marketCode.*, marketGroup.marketGroup from marketCode INNER JOIN marketGroup ON marketCode.marketGroupID = marketGroup.id`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get marketGroup from the Database
const getmarketGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM marketGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get NightAudit from the Database
const getNightAudit = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM nightAudit where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get PackageGroup from the Database
const getPackageGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM packageGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateClass from the Database
const getRateClass = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateClass where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateCategory from the Database
const getRateCategory = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT *, rateClass.rateClass FROM rateCategory INNER JOIN rateClass ON rateClass.id= rateCategory.rateClassID`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateCode from the Database
const getRateCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateSummary from the Database
const getRateSummary = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateSummary where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get ReservationGroup from the Database
const getReservationGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reservationsGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get SubGroup from the Database
const getSubGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT *, groups.groupCode FROM subGroup INNER JOIN groups ON groups.id= subGroup.groupID`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get User from the Database
const getUser = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM user where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};








//-----------// Other Select Functions (GET) //-----------//


//------- MSTUSER1 ------//


////// Function to select Booker
const getBooker = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM booker WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Cancellation
const getCancellation = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cancellation WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Commission
const getCommission = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM commission WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Documents
const getDocuments = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM documents WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Document Type
const getDocumentType = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM documentType WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Extra Group
const getExtraGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM extraGroup WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Fixed Charge
const getFixedCharge = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM fixedCharge WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Forex
const getForex = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM forex WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Group Reservation RoomType
const getGroupReservationRoomType = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groupReservationRoomType WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Reservation Type
const getReservationType = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reservationType WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to Select Room Class
const getRoomClass = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomClass WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        // console.log(result)
      }
    });
  })
};


////// Function to select Split Transaction
const getSplitTransaction = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM splitTransaction WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Ticket
const getTicket = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticket WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Ticket Category
const getTicketCategory = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ticketCategory WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Transaction
const getTransaction = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM transaction WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Wait List
const getWaitList = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM waitList WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Transaction Code Taxes
const getTransactionCodeTaxes = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM transactionCodeTaxes WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select VIP
const getVIP = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM vip WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};



////// Function to select Room Occupancy
const getRoomOccupacy = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomOccupancy WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select  and Check Room Occupancy
const getCheckRoomOccupancy = async (hotelID, fromDate, toDate, reservationID, roomID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomOccupancy WHERE hotelID=? AND fromDate=? AND toDate=? AND reservationID=? OR roomID=?`;
    const values = [hotelID, fromDate, toDate, reservationID, roomID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};




// ------ MSTUSER2 ------ //


//////////// This is the function to get Accounts from the Database
const getAccounts = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM accounts where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get folio from the Database.
const getFolio = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM folio where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get Rate from the Database
const getRate = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rate where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateCodeRoomRate from the Database. 
const getRateCodeRoomRate = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT rateCodeRoomRate.*, roomType.roomType FROM rateCodeRoomRate INNER JOIN roomType ON rateCodeRoomRate.roomTypeID= roomType.id`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateSetup from the Database
const getRateSetup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateSetup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get room from the Database
const getRoom = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT room.id,roomNumber,roomStatus,frontOfficeStatus,reservationStatus,floorID,roomTypeID,roomType from room INNER JOIN roomType on room.roomTypeID=roomType.id where room.hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get Routing from the Database. 
const getRouting = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM routing where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get specials from the Database
const getSpecials = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM specials where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get VisaDetails from the Database.
const getVisaDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM visaDetails where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};





////////////// This is the function to get GuestName from the  Database. 
const getGuestName = async (firstName, lastName) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM guestprofile WHERE firstName = ? AND lastName = ?`;
    const values = [firstName, lastName]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};




// ---------- //

////////////// This is the function to get Source from the Database.
const getSource = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM source where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the function to get Guest from the Database
const getGuest = async (hotelID, guestID = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM guestBasicProfile where hotelID = ?`
    let values = [hotelID]
    if (guestID !== null) {
      query += ` AND guestID = ?`;
      values.push(guestID)
    }
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the function to get Source Group from the Database
const getsourceGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM sourceGroup where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the function to get Department from the Database
const getDepartment = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM department where hotelID=?`
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the function to get GuestAdddress from the Database
const getGuestAdddress = async (hotelID, guestProfileID = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM guestAddress where hotelID = ?`
    let values = [hotelID]
    if (guestProfileID !== null) {
      query += ` AND guestProfileID = ?`;
      values.push(guestProfileID)
    }
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}

////////////// This is the function to get GuestPreference from the Database
const getGuestPreference = async (hotelID, guestProfileID = null) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM guestPreference where hotelID = ?`
    let values = [hotelID]
    if (guestProfileID !== null) {
      query += ` AND guestProfileID = ?`;
      values.push(guestProfileID)
    }
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}

////////////// This is the function to get MembershipDetails from the Database
const getMembershipDetails = async (hotelID, guestID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM membershipDetails where hotelID = ? AND guestID = ?`
    let values = [hotelID]
    if (guestID !== null) {
      // query += ` AND guestID = ?`;
      values.push(guestID)
    }
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get MembershipLevel from the Database
const getMembershipLevel = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM membershipLevel where hotelID = ?`
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get MembershipType from the Database
const getMembershipType = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM membershipType where hotelID = ?`
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get PaymentType from the Database
const getPaymentType = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM paymentType where hotelID = ?`
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get PickupAndDrop from the Database
const getPickupAndDrop = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM pickupdropDetails where hotelID = ?`
    // let query =`SELECT inventory_date, GROUP_CONCAT(roomTypeID), GROUP_CONCAT(numAvlRooms) as roomsavailable FROM roomInventory group by inventory_date`

    console.log(query);
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err)

        }
        else {
          resolve(result)
          console.log(result);
        }
      })
      // }
    }
  })
}


////////////// This is the function to get ReservationPreferenceGroup from the Database
const getReservationPreferenceGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM reservationPreferenceGroup where hotelID = ?`
    let values = [hotelID];
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get ReservationPreference from the Database
const getReservationPreference = async () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM reservationPreference`
    connection.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
}


////////////// This is the function to get roomdiscrepency from the Database
const getroomdiscrepency = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM roomDiscrepency where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get ReasonGroup from the Database.
const getReasonGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM reasonGroup where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get ReasonCode from the Database
const getReasonCode = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM reasonCode where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get SharingID from the Database
const getSharingID = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM sharingID where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get InvoiceDetails from the Database
const getInvoiceDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM invoice where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get card details from the Database
const getCardDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM cardDetails where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}



////////////// This is the function to get room move from the Database
const getRoomMove = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM roomMove where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })

}

////////////// This is the function to get Adjust Transaction from the Database
const getAdjustTransaction = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM adjustTransaction where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })

}

////////////// This is the function to get Passer By from the Database
const getPasserBy = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM passerBy where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })

}

////////////// This is the function to get Group Reservation from the Database
const getGroupReservation = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM groupReservation where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}

////////////// This is the function to get Reservation from the Database.
const getReservation = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM reservation where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}






// ----- Extra Added Select Functions ------- //

// ------ MSTUSER1 ------ //

////// Function to select Booking Details
const getBookingDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM  bookingDetails WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};



////// Function to select Change Room
const getChangeRoom = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM changeRoom WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Custom User
const getCustomUser = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM customUser WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Department Details
const getDepartmentDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM departmentDetails WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};



////////////// This is the function to get Documents from the Database
const getDocumentDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM documentDetails where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////// Function to select ID Details
const getIDDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM idDetails WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Packages
const getPackage = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT *, packageGroup.packageGroup FROM package INNER JOIN packageGroup ON packageGroup.id= package.packageGroupID`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Pick Up Details
const getPickUpDropDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pickupdropDetails WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get GuestProfile from the  Database. 
const getGuestProfile = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM guestProfile where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// -------- //

////////////// This is the function to get paymentCode from the Database.
const getPaymentCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM paymentCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get paymentCode from the Database.
const getGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groups where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get Tax from the Database.
const getTax = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tax where hotelID=? ORDER By tax.id DESC`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get taxGeneration from the Database.
const getTaxGeneration = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM taxGeneration where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////////////// This is the function to get rateCodeRoomExtas from the Database.
const getRateCodeExtras = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateCodeExtras where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get rateCodeRoomTypes from the Database.
const getRateCodeRoomTypes = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateCodeRoomTypes where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};










/////  Function Added for foreign key done in database and also for dropdown

////////////// This is the function to Floor from Block.id
const getFloorBlockID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,block FROM block where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

////////////// This is the function to Reason from reason
const getReason = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,reasonCode FROM reason where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get marketGroup from the Database
const getMarketCodeMarketGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM marketGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////////////// This is the function to SourceGroup from SourceGroup.id
const getSourceGroupForSourceCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,sourceGroup FROM sourceGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};







//////////////////// ------------------- Configuration Get By ID ------------------- ///////////////////////

////// This is the function to get block from the Database
const getBlockById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM block where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////////////// This is the function to get floor from the Database
const getFloorById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM floor where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////// Function to Select Room Class
const getRoomClassById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomClass WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        // console.log(result)
      }
    });
  })
};



////// Function to select Room Type
const getRoomTypeById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM roomType WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get specials from the Database
const getSpecialsById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM specials where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get room from the Database
const getRoomById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM room where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////////////// This is the function to get marketCode from the Database.
const getmarketCodeById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM marketCode where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get marketGroup from the Database
const getmarketGroupById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM marketGroup where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get Source from the Database.
const getSourceById = async (id) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM source where id = ?`
    let values = [id]
    if ((id == undefined || id == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}


////////////// This is the function to get Source Group from the Database
const getsourceGroupById = async (id) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM sourceGroup where id = ?`
    let values = [id]
    if ((id == undefined || id == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    }
  })
}



////////////// This is the function to get paymentCode from the Database.
const getGroupById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groups where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get SubGroup from the Database
const getSubGroupById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM subGroup where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////// Function to select Transaction Code
const getTransactionCodeById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT transactionCode,transactionCode.description,transactionCode.baseRate,groupCode,subGroup FROM transactionCode INNER JOIN groups ON groupID = groups.id INNER JOIN subGroup ON subGroupID = subGroup.id
`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select Extra
const getExtraById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM extra WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get PackageGroup from the Database
const getPackageGroupById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM packageGroup where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////// Function to select Packages
const getPackageById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM package WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get RateCategory from the Database
const getRateCategoryById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateCategory where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get RateCode from the Database
const getRateCodeById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM rateCode where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////// Function to select Commission
const getCommissionById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM commission WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get User from the Database
const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM user where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



////// Function to select Booker
const getBookerById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM booker WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get MembershipType from the Database
const getMembershipTypeById = async (id) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM membershipType where id = ?`
    let values = [id];


    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })

  })
}


////////////// This is the function to get MembershipLevel from the Database
const getMembershipLevelById = async (id) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM membershipLevel where id = ?`
    let values = [id];
    if ((id == undefined || id == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get MembershipDetails from the Database
const getMembershipDetailsById = async (id, guestProfileID) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM membershipDetails where id = ? AND guestProfileID = ?`
    let values = [id]
    if (guestProfileID !== null) {
      query += ` AND guestProfileID = ?`;
      values.push(guestProfileID)
    }
    if ((id == undefined || id == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////// Function to select ID Details
const getIDDetailsById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM idDetails WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////// Function to select VIP
const getVIPById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM vip WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get card details from the Database
const getCardDetailsById = async (id) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM cardDetails where id = ?`
    let values = [id]
    if ((id == undefined || id == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


////////////// This is the function to get VisaDetails from the Database.
const getVisaDetailsById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM visaDetails where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////// Function to select Documents
const getDocumentsById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM documents WHERE id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


////////////// This is the function to get GuestProfile from the  Database. 
const getGuestProfileById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM guestProfile where id=?`;
    const values = [id]
    connection.query(sql, values, (error, result) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////// Function to select Room Number By floor
const getRoomNumberByFloorID = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT floorID, JSON_ARRAYAGG(roomNumber) as Rooms from room group BY floorID`;
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      else {

        let myJson = {}
        let arr = []
        let floor
        result.forEach(element => {
          let floor = element['floorID']
          let floorID = (floor)
          // floor=1
          // console.log(floor)
          // console.log(element['Rooms'])
          myJson[floor] = element['Rooms']
          // myJson={floorID:element['Rooms']}
          // arr.push(myJson)
          // floor++
        })
        resolve(myJson);
        // console.log(arr)
      }
    });
  })
};


















//-----------// Configuration Select API (GET) //-----------//


// ------- MSTUSER1 ------ //



////// API for Select Extra
app.get('/getextra', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getExtra(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Extra fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Room Inventory
app.get('/getroominventory', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let inventory_date = req.query['inventory_date']
    // let roomID = req.query['roomID']
    const result = await getRoomInventory(hotelID, inventory_date);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})



////// API for Select Room Inventory Forecast
app.get('/getroominventoryforecast', async (req, res) => {
  try {
    let date = req.query['date']
    // let roomID = req.query['roomID']
    const result = await getRoomInventoryForecast(date);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Forecast Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Room Wise Inventory
app.get('/getroomwiseinventory', async (req, res) => {
  try {
    let date = req.query['date']
    const result = await getRoomWiseInventory(date);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Forecast Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Room Wise Inventory By HotelID
app.get('/getRoomWiseInventoryByHotelID', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoomWiseInventoryByHotelID(hotelID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Forecast Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})

////// API for Select Room Wise Inventory By HotelID
app.get('/getOutOfOrderOrService', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getOutOfOrderOrService(hotelID);
    // console.log(result)
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Out Of Order Or Service Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})

////// API for Select Room type
app.get('/getroomtype', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoomType(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room type fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Transaction Code
app.get('/gettransactioncode', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTransactionCode(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Transaction Code Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Temp Extra
app.get('/getTempExtra', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTempExtra(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' TempExtra Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})

////// API for Select Room Inventory Availbility
app.get('/getroominventoryavailability', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let fromDate = req.query['fromDate']
    let toDate = req.query['toDate']
    let roomTypeID = req.query['roomTypeID']

    const result = await getRoomInventoryAvailability(hotelID, fromDate, toDate, roomTypeID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory availbility fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})




////// API for Select Room Inventory
app.get('/getRoomNumberByFloorID', async (req, res) => {
  try {
    // let hotelID = req.query['hotelID']
    // let inventory_date = req.query['inventory_date']
    // let roomID = req.query['roomID']
    const result = await getRoomNumberByFloorID();
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'RoomNumber By FloorID fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})

// API to Get Block Data
app.get("/block", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM block WHERE hotelID=?";
    const result = await getBlock(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



// API to Get Floor Data
app.get("/floor", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM floor WHERE hotelID=?";
    const result = await getFloor(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Floor data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get hotelDetails Data
app.get("/HotelDetails", async (req, res) => {
  try {
    let name = req.query['name']
    const result = await gethotelDetails(name);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'HotelDetails data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get MarketCode Data
app.get("/marketCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM marketCode WHERE hotelID=?";
    const result = await getmarketCode(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MarketCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get marketGroup Data
app.get("/marketGroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM marketGroup WHERE hotelID=?";
    const result = await getmarketGroup(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MarketGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get NightAudit Data
app.get("/NightAudit", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM nightAudit WHERE hotelID=?";
    const result = await getNightAudit(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'NightAudit data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get PackageGroup Data
app.get("/PackageGroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM packageGroup WHERE hotelID=?";
    const result = await getPackageGroup(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'PackageGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get RateClass Data
app.get("/RateClass", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM rateClass WHERE hotelID=?";
    const result = await getRateClass(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateClass data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Data Rate Category Data
app.get("/RateCategory", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM rateCategory WHERE hotelID=?";
    const result = await getRateCategory(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCategory data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Data
app.get("/RateCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM rateCode WHERE hotelID=?";
    const result = await getRateCode(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get RateSummary Data
app.get("/RateSummary", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM rateSummary WHERE hotelID=?";
    const result = await getRateSummary(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'VisaDetails data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get ReservationGroup Data
app.get("/ReservationGroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReservationGroup(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'ReservationGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get SubGroup Data
app.get("/subGroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM subGroup WHERE hotelID=?";
    const result = await getSubGroup(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'SubGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get User Data
app.get("/User", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM user WHERE hotelID=?";
    const result = await getUser(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'User data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});












////// -------------------- Configuration Get By ID -------------------- ///////////////////////



// API to Get Block Data
app.get("/getblockById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM block WHERE id=?";
    const result = await getBlockById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Floor Data
app.get("/getfloorById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM floor WHERE id=?";
    const result = await getFloorById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Floor data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


////// API for Select Room Class
app.get('/getroomclassById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getRoomClassById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Class fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Room type
app.get('/getroomtypeById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getRoomTypeById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room type fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})



// API to Get Specials Data
app.get("/getSpecialsById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM specials WHERE id=?";
    const result = await getSpecialsById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Specials data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get Room Data
app.get("/getroomById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM room WHERE id=?";
    const result = await getRoomById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get MarketCode Data
app.get("/getmarketCodeById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM marketCode WHERE id=?";
    const result = await getmarketCodeById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MarketCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get marketGroup Data
app.get("/getmarketGroupById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM marketGroup WHERE id=?";
    const result = await getmarketGroupById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MarketGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



//API to get all sources
app.get('/getSourceById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getSourceById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived source options",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all sources group
app.get('/getSourceGroupById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getsourceGroupById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived source group",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})



// API to Get Group Data
app.get("/getGroupById", async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getGroupById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Group data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get SubGroup Data
app.get("/getsubGroupById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM subGroup WHERE id=?";
    const result = await getSubGroupById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'SubGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


////// API for Select Transaction Code
app.get('/gettransactioncodeById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getTransactionCodeById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Transaction Code Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Transaction Code for POS
app.get('/getPaymentTypeCode', async (req, res) => {
  try {
    const result = await getPaymentTypeTransactionCode();
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'POS Payment Types',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Extra
app.get('/getextraById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getExtraById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Extra fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})




////// API for Select Packages
app.get('/getpackageById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getPackageById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Package fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


// API to Get PackageGroup Data
app.get("/getPackageGroupById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM packageGroup WHERE id=?";
    const result = await getPackageGroupById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'PackageGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Data Rate Category Data
app.get("/getRateCategoryById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM rateCategory WHERE id=?";
    const result = await getRateCategoryById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCategory data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Data
app.get("/getRateCodeById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM rateCode WHERE id=?";
    const result = await getRateCodeById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


////// API for Select commission
app.get('/getcommissionById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getCommissionById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Commission Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


// API to Get User Data
app.get("/getUserById", async (req, res) => {
  try {
    let id = req.query['id']
    const sql = "SELECT * FROM user WHERE id=?";
    const result = await getUserById(id);
    // const id=req.query['id']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'User data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


////// API for Select Booker
app.get('/getbookerById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getBookerById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Booker Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


//API to get membership details
app.get('/getMembershipDetailsById', async (req, res) => {
  try {
    let id = req.query['id']
    let guestProfileID = req.query['guestProfileID']

    const result = await getMembershipDetailsById(id, guestProfileID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all membership level
app.get('/getMembershipLevelById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getMembershipLevelById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipLevel",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get MembershipTypes
app.get('/getMembershipTypeById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getMembershipTypeById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipType",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})

////// API for Select ID Details
app.get('/getiddetailsById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getIDDetailsById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'ID Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})



////// API for Select VIP
app.get('/getvipById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getVIPById(id);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'VIP fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


//API to get CardDetails
app.get('/getCardDetailsById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getCardDetailsById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived CardDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


// API to Get VisaDetails Data
app.get("/getVisaDetailsById", async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getVisaDetailsById(id);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'VisaDetails data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


//API to get all documents
app.get('/getDocumentsById', async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getDocumentsById(id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived documents",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


// API to Get guestProfile Data
app.get("/getGuestProfileById", async (req, res) => {
  try {
    let id = req.query['id']
    const result = await getGuestProfileById(id);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'retrived guestProfile name Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});















//-----------// Other select API (GET) //-----------//



//  ------ MSTUSER1 ------//

////// API for Select Booker
app.get('/getbooker', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getBooker(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Booker Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select cancellation
app.get('/getcancellation', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCancellation(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Cancellation Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select commission
app.get('/getcommission', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCommission(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Commission Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Documents
app.get('/getdocuments', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDocuments(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Documents fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Document Type
app.get('/getdocumenttype', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDocumentType(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Document Type fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Extra Group
app.get('/getextragroup', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getExtraGroup(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Extra Group fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Fixed Charge
app.get('/getfixedcharge', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getFixedCharge(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Fixed Charge Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Forex
app.get('/getforex', async (req, res) => {
  try {
    // const {hotelID, date, roomID}=req.body;
    let hotelID = req.query['hotelID']
    const result = await getForex(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Forex Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Group Reservation RoomType
app.get('/getgroupreservationroomtype', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGroupReservationRoomType(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Group Reservation RoomType Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Reservation Type
app.get('/getreservationtype', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReservationType(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Reservation Type fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Room Class
app.get('/getroomclass', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoomClass(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Class fetched successfully',
      data: result
    })

  }
  catch (error) {
    // console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Split Transaction
app.get('/getsplittransaction', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getSplitTransaction(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Split Transaction Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Ticket
app.get('/getticket', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTicket(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Ticket Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Ticket Category
app.get('/getticketcategory', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTicketCategory(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Ticket Category Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Transaction
app.get('/gettransaction', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTransaction(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Transaction Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Wait List
app.get('/getwaitlist', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getWaitList(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Wait List Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})



////// API for Select Transaction Code Taxes
app.get('/gettransactioncodetaxes', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTransactionCodeTaxes(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Transaction Code Taxes Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})

////// API for Select VIP
app.get('/getvip', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getVIP(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'VIP fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


// -------- MSTUSER2 -------//


// API to Get Accounts Data
app.get("/getAccounts", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM accounts WHERE hotelID=?";
    const result = await getAccounts(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Accounts data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Data
app.get("/Folio", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM folio WHERE hotelID=?";
    const result = await getFolio(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Folio data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Data
app.get("/Rate", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRate(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Rate data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get RateCodeRoomRate Data
app.get("/getRateCodeRoomRate", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCodeRoomRate(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCodeRoomRate data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get RateSetup Data
app.get("/RateSetup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    // const sql = "SELECT * FROM rateSetup WHERE hotelID=?";
    const result = await getRateSetup(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateSetup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Room Data
app.get("/room", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoom(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Routing Data
app.get("/Routing", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM routing WHERE hotelID=?";
    const result = await getRouting(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Routing data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Specials Data
app.get("/Specials", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM specials WHERE hotelID=?";
    const result = await getSpecials(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Specials data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get VisaDetails Data
app.get("/VisaDetails", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getVisaDetails(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'VisaDetails data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});




// API to Get guestProfile Data
app.get("/getGuestProfile", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGuestProfile(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'retrived guestProfile name Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to to Get Company Name
app.get("/GuestName", async (req, res) => {
  try {
    let firstName = req.query['firstName']
    let lastName = req.query['lastName']
    console.log(firstName, lastName)
    const result = await getGuestName(firstName, lastName);
    console.log(result)
    res.status(200).send({


      status: 'Success',
      statusCode: res.statusCode,
      message: 'retrived Guest name Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// --------- //




//API to get all sources
app.get('/getSource', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getSource(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived source options",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all guest details
app.get('/getGuestDetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let guestID = req.query['guestID']

    const result = await getGuest(hotelID, guestID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived guest details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all sources group
app.get('/getSourceGroup', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getsourceGroup(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived source group",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all departments
app.get('/getDepartment', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDepartment(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived department options",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all documents
app.get('/getDocuments', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDocuments(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived documents",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all guest address
app.get('/getGuestAdddress', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let guestProfileID = req.query['guestProfileID']

    const result = await getGuestAdddress(hotelID, guestProfileID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived guest address details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get guest preferences
app.get('/getGuestPrefernces', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let guestProfileID = req.query['guestProfileID']

    const result = await getGuestPreference(hotelID, guestProfileID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived guest preferences",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get membership details
app.get('/getMembershipDetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let guestID = req.query['guestID']

    const result = await getMembershipDetails(hotelID, guestID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get all membership level
app.get('/getMembershipLevel', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getMembershipLevel(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipLevel",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get MembershipTypes
app.get('/getMembershipType', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getMembershipType(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived MembershipType",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get PaymentType
app.get('/getPaymentType', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPaymentType(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived PaymentType",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get PickupAndDrop
app.get('/getPickupAndDrop', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPickupAndDrop(hotelID);

    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived PickupAndDrop",
      data: result
    })
  }
  catch (error) {
    console.log(error);
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get ReservationPreferenceGroup
app.get('/getReservationPreferenceGroup', async (req, res) => {
  try {
    const result = await getReservationPreferenceGroup();
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived ReservationPreferenceGroup",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get ReservationPreference
app.get('/getReservationPreference', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReservationPreference(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived ReservationPreference",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get roomdiscrepency
app.get('/getroomdiscrepency', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getroomdiscrepency(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived roomdiscrepency",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get ReasonGroup
app.get('/getReasonGroup', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReasonGroup(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived ReasonGroup",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get ReasonCode
app.get('/getReasonCode', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReasonCode(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived ReasonCode",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get SharingID
app.get('/getSharingID', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getSharingID(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived SharingID",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get InvoiceDetails
app.get('/getInvoiceDetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getInvoiceDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived InvoiceDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get CardDetails
app.get('/getCardDetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCardDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived CardDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get DailyDetails
app.get('/getDailyDetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDailyDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived DailyDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get getRoomMove
app.get('/getRoomMove', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoomMove(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived RoomMove",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get AdjustTransaction
app.get('/getAdjustTransaction', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getAdjustTransaction(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived AdjustTransaction",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get PasserBy
app.get('/getPasserBy', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPasserBy(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived PasserBy",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get GroupReservation
app.get('/getGroupReservation', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGroupReservation(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived GroupReservation",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


//API to get Reservation
app.get('/getReservation', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReservation(hotelID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully retrived Reservation",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden",
      data: error
    })
  }
})


// /////////////// API TO ADD Comfirmed Reservation  Details
app.post('/ComfirmedReservation ', async (req, res) => {
  try {
    const { checkIn, checkOut, adults, children, quantity } = req.body;
    const result = await addComfirmedReservation(checkIn, checkOut, adults, children, quantity);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added dummyReservation Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});




//    Extra Added Select Apis       //


//---- MSTUSER1 ----//

// API for Select Booking Details
app.get('/getbookingdetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getBookingDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Booking Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Change Room
app.get('/getchnageroom', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getChangeRoom(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: ' Change Room Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Custom User
app.get('/getcustomuser', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCustomUser(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Custom User fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Department Details
app.get('/getdepartmentdetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDepartmentDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Department Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Document Details
app.get('/getdocumentdetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDocumentDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Document Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select ID Details
app.get('/getiddetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getIDDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'ID Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Packages
app.get('/getpackage', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPackage(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Package fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select Pick Up Drop Details
app.get('/getpickupdropdetails', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPickUpDropDetails(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Pick Up Drop Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})



////// API for Select Room Occupancy
app.get('/getroomoccupacy', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRoomOccupacy(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Occupancy fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


////// API for Select and Check Room Occupancy
app.get('/getcheckroomoccupancy', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    let fromDate = req.query['fromDate']
    let toDate = req.query['toDate']
    let reservationID = req.query['reservationID']
    let roomID = req.query['roomID']
    const result = await getCheckRoomOccupancy(hotelID, fromDate, toDate, reservationID, roomID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Check Room Occupancy fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})





// --------- //

// API to Get Group Data
app.get("/getPaymentCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPaymentCode(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'PaymentCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Group Data
app.get("/getGroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGroup(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Group data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get TaxData
app.get("/getTax", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTax(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Tax data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get TaxGeneration Data
app.get("/getTaxGeneration", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTaxGeneration(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'TaxGeneration data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


app.post('/create_reservation_bookingtype', async (req, res) => {
  try {
    const { source, companyID, guestProfileID } = req.body;
    const result = await addCompanyInformation(source, companyID, guestProfileID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Company Information Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//Add booking information
app.post('/add_bookinfo_reservation', async (req, res) => {
  try {
    const { hotelID, source, companyID, reservationID, checkIn, checkOut, adults, children, quantity } = req.body;
    console.log("Booking Info is:-")
    console.log(hotelID, source, companyID, reservationID, checkIn, checkOut, adults, children, quantity)
    const result = await addDummyReservation(hotelID, source, companyID, reservationID, checkIn, checkOut, adults, children, quantity);
    console.log("in booking info")
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added dummyReservation Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


// API to Get guestProfile Data
app.get("/GuestProfile", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGuestProfile(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'retrived guestProfile name Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


const add_daily_info1 = async (data) => {
  return new Promise((resolve, reject) => {
    for (i = 0; i < data['data'].length; i++) {
      let keys = Object.keys(data['data'][i])
      for (j = 0; j < keys.length; j++) {
        for (k = 0; k < data['data'][i][keys[j]]['roominfo'].length; k++) {

          data['data'][i][keys[j]]['roominfo'][k]['id'] = keys[j]
          let fullData = data['data'][i][keys[j]]['roominfo'][i]
          let Total = data['data'][i][keys[j]]['totalPrice']

          roomTypeID = fullData['roomTypeID']
          inventory_date = fullData['inventory_date']   // new Date()
          baseprice = fullData['baseprice']
          extraadultprice = fullData['extraadultprice']
          childrenprice = fullData['childrenprice']
          total = fullData['total']
          numAvlRooms = fullData['numAvlRooms']
          id = fullData['id']
          totalPrice = Total
          console.log(totalPrice)

          const sql = `INSERT INTO dailyInfo (id,roomTypeID,inventory_date,baseprice,extraadultprice,childrenprice,total,numAvlRooms,totalPrice) VALUES (?,?,?,?,?,?,?,?,?)`;
          values = [id, roomTypeID, inventory_date, baseprice, extraadultprice, childrenprice, total, numAvlRooms, totalPrice]
          console.log(values)
          console.log(inventory_date)
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            }
            else {
              resolve(result);
            }
          });
        }
        resolve("success")
      }
    }

  });
}


/////////////// API TO ADD TempRateCodeSelection Details
app.post('/add_daily_info', async (req, res) => {
  try {

    let data = req.body
    const result = await add_daily_info1(data);
    // getRateCodeSelection(hotelID,ratecode,checkin, checkout,adults,children)

    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added add_daily_info Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



// API to Get TaxData
app.get("/getCompanyDetails", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCompanyDetails(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Company Details data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get TaxData
app.get("/getCompanyDetails", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCompanyDetails(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Company Details data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Availability Matrix from room class
app.get("/getavailabilitymatrix", async (req, res) => {
  try {
    // let hotelID = req.query['hotelID']

    const result = await getAvailabilityMatrix();
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Availability Matrix  data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



























/////  Api's Added for foreign key done in database and also for dropdown

// API to Get Floor BlockID from Block.id
app.get("/getfloorblockid", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const sql = "SELECT * FROM block WHERE hotelID=?";
    const result = await getFloorBlockID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['block']
      delete result[i]['block'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Reason from Reason
app.get("/getReason", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getReason(hotelID);
    for (i = 0; i < result.length; i++) {
      // console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['reasonCode']
      delete result[i]['reasonCode'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Reason data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



// API to Get marketGroup Data
app.get("/getmarketcodemarketgroupid", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getMarketCodeMarketGroupID(hotelID);
    // const hotelID=req.query['hotelID']
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['marketGroup']
      delete result[i]['marketGroup'];
    }
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'MarketGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




// API to Get Floor BlockID from Block.id
app.get("/getSourceGroupForSourceCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getSourceGroupForSourceCode(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['sourceGroup']
      delete result[i]['sourceGroup'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});

























// Foreign key Drop Dowb Select Function

////////////// This is the function to get SubGroup from the Database
const getForeignKeySubGroup = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,subGroup FROM subGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get SpecialGroupID from the Database
const getSpecialGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,specialGroup FROM specialGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get Groups from the Database
const getForeignKeyGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,groupCode FROM groups where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


////////////// This is the function to get TaxPercentage from the Database
const getTransactionCodeTaxPercentage = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,taxName,taxPercentage FROM tax where hotelID=?`;
    const values = [hotelID]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



// Foreign key Drop Down Select Api


// API to Get transactionsubgroupid Data from SubGroup
app.get("/getforeignkeysubgroup", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getForeignKeySubGroup(hotelID);
    for (i = 0; i < result.length; i++) {
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['subGroup']
      delete result[i]['subGroup'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'SubGroup data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get transactiongroupid Data from Groups
app.get("/getforeignkeygroupid", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getForeignKeyGroupID(hotelID);
    for (i = 0; i < result.length; i++) {
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['groupCode']
      delete result[i]['groupCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Group data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get SpecialGroupID Data from SpecialGroup
app.get("/getSpecialGroupID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getSpecialGroupID(hotelID);
    for (i = 0; i < result.length; i++) {
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['specialGroup']
      delete result[i]['specialGroup'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Special Group data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get transactioncode taxPercentage Data from Groups
app.get("/gettransactioncodetaxpercentage", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getTransactionCodeTaxPercentage(hotelID);
    console.log(result)
    for (i = 0; i < result.length; i++) {
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['taxName']
      // result[i]['label'] = result[i]['taxPercentage']
      delete result[i]['taxName'];
      delete result[i]['id']
      // delete result[i]['taxPercentage'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'transactioncode taxPercentage data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get Rate Code Extras Data
app.get("/RateCodeExtras", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCodeExtras(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCodeExtras data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



// API to Get Rate Code Room Types Data
app.get("/RateCodeRoomTypes", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCodeRoomTypes(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCodeRoomTypes data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


///////////////////ForeignKey APIs 



////////////// This is the function to getRateCategory from RateClassID
const getRateCategoryRateClassID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,rateClass FROM rateClass where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

///////////// This is the function to Floor from Block.id
const getExtraSubGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM subGroup where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


///////////// This is the function to Floor from Block.id
const getRoomFloorID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,floor FROM floor where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


///////////// This is the function to Floor from Block.id
const getRoomBlockID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM block where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

//////////// This is the function to get Accounts from the Database
const getAccountsByID = async (companyid) => {
  const Data = await getBookerByID(companyid);
  console.log(Data)
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM accounts WHERE companyid=?";
    const values = [companyid]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log(result)
        result[0]['booker'] = Data
        resolve(result);
      }
    });
  });
};

const getBookerByID = async (companyid) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM booker WHERE id=?";
    const values = [companyid]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// API to Get Accounts Data
app.get("/getAccountsByID", async (req, res) => {
  try {
    let companyid = req.query['companyid']
    const result = await getAccountsByID(companyid);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Accounts By ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


////////////// This is the function to Floor from Block.id
const getExtraGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groups where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Floor BlockID from Block.id
app.get("/getRateCategoryRateClassID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCategoryRateClassID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['rateClass']
      delete result[i]['rateClass'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Rate Class data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});






// API to Get Floor BlockID from Block.id
app.get("/getExtraGroupID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getExtraGroupID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['groupCode']
      delete result[i]['groupCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'group ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




// API to Get Floor BlockID from Block.id
app.get("/getExtraSubGroupID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getExtraSubGroupID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['subGroup']
      delete result[i]['subGroup'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'group ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});





// API to Get Floor BlockID from Block.id
app.get("/getRoomFloorID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomFloorID(hotelID);
    for (i = 0; i < result.length; i++) {
      // console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['floor']
      delete result[i]['floor'];
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'group ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});





// API to Get Room BlockID from Block.id
app.get("/getRoomBlockID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomBlockID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['block']
      delete result[i]['block'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



///////////// This is the function to Floor from Block.id
const getRoomRoomTypeID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,roomType FROM roomType where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Room BlockID from Block.id
app.get("/getRoomRoomTypeID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomRoomTypeID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomType']
      delete result[i]['roomType'];
      // delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RoomType data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




///////////// This is the function to Floor from Block.id
const getSubGroupGroupID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groups where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Room BlockID from Block.id
app.get("/getSubGroupGroupID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getSubGroupGroupID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['id']
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RoomType data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function to Floor from Block.id
const getRoomInventoryRoomTypeID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,roomType FROM roomType where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Room BlockID from Block.id
app.get("/getRoomInventoryRoomTypeID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomInventoryRoomTypeID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomType']
      delete result[i]['roomType'];
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RoomType data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function to Floor from Block.id
const getRoomInventorytForecastRoomTypeID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,roomType FROM roomType where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Room BlockID from Block.id
app.get("/getRoomInventorytForecastRoomTypeID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomInventorytForecastRoomTypeID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomType']
      delete result[i]['roomType'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RoomType data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



///////////// This is the function to Floor from Block.id
const getRoomTypeRoomClassID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,roomClass FROM roomClass where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// API to Get Room BlockID from Block.id
app.get("/getroomtyperoomclassid", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRoomTypeRoomClassID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomClass']
      delete result[i]['roomClass'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Class data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function get Account Manager ID from CustomUser For Accounts
const getAccountsAccountManagerID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,firstName,lastName FROM customUser where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// API to get Account Manager ID from CustomUser For Accounts
app.get("/getaccountsaccountmanagerid", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getAccountsAccountManagerID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['firstName']
      delete result[i]['roomClass'];
      delete result[i]['id'];

    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Class data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodeMarketID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,marketCode FROM marketCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeMarketID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCodeMarketID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['marketCode']
      delete result[i]['marketCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Market Code data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodePackageID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,packageCode FROM package where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodePackageID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodePackageID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['packageCode']
      delete result[i]['packageCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Package Code data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodeSourceID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,sourceCode FROM source where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeSourceID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodeSourceID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['sourceCode']
      delete result[i]['sourceCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Package Code data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodeRateCategory = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,rateCategory FROM rateCategory where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeRateCategory", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodeRateCategory(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['rateCategory']
      delete result[i]['rateCategory'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'rateCategory  data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




///////////// This is the function is to store transaction Code tax in transactionCode Taxes
const addTransactionCodeTaxes = async (transactionCodeID, taxID) => {
  console.log(transactionCodeID, taxID)
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO  transactionCodeTaxes ( transactionCodeID, taxID) VALUES ( ?, ?)`;
    const values = [transactionCodeID, taxID]
    console.log(values)

    if ((transactionCodeID == undefined || transactionCodeID == '') || (taxID == undefined || taxID == '')) {
      console.log("ERROR ,Parameters missing Taxes")
    }
    else if (validate2("transactionCodeID", transactionCodeID, 1, 20, "", "") || validate2("taxID", taxID, 1, 20, "", "")) {
      console.log("Invalid Parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });
}


// API to to store transaction Code tax in transactionCode Taxes
app.post("/addtransactioncodetaxes", async (req, res) => {
  try {
    // let hotelID = req.query['transactionCodeID']
    const { transactionCodeID, taxID } = req.body
    console.log(transactionCodeID)
    const result = await addTransactionCodeTaxes(transactionCodeID, taxID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'transaction Code tax  data Added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});






///////////// This is the function is to Availability 
const getAvailabilityMatrix = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT oneAdultPrice,twoAdultPrice,threeAdultPrice,extraAdultPrice,extraChildPrice ,roomType FROM rateCodeRoomRate INNER JOIN roomType ON roomTypeID=roomType.id
`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};






///////////// This is the function is to Cancellation from ReservationID
const getRateCodeRooTypes = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,roomType FROM roomType where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeRooTypes", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodeRooTypes(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomType']
      delete result[i]['roomType'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'roomType  data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodeAccountID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,addAccounts FROM rateCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeAccountID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodeAccountID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['addAccounts']
      delete result[i]['addAccounts'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Account Name  data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getRateCodeTransactionID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,transactionCode FROM transactionCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getRateCodeTransactionID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getRateCodeTransactionID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['transactionCode']
      delete result[i]['transactionCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Transaction Code data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



///////////// This is the function is to Cancellation from ReservationID
const getGuestProfileVipID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,vipType FROM vip where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getGuestProfileVipID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getGuestProfileVipID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['vipType']
      delete result[i]['vipType'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Vip data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



///////////// This is the function is to Cancellation from ReservationID
const getGuestProfileCountry = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,name FROM countries`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getGuestProfileCountry", async (req, res) => {
  try {
    // let hotelID = req.query['hotelID']

    const result = await getGuestProfileCountry();
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['name']
      delete result[i]['name'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Countries data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getGuestProfileCompanyID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT companyid,accountName FROM accounts where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getGuestProfileCompanyID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getGuestProfileCompanyID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['companyid'];
      result[i]['label'] = result[i]['accountName']
      delete result[i]['accountName'];
      delete result[i]['companyid'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Vip data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    con
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


///////////// This is the function is to Cancellation from ReservationID
const getCompanyDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM companyDetails where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};





///////////// This is the function is to Cancellation from ReservationID
const getAccountsRateCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,rateCode  FROM rateCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get ReservationID from room class
app.get("/getAccountsRateCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getAccountsRateCode(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['rateCode']
      delete result[i]['rateCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RateCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});





///////////// This is the function is to get Guest Name from Booking Tran
const getGuestNameFromBookingTran = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT FirstName,LastName FROM BookingTran`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        for (i = 0; i < result.length; i++) {
          console.log(result[i])
          result[i]['value'] = String(result[i]['FirstName']) + ' ' + String(result[i]['LastName']);
          console.log(result[i]['value'])
          result[i]['label'] = String(result[i]['FirstName']) + ' ' + String(result[i]['LastName'])
          console.log(result[i]['label'])
          delete result[i]['FirstName'];
          delete result[i]['LastName'];
        }
        resolve(result);
      }
    });
  });
};


// API to Get Guest Name from Booking Tran
app.get("/getguestnamefrombookingtran", async (req, res) => {
  try {

    const result = await getGuestNameFromBookingTran();

    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Guest Name from Booking Tran Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




///////////// This is the function is to get Room from Room Management
const getRoomNumberFromRoomManagement = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT roomNumber FROM room`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        for (i = 0; i < result.length; i++) {
          // console.log(result[i])
          result[i]['value'] = result[i]['label'];
          // console.log(result[i]['value'])
          result[i]['label'] = result[i]['roomNumber'];
          // console.log(result[i]['label'])
          // delete result[i]['FirstName'];
        }
        resolve(result);
      }
    });
  });
};


// API to Get Room from Room management
app.get("/getroomnumberfromroommanagement", async (req, res) => {
  try {

    const result = await getRoomNumberFromRoomManagement();

    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room from Room management Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});

















////  ---------------------------------------------- UPDATE Function -------------------------------------------////




///// Update Function to Update Account roster  
const updateAccounts = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE assignAttendantShift SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};

///// Update Function to Update Room Inventory  
// const updateRoomInventory = async (columnsToUpdate, id) => {
//   return new Promise((resolve, reject) => {

//     let query = 'UPDATE roomInventory SET ';
//     let values = [];
//     for (let column in columnsToUpdate) {
//       if (columnsToUpdate.hasOwnProperty(column)) {
//         query += `${column} = ?, `;
//         values.push(columnsToUpdate[column]);
//       }
//     }
//     query = query.slice(0, -2);
//     query += ` WHERE id = ${id}`;
//     connection.query(query, values, (err, result) => {
//       if (err) {
//         console.log(err)
//         reject(err);
//       }
//       else {
//         console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
//         resolve(result);
//       }
//     })
//   })
// };


///// Update Function to Update Room Wise Inventory  
const updateRoomWiseInventory = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE roomWiseInventory SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Adjust Transaction 
const updateAdjustTransaction = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE adjustTransaction SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Block 
const updateBlock = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE block SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Booker 
const updateBooker = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE booker SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Booking Details 
const updateBookingDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE bookingDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Card Details 
const updateCardDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE cardDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Change Room
const updateChangeRoom = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE changeRoom SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Commision
const updateCommission = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE commission SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Reservation Booking 
const updateReservationBooking = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE BookingTran SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};

///// Update Function to Update Company Details
const updateCompanyDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE companyDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Company Information
const updateCompanyInformation = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE companyInformation SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Custom User
const updateCustomUser = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE customUser SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


///// Update Function to Update Daily Details
const updateDeailyDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE dailyDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Department
const updateDepartment = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE department SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Document Details
const updateDocumentDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE documentDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Documents
const updateDocuments = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE documents SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Extras
const updateExtras = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE extra SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Fixed Charge
const updateFixedCharge = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE fixedCharge SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Groups
const updateGroups = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE groups SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Guest Profile
const updateGuestProfile = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE guestProfile SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Hotel Details
const updateHotelDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE hotelDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update ID Details
const updateIDDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE idDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};





/// Update Function to  updateRoomStatus
const updateRoomStatus = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE room SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Manage Profile
const updateManageProfile = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {
    let query = 'UPDATE idDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Market Code
const updateMarketCode = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE marketCode SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Market Group
const updateMarketGroup = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE marketGroup SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Membership Details
const updateMembershipDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE membershipDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Membership Level
const updateMembershipLevel = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE membershipLevel SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Membership Type
const updateMembershipType = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE membershipType SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Package
const updatePackage = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE package SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Payment Code
const updatePaymentCode = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE paymentCode SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Payment Type
const updatePaymentType = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE paymentType SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Update Room Occupancy
const updateRoomOccupancy = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE roomOccupancy SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


















/// ---------------------------------------------- UPDATE API -------------------------------------------///
//API to update Accounts  
app.put('/updataccounts', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateAccounts(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Accounts",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Room Inventory  
app.put('/updateroominventory', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateRoomInventory(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Room Inventory",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Room Wise Inventory
app.put('/updateroomwiseinventory', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateRoomWiseInventory(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Room Wise Inventory",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Adjust Transaction  
app.put('/updateadjusttransaction', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateAdjustTransaction(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Adjust Transaction  ",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Block  
app.put('/updateblock', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateBlock(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Block",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updateRoomStatus', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateRoomStatus(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated RoomStatus",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Booker  
app.put('/uodatebooker', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateBooker(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Booker",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Booking Details  
app.put('/uodatebookingDetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateBookingDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Booking Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Reservation Booking  
app.put('/updateReservationBooking', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateReservationBooking(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Reservation Booking",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update CardDetails 
app.put('/upatecarddetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateCardDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated CardDetails",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Change Room
app.put('/updatechangeroom', async (req, res) => {
});


//API to update Commission
app.put('/updatecommission', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateCommission(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Commission",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Company Details
app.put('/updatecompanydetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateCompanyDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Company Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Company Information
app.put('/updatecompanyinformation', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateCompanyInformation(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Company Information",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Custom User
app.put('/updatecustomuser', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateCustomUser(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Custom User",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Daily Details
app.put('/updatedailydetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateDeailyDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Daily Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Department
app.put('/updatedepartment', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateDepartment(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Department",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Document Details
app.put('/updatedocumentdetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateDocumentDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Document Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Documents
app.put('/updatedocuments', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateDocuments(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Documents",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Extras
app.put('/updateextras', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateExtras(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Extras",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Fixed Charge
app.put('/updatefixedcharge', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateFixedCharge(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Fixed Charge",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Groups
app.put('/updategroups', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateGroups(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Groups",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Guest Profile
app.put('/updateguestprofile', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateGuestProfile(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Guest Profile",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Hotel Details
app.put('/updatehoteldetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateHotelDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Hotel Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update ID Details
app.put('/updateiddetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateIDDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated ID Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



//API to update Manage Profile
app.put('/updatemanageprofile', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateManageProfile(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Manage Profile",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Market Code
app.put('/updatemarketcode', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateMarketCode(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Market Code",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Market Group
app.put('/updatemarketgroup', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateMarketGroup(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Market Group",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Membership Details
app.put('/updatemembershipdetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateMembershipDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Membership Details",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Membership Level
app.put('/updatemembershiplevel', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateMembershipLevel(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Membership Level",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Membership Type
app.put('/updatemembershiptype', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateMembershipType(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Membership Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Package
app.put('/updatepackage', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatePackage(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Package",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Code
app.put('/updatepaymentcode', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatePaymentCode(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Code",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updatepaymenttype', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatePaymentType(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Room Occupancy
app.put('/updateroomoccupancy', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateRoomOccupancy(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Room Occupancy",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});



















/// -------------------------- Front Desk ------------------------------ ///
//GET API for master reservation
app.get('/getMasterReservation', async (req, res) => {
  $query = "SELECT * FROM TaxDetails"
  connection.query($query, function (err, rows, fields) {
    if (err) {
      console.log("An error ocurred performing the query.");
      return;
    }
    else if (rows == '') {
      res.send('No data available')
    }
    else {
      console.log("Query succesfully executed");
      TaxDetails = { "TaxDetails": rows }
      connection.query("SELECT * FROM SharerDetails", function (err, rows, fields) {
        if (err) {
          console.log("An error ocurred performing the query.");
          return;
        }
        else if (rows == '') {
          res.send('No data available')
        }
        else {
          console.log("Query succesfully executed");
          var Sharer = { "Sharer": rows }
          connection.query("SELECT * FROM RentalInfo", function (err, rows, fields) {
            if (err) {
              console.log("An error ocurred performing the query.");
              return;
            }
            else if (rows == '') {
              res.send('No data available')
            }
            else {
              console.log("Query succesfully executed");
              var RentalInfo = { "RentalInfo": rows }

              connection.query("SELECT * FROM BookingTran", function (err, rows, fields) {
                if (err) {
                  console.log("An error ocurred performing the query.");
                  return;
                }
                else if (rows == '') {
                  res.send('No data available')
                }
                else {
                  console.log("Query succesfully executed");
                  rows = Object.assign({}, rows[0], TaxDetails, Sharer, RentalInfo)
                  var BookingTran = { "BookingTran": rows }
                  connection.query("SELECT * FROM OtherBasicDetails", function (err, rows, fields) {
                    if (err) {
                      console.log("An error ocurred performing the query.");
                      return;
                    }
                    else if (rows == '') {
                      res.send('No data available')
                    }
                    else {
                      console.log("Query succesfully executed");
                      var obj = Object.assign({}, BookingTran, rows[0])
                      var final = { "Reservations": { "Reservation": obj } }
                      if (obj != '') {
                        return res.json(final);
                        // console.log(rows);
                      }
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  })
})


/// This is the function is to get Room Count
const getRoomCount = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(roomNumber) as Rooms FROM room`;
    // const values = [End]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Room Count
app.get("/getRoomCount", async (req, res) => {
  try {
    const result = await getRoomCount();
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Count Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function is to get 
const getRoomInformation = async (floorID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT room.id,frontOfficeStatus,roomStatus,roomNumber,roomType.roomType FROM room INNER JOIN roomType on roomTypeID=roomType.id WHERE floorID=?`;
    const values = [floorID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Room Count
app.get("/getRoomInformation", async (req, res) => {
  try {
    let floorID = req.query['floorID']

    const result = await getRoomInformation(floorID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Count Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function is to get Room Which are not in roomWiseInventory
const getRoomBasedOnStatus = async (fromDate, toDate, floorID) => {
  return new Promise((resolve, reject) => {
    // const sql = `SELECT DISTINCT roomID,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID  WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service')`;
    const sql = `SELECT DISTINCT roomID,room.id,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?`;
    const values = [fromDate, toDate, floorID, fromDate, toDate]
    // console.log(sql)
    // console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        // console.log(error) 
        reject(error);
      } else {
        // console.log(result) 
        resolve(result);
      }
    });
  });
};



/// API to Get Room Count Based on Room Wise Inventory
app.get("/getRoomBasedOnStatus", async (req, res) => {
  try {
    let fromDate = req.query['fromDate']
    let toDate = req.query['toDate']
    let floorID = req.query['floorID']


    const result = await getRoomBasedOnStatus(fromDate, toDate, floorID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Room Count Based on Room Wise Inventory Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function is to get Booking Tran
const getBookingTran = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT distinct SubBookingId,guestID, id,FirstName, LastName, RoomTypeName, Start, End, PmsStatus, RoomNumber FROM BookingTran ORDER BY id ASC`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Booking Tran
app.get("/getbookingtran", async (req, res) => {
  try {
    // let hotelID = req.query['hotelID']
    const result = await getBookingTran();
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




/// ------ For Arrivls ------ ///
/// This is the function is to get Booking Tran by Arrival
const getArrival = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE PmsStatus='Created'`;
    // const values = [hotelID]
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Booking Tran On Basis of Arrival
app.get("/getarrival", async (req, res) => {
  try {
    // let hotelID = req.query['hotelID']
    const result = await getArrival();
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran Arrivals data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// ------ For Departures ------ ///
/// This is the function is to get Booking Tran by Departures
const getDepartures = async (End, PmsStatus) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE End=? AND PmsStatus=?`;
    const values = [End, PmsStatus]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Booking Tran On Basis of Departures
app.get("/getdepartures", async (req, res) => {
  try {
    let End = req.query['End']
    let PmsStatus = req.query['PmsStatus']

    const result = await getDepartures(End, PmsStatus);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran Departures data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function is to get Booking Tran by Today Date
const getToday = async (Start) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE Start=?`;
    const values = [Start]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function is to get Booking Tran by Tomarrow Date
const getTomarrow = async (Start) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE Start=?`;
    const values = [Start]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function is to get In House Guest by Today PmsStatus
const getInHouseGuest = async (PmsStatus) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE PmsStatus=?`;
    const values = [PmsStatus]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function is to get StayOver
const getStayOverBWToday = async (Start, End) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM BookingTran WHERE Start<? AND End>?`;
    const values = [Start, End]
    // const values = [End]

    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Booking Tran On Basis of Today
app.get("/getStayOverBWToday", async (req, res) => {
  try {
    let Start = req.query['Start']
    let End = req.query['End']

    const result = await getStayOverBWToday(Start, End);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran by InHouseGuest By PmsStatus data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Booking Tran On Basis of Today
app.get("/getInHouseGuest", async (req, res) => {
  try {
    let PmsStatus = req.query['PmsStatus']
    const result = await getInHouseGuest(PmsStatus);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran by InHouseGuest By PmsStatus data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Booking Tran On Basis of Today
app.get("/gettoday", async (req, res) => {
  try {
    let Start = req.query['Start']
    const result = await getToday(Start);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran by Today Date data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get Booking Tran On Basis of Tomarrow
app.get("/gettomarrow", async (req, res) => {
  try {
    let Start = req.query['Start']
    const result = await getTomarrow(Start);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Booking Tran by Tomarrow Date data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});




















//---------------Add Function--------------------//
///This is the Function to add CompanyInformation for reservation////////
const addCompanyInformation = async (source, companyID, guestProfileID) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO companyInformation(source, companyID, guestProfileID) VALUES (?,?, ?)`;
    const values = [source, companyID, guestProfileID]
    console.log(values)
    if ((source == undefined || source == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const reservationid = result.insertId;
          let companyInfoJson = { "reservationid": reservationid, "source": source, "companyID": companyID, "guestProfileID": guestProfileID }
          console.log(companyInfoJson)
          resolve(companyInfoJson);
        }
      });
    }
  });
};



// ////////This is the Function to add dummy Database for reservation////////


// const addDummyReservation = async (hotelid, companyID, checkIn, checkOut, adults, children, quantity, reservationid, source) => {
//   console.log(hotelid, companyID, checkIn, checkOut, adults, children, quantity, reservationid, source)
//   let is_FIT = 0;
//   let rateCode = 0;
//   if (source == '2') {
//       const result = await getAccountbyId(hotelid, companyID);
//       console.log("we are here");
//       console.log(result);
//       if (result.length == 1) {
//           if (result[0].rateCode != null && result[0].rateCode != null)
//               //contract rate exists.else it is FIT booking.  
//               ratecode = result[0].rateCode;
//           // console.log(ratecode);
//           rateinfo = await getRateCodeSelection(hotelid, ratecode, checkIn, checkOut, adults, children);
//           return rateinfo;
//           is_FIT = 0;

//       }

//   }
//   else {
//       is_FIT = 1;
//       if (source == '1' || is_FIT == 1) {
//           console.log("FIT")
//           rateinfo = await getRateCodeSelectionfit(hotelid, 1, checkIn, checkOut, adults, children);
//           return rateinfo;
//       }
//   }


//   return new Promise((resolve, reject) => {
//       // resolve(result);
//       if (source == '2') {
//           // console.log("I'm corporate")
//           // console.log("Hello")
//           const sql = 'INSERT INTO dummyReservation(hotelID, reservationID, source, companyID, checkIn, checkOut, adults, children, quantity, status) VALUES (?,?,?,?,?,?,?,?, ?, ?) ';
//           const values = [hotelid, reservationid,  source, companyID, checkIn, checkOut, adults, children, quantity, 3]
//           console.log(values)
//           // if ((checkIn == undefined || checkIn == '') || (checkOut == undefined || checkOut == '') || (adults == undefined || adults == '') || (children == undefined || children == '') || (quantity == undefined || quantity == '')) {
//           //     console.log("ERROR ,Parameters missing")
//           // }
//           // else {
//               connection.query(sql, values, (error, result) => {
//                   if (error) {
//                       reject(error);
//                   } else {
//                       resolve(result);
//                   }
//               });
//           // }
//       }

//   });
// };


///This is the Function to add dummy Database for reservation////////
const addDummyReservation = async (hotelID, source, companyID, reservationID, checkIn, checkOut, adults, children, quantity) => {
  console.log("In Dummy Reservation")
  console.log(hotelID, source, companyID, reservationID, checkIn, checkOut, adults, children, quantity)
  let is_FIT = 0;
  let rateCode = 0;
  let rateinfo
  if (source == '2') {
    const result = await getAccountbyId(hotelID, companyID);
    if (result.length) {
      if (result[0].rateCode != null && result[0].rateCode != null)
        rateCode = result[0].rateCode;
      rateinfo = await getRateCodeSelection(hotelID, rateCode, checkIn, checkOut, adults, children);
      is_FIT = 0;
    }
  }
  else {
    is_FIT = 1;
    if (source == '1' || is_FIT == 1)
      rateinfo = await getRateCodeSelectionfit("1", checkIn, checkOut, adults, children);
  }
  return new Promise((resolve, reject) => {
    console.log("In this function")
    console.log(hotelID, reservationID, source, companyID, checkIn, checkOut, adults, children, quantity)
    const sql = `INSERT INTO dummyReservation (hotelID, reservationID, source, companyID, checkIn, checkOut, adults, children, quantity, status) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const values = [hotelID, reservationID, source, companyID, checkIn, checkOut, adults, children, quantity, 3]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(rateinfo);
      }
    });
  });
};


///This is the Function to add Temp Rate Code Selection reservation////////
const addTempRateCodeSelection = async (roomType, baseRate, totalRate, availability, status) => {
  return new Promise((resolve, reject) => {
    console.log("hii")
    const sql2 = "SELECT reservationID,companyID FROM dummyReservation WHERE hotelID=? ORDER BY reservationID DESC LIMIT 1";
    val = [1]
    connection.query(sql2, val, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        // resolve(result);
        console.log(rows[0]['reservationID'])
        console.log(rows[0]['companyID'])
        console.log("Hello")
        const sql = `INSERT INTO tempRateCodeSelection(reservationID, companyID, roomType, baseRate, totalRate, availability, status) VALUES (?,?,?,?,?,?,'4')`;
        const values = [rows[0]['reservationID'], rows[0]['companyID'], roomType, baseRate, totalRate, availability, status]
        console.log(values)
        if ((roomType == undefined || roomType == '') || (baseRate == undefined || baseRate == '')) {
          console.log("ERROR ,Parameters missing")
        }
        else {
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              const roomTypeid = result.roomType;
              const reservationid = result.reservationid;
              resolve(reservationid, roomTypeid, result);
            }
          });
        }
      }
    });
  });
};


///This is the Function to add Pick Up details for reservation////////
const addTempPackage = async (packageName) => {
  return new Promise((resolve, reject) => {
    const sql2 = "SELECT reservationID FROM tempRateCodeSelection WHERE hotelID=? ORDER BY reservationID DESC LIMIT 1";
    val = [1]
    connection.query(sql2, val, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        // resolve(result);
        console.log(rows[0]['reservationID'])
        console.log("Hello")
        const sql = `INSERT INTO temppackage(reservationID, packageName ) VALUES (?,?)`;
        const values = [rows[0]['reservationID'], packageName]
        console.log(values)
        if ((packageName == undefined || packageName == '')) {
          console.log("ERROR ,Parameters missing")
        }
        else {
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};


///This is the Function to add extras for reservation////////
const addTempExtra = async (reservationID, ETA, ETD, extraDescription, resType, origin, agent, source, booker, features, package, market, comment, billingInstructions) => {
  return new Promise((resolve, reject) => {
    console.log(reservationID)
    const sql = `INSERT INTO tempExtra(reservationID, extraDescription, source, agent, origin, market, comment, billingInstructions, ETA, ETD, resType, booker, package, features) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [reservationID, extraDescription, source, agent, origin, market, comment, billingInstructions, ETA, ETD, resType, booker, package, features]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// Function is to add Daily Details
const addDailyDetails = async (reservationID, date, roomType, rateCode, totalRate, roomRate, packageRate, roomNumber, package, adults, children, discountAmount, market, source) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO dailyDetails (reservationID, date, roomType, rateCode, totalRate, roomRate, packageRate, roomNumber, package, adults, children, discountAmount, market, source ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;
    const values = [reservationID, date, roomType, rateCode, totalRate, roomRate, packageRate, roomNumber, package, adults, children, discountAmount, market, source]
    console.log(values)

    if ((reservationID == undefined || reservationID == '') || (date == undefined || date == '') || (roomType == undefined || roomType == '') || (rateCode == undefined || rateCode == '') || (totalRate == undefined || totalRate == '') || (roomRate == undefined || roomRate == '') || (packageRate == undefined || packageRate == '') || (roomNumber == undefined || roomNumber == '') || (package == undefined || package == '') || (adults == undefined || adults == '') || (children == undefined || children == '') || (discountAmount == undefined || discountAmount == '') || (market == undefined || market == '') || (source == undefined || source == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else if ((validate('reservationID', reservationID, 1, 20, '', '1')) || (validate('date', date, 3, 30, 'SpecialChars', '0')) || (validate('roomType', roomType, 1, 20, '', '1')) || (validate('rateCode', rateCode, 1, 20, '', '1')) || (validate('totalRate', totalRate, 3, 20, '', '1')) || (validate('roomRate', roomRate, 1, 20, '', '1')) || (validate('packageRate', packageRate, 1, 30, 'SpecialChars', '0')) || (validate('roomNumber', roomNumber, 1, 10, '', '1')) || (validate('package', package, 1, 20, '', '1')) || (validate('adults', adults, 1, 10, '', '1')) || (validate('children', children, 1, 10, '', '1')) || (validate('discountAmount', discountAmount, 1, 10, '', '1')) || (validate('market', market, 1, 10, '', '1')) || (validate('source', source, 1, 10, '', '1'))) {
      console.log("Invalid Parameter")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    }
  });

}


///This is the Function to add GuestProfile Database for reservation////////
const addGuestProfile = async (reservationID, salutation, name, email, phoneNumber, gstID, nationality, dob, vipID, addressOne, addressTwo, anniversary, companyID,
  country, state, notes, city, postalCode, guestpreferencenotes, guestType, guestStatus, lastVisit, isActive, isBlackListed, lastRateID, lastRoomID, negotiatedRateID
) => {
  return new Promise((resolve, reject) => {
    //  const sql2 = "SELECT reservationID FROM tempextra WHERE hotelID=? ORDER BY reservationID DESC LIMIT 1";
    // val = [1]
    // connection.query(sql2, val, (error, rows) => {
    //   if (error) {
    //     reject(error);
    //   } else {
    //     // resolve(result);
    //     console.log(rows[0]['reservationID'])
    //     console.log("Hello")
    const sql = `INSERT INTO guestProfile(reservationID,salutation, name, email,phoneNumber,gstID,nationality, dob, vipID, addressOne, addressTwo,anniversary, companyID, 
  country,state,notes,city, postalCode, guestpreferencenotes,guestType, guestStatus, lastVisit, isActive ,isBlackListed, lastRateID,lastRoomID, negotiatedRateID) 
  VALUES (?,?,?,?,? ,?,?,?,?,? ,?,?,?,?,?, ?,?,?,?,1 ,1,1,1,1,1 ,1,1)`;
    const values = [reservationID, salutation, name, email, phoneNumber, gstID, nationality, dob, vipID, addressOne, addressTwo, anniversary, companyID,
      country, state, notes, city, postalCode, guestpreferencenotes, guestType, guestStatus, lastVisit, isActive, isBlackListed, lastRateID, lastRoomID, negotiatedRateID]
    console.log(values)
    if ((phoneNumber == undefined) || (email == undefined)) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          const guestID = result.id;
          resolve(result.insertId);
        }
      });
    }
  });
}


///This is the Function to add GuestProfile Database for reservation////////
const addManageProfile = async (name, viewBy, profileNumber, membershipLevel, membershipNumber, membershipType, clientID, address, country, state, postalCode, idNumber, communication, businessSegment, arrivalTime, ARNumber, taxID, owner) => {
  return new Promise((resolve, reject) => {

    const sql = `INSERT INTO manageProfile(name, viewBy, profileNumber, membershipLevel, membershipNumber, membershipType, clientID, address, country, state, postalCode,idNumber,communication, businessSegment, arrivalTime,ARNumber, taxID, owner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [name, viewBy, profileNumber, membershipLevel, membershipNumber, membershipType, clientID, address, country, state, postalCode, idNumber, communication, businessSegment, arrivalTime, ARNumber, taxID, owner]
    console.log(values)
    if ((name == undefined || name == '') || (viewBy == undefined || viewBy == '') || (profileNumber == undefined || profileNumber == '') || (membershipLevel == undefined || membershipLevel == '') || (clientID == undefined || clientID == '') || (address == undefined || address == '') || (country == undefined || country == '') || (state == undefined || state == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  });
};


///  This is the Function to add payment Type Database for reservation  ///
const addResPaymentType = async (reservationID, paymentTypeID, cardNumber, cvv, cardHolderName, expiryDate) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO resPaymentInformation (reservationID, paymentTypeID, cardNumber, cvv, cardHolderName, expiryDate) VALUES (?,?,?,?,?,?)`;
    const values = [1, paymentTypeID, cardNumber, cvv, cardHolderName, expiryDate]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  })
};



///This is the Function to add Pick Up details for reservation////////
const addPickUpDetails = async (reservationID, pickUpDate, pickUpTime, pickUpStationCode, pickUpCarrierCode, pickUpTransportType, pickUpRemarks, dropDate, dropTime, dropStationCode, dropCarrierCode, dropTransportType, dropRemarks) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO pickUpDetails(reservationID, pickUpDate, pickUpTime, pickUpStationCode, pickUpCarrierCode, pickUpTransportType, pickUpRemarks, dropDate, dropTime, dropStationCode, dropCarrierCode, dropTransportType, dropRemarks ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [(reservationID || '1'), (pickUpDate || ''), (pickUpTime || ''), (pickUpStationCode || ''), (pickUpCarrierCode || ''), (pickUpTransportType || ''), (pickUpRemarks || ''), (dropDate || ''), (dropTime || ''), (dropStationCode || ''), (dropCarrierCode || ''), (dropTransportType || ''), (dropRemarks || '')]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


///This is the Function to add Comfirmed Reservation  for reservation////////
const addConfirmedReservation = async (checkIn, checkOut, adults, children, quantity, roomType, baseRate, totalRate, availability, package, paymentInformation, cardNumber, cardHolderName, expiryDate, pickupRequired, dropRequired, status) => {
  console.log("Function call")
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO confirmedReservation(checkIn, checkOut, adults, children, quantity,roomType,baseRate,totalRate,availability,package,paymentInformation,cardNumber,cardHolderName,expiryDate,pickupRequired,dropRequired,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [checkIn, checkOut, adults, '0', quantity, roomType, baseRate, totalRate, availability, package, paymentInformation, cardNumber, cardHolderName, expiryDate, pickupRequired, dropRequired, status]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

  });
};

















//---------------POST APIs--------------------//
/// API TO ADD Company Information Details
app.post('/CompanyInformation', async (req, res) => {
  try {
    const { source, companyID, guestProfileID } = req.body;
    const result = await addCompanyInformation(source, companyID, guestProfileID);
    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Company Information Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


// /// API TO ADD DummyReservation Details
// app.post('/addDummyReservation', async (req, res) => {
//   try {
//     const {  checkIn, checkOut, adults, children, quantity } = req.body;
//       console.log("companyID")
//   console.log(companyID)

//     const result1 =await addCompanyInformation(source,companyID)
//     console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiii")
//     console.log(result1)
//     const result = await addDummyReservation(1, checkIn, checkOut, adults, children, quantity,1);
//     res.status(200).send({
//       status: 'success',
//       statuscode: res.statusCode,
//       message: "Succesfully added dummyReservation Details",
//       data: result
//     })
//   }
//   catch (error) {
//     res.status(403).send({
//       status: "Failed",
//       statusCode: 403,
//       message: "Forbidden"
//     })
//   }
// });


/// API TO ADD ReservationExtra Details
app.post('/addReservationExtra', async (req, res) => {
  try {
    const { reservationID, extraID } = req.body;
    const result = await addReservationExtra(reservationID, extraID);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Reservation Extras Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD TempRateCodeSelection Details
app.post('/addTempRateCodeSelection', async (req, res) => {
  try {
    const { roomType, baseRate, totalRate, availability, status } = req.body;
    const result = await addTempRateCodeSelection(roomType, baseRate, totalRate, availability, status);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added TempRateCodeSelection Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD Company Information Details
app.post('/addTempPackage', async (req, res) => {
  try {
    const { packageName } = req.body;
    const result = await addTempPackage(packageName);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Package Information Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD Company Information Details 
app.post('/addTempExtra', async (req, res) => {
  try {
    const { reservationID, ETA, ETD, extraDescription, resType, origin, agent, source, booker, features, package, market, comment, billingInstructions } = req.body;
    const result = await addTempExtra(reservationID, ETA, ETD, extraDescription, resType, origin, agent, source, booker, features, package, market, comment, billingInstructions);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Package Information Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API for add daily Details
app.post('/addDailyDetails', async (req, res) => {
  try {
    const { reservationID, date, roomType, rateCode, totalRate, roomRate, packageRate, roomNumber, package, adults, children, discountAmount, market, source } = req.body;
    const result = await addDailyDetails(reservationID, date, roomType, rateCode, totalRate, roomRate, packageRate, roomNumber, package, adults, children, discountAmount, market, source);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
})


/// API TO ADD Mange Profile Details
app.post('/mangeProfile', async (req, res) => {
  try {
    const { name, viewBy, profileNumber, membershipLevel, membershipNumber, membershipType, clientID, address, country, state, postalCode, idNumber, communication, businessSegment, arrivalTime, ARNumber, taxID, owner } = req.body;
    const result = await addManageProfile(name, viewBy, profileNumber, membershipLevel, membershipNumber, membershipType, clientID, address, country, state, postalCode, idNumber, communication, businessSegment, arrivalTime, ARNumber, taxID, owner);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added mangeProfile Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD Payment Type Details
app.post('/resPaymentType', async (req, res) => {
  try {
    const { reservationID, paymentTypeID, cardNumber, cvv, cardHolderName, expiryDate } = req.body;
    const result = await addResPaymentType(reservationID, paymentTypeID, cardNumber, cvv, cardHolderName, expiryDate);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Payment Type Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD Mange Profile Details
app.post('/pickUp', async (req, res) => {
  try {
    const { reservationID, pickUpDate, pickUpTime, pickUpStationCode, pickUpCarrierCode, pickUpTransportType, pickUpRemarks, dropDate, dropTime, dropStationCode, dropCarrierCode, dropTransportType, dropRemarks } = req.body;
    const result = await addPickUpDetails(reservationID, pickUpDate, pickUpTime, pickUpStationCode, pickUpCarrierCode, pickUpTransportType, pickUpRemarks, dropDate, dropTime, dropStationCode, dropCarrierCode, dropTransportType, dropRemarks);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added PickUp Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


/// API TO ADD Comfirmed Reservation  Details
app.post('/ConfirmedReservation', async (req, res) => {
  console.log('api call')
  try {
    const { checkIn, checkOut, adults, children, quantity, roomType, baseRate, totalRate, availability, package, paymentInformation, cardNumber, cardHolderName, expiryDate, pickupRequired, dropRequired, status } = req.body;
    console.log(paymentInformation, cardNumber, cardHolderName, expiryDate)
    const result = await addConfirmedReservation(checkIn, checkOut, adults, children, quantity, roomType, baseRate, totalRate, availability, package, paymentInformation, cardNumber, cardHolderName, expiryDate, pickupRequired, dropRequired, status);

    console.log(result)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added Confirmed Reservation Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});
















//---------------Get Function--------------------//
const getAccountbyId = async (hotelID, companyid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM accounts where hotelID=? and companyid =?`;
    const values = [hotelID, companyid];
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


const getTempExtra = async (hotelID) => {
  return new Promise((resolve, reject) => {
    // console.log(companyid);
    // console.log(hotelID);
    const sql = `SELECT * FROM tempExtra where hotelID=? ORDER By id DESC`;
    const values = [hotelID];

    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });
};


/// This is the function to get Companyname From Company Details
const getAccountName = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT companyid, accountName FROM accounts where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      console.log(error)
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(result)
      }
    });
  });
};


/// This is the function to get Companyname From Company Details
const getCompanyInformation = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM companyInformation where hotelID=? ORDER BY id DESC LIMIT 1`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      console.log(error)
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(result)
      }
    });
  });
};


/// This is the function to get marketGroup from the  Database. 
const getDummyReservation = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT checkIn, checkOut, adults, children,quantity FROM dummyReservation WHERE hotelID=? ORDER BY checkIn DESC LIMIT 1`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


///This is the Function to add dummy Database for reservation////////
const getRateCodeSelection = async (hotelID, ratecode, checkin, checkout, adults, children) => {
  console.log("This is rate code")
  const rateCode = await getFullRateCode(ratecode)
  console.log(ratecode)
  console.log(checkin)
  const date1 = new Date(checkin); // Replace "yyyy-mm-dd" with your first date
  const date2 = new Date(checkout); // Replace "yyyy-mm-dd" with your second date

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Math.abs(date2 - date1);

  // Convert milliseconds to days
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  console.log(diffInDays);

  return new Promise((resolve, reject) => {
    // const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date ,(rateCodeRoomRate.oneAdultPrice) as  baseprice ,  (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + ` as extraadultprice ,    (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + `+ (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + `)  as total , roomInventory.numAvlRooms FROM roomInventory INNER JOIN rateCodeRoomRate ON rateCodeRoomRate.roomTypeID=roomInventory.roomTypeID INNER JOIN rateCode ON rateCodeRoomRate.rateCodeID=rateCode.id  where rateCodeRoomRate.hotelID = ? and rateCodeRoomRate.rateCodeID = ? and date(rateCode.endSellDate) >= date('` + checkout + `')`  + `and (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`

    // rateCode[0]['RoomTypeWiseDetails'] = dataByRoomTypeID
    const sql = `SELECT roomInventory.roomTypeID , roomInventory.inventory_date , (rateCodeRoomRate.oneAdultPrice) as  baseprice , (rateCodeRoomRate.extraAdultPrice) * `
      + (parseInt(adults) - 1) +
      ` as extraadultprice , (rateCodeRoomRate.extraChildPrice) * `
      + (parseInt(children)) +
      ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * `
      + (parseInt(adults) - 1) +
      `+ (rateCodeRoomRate.extraChildPrice) * `
      + (parseInt(children)) + `) as total ,(((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * `
      + (parseInt(adults) - 1) +
      `+ (rateCodeRoomRate.extraChildPrice) * `
      + (parseInt(children)) + `)*` + (parseInt(diffInDays + 1)) + ` )` + ` as fulltotal,  
    roomInventory.numAvlRooms, roomType.roomType, package.packageCode, rateCode.packageID  FROM roomInventory INNER JOIN roomType on roomInventory.roomTypeID = roomType.id INNER JOIN rateCodeRoomRate ON rateCodeRoomRate.roomTypeID=roomInventory.roomTypeID INNER JOIN rateCode ON rateCodeRoomRate.rateCodeID=rateCode.id INNER JOIN package on package.id = rateCode.packageID where rateCodeRoomRate.hotelID = ? and rateCodeRoomRate.rateCodeID = ? and date(rateCode.endSellDate) >= date('`
      + checkout +
      `')`
      +
      `and (roomInventory.inventory_date between '`
      + checkin +
      `' and '`
      + checkout +
      `')`
    console.log(sql)
    const values = [hotelID, ratecode];
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log("In loop")
        console.log(result)
        const dataByRoomTypeID = {};
        total_price = [];
        result.forEach(element => {

          if (!dataByRoomTypeID[element.roomTypeID]) {
            dailyrates = [];
            dailyrates.push(element);
            dataByRoomTypeID[element.roomTypeID] = {
              totalPrice: element.total,
              numAvlRooms: element.numAvlRooms,
              roominfo: dailyrates
            };
          }
          else {
            dataByRoomTypeID[element.roomTypeID].totalPrice = parseInt(dataByRoomTypeID[element.roomTypeID].totalPrice) + parseInt(element.total);
            dataByRoomTypeID[element.roomTypeID].roominfo.push(element);
          }
        });
        console.log("RoomTypeWiseDetails:")
        console.log(dataByRoomTypeID)
        rateCode[0]['RoomTypeWiseDetails'] = dataByRoomTypeID
        console.log(rateCode)
        resolve(rateCode);
      }
    }
    )
  }
  )
};


const getRateCodeSelectionfit = async (ratecode, checkin, checkout, adults, children) => {
  console.log("This is rate code")
  const rateCode = await getFullRateCode(ratecode)
  console.log(ratecode)
  const date1 = new Date(checkin); // Replace "yyyy-mm-dd" with your first date
  const date2 = new Date(checkout); // Replace "yyyy-mm-dd" with your second date

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Math.abs(date2 - date1);

  // Convert milliseconds to days
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  console.log(diffInDays);
  return new Promise((resolve, reject) => {
    const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date , (roomInventory.baseAmount) as baseprice, (roomInventory.extraAdultPrice)* `
      + (parseInt(adults) - 1) + ` as extraadultprice, (roomInventory.extraChildPrice)*` + (parseInt(children)) + ` as childrenprice ,((roomInventory.baseAmount)
            + (roomInventory.extraAdultPrice) * ` + (parseInt(adults) - 1) + `+ (roomInventory.extraChildPrice) * ` + (parseInt(children)) + `) as total , (((roomInventory.baseAmount)  + (roomInventory.extraAdultPrice) * `
      + (parseInt(adults) - 1) +
      `+ (roomInventory.extraChildPrice) * `
      + (parseInt(children)) + `)*` + (parseInt(diffInDays + 1)) + ` )` + ` as fulltotal,
            roomInventory.numAvlRooms,  roomType.roomType, package.packageCode, rateCode.packageID  FROM roomInventory INNER JOIN roomType on roomInventory.roomTypeID = roomType.id INNER JOIN rateCode on rateCode.id = 1 INNER JOIN package on package.id = rateCode.packageID WHERE (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`
    console.log(sql)
    const values = [ratecode];
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log("In loop")
        console.log(result)
        console.log("result")
        const dataByRoomTypeID = {};
        total_price = [];
        result.forEach(element => {

          if (!dataByRoomTypeID[element.roomTypeID]) {
            dailyrates = [];
            dailyrates.push(element);
            dataByRoomTypeID[element.roomTypeID] = {
              totalPrice: element.total,
              numAvlRooms: element.numAvlRooms,
              roominfo: dailyrates
            };
          }
          else {
            dataByRoomTypeID[element.roomTypeID].totalPrice = parseInt(dataByRoomTypeID[element.roomTypeID].totalPrice) + parseInt(element.total);
            dataByRoomTypeID[element.roomTypeID].roominfo.push(element);
          }
        });
        console.log("RoomTypeWiseDetails:")
        console.log(dataByRoomTypeID)
        // const array = []
        // array.push(dataByRoomTypeID)
        rateCode[0]['RoomTypeWiseDetails'] = dataByRoomTypeID
        console.log(rateCode)
        resolve(rateCode);
      }
    }
    )
  }
  )
};



// ///This is the Function to add dummy Database for reservation////////
// const getRateCodeSelectionfit = async ( ratecode, checkin, checkout, adults, children) => {
//   const rateCode = await getFullRateCode(ratecode)
//   return new Promise((resolve, reject) => {
//     // console.log('212');
//     //room_price = 'price_' + adults;
//       // const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date ,(rateCodeRoomRate.oneAdultPrice) as  baseprice ,  (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults) - 1) + ` as extraadultprice ,    (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults) - 1) + `+ (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + `)  as total , roomInventory.numAvlRooms FROM roomInventory INNER JOIN (select * from rateCodeRoomRate where rateCodeRoomRate.rateCodeID = ? )  as rateCodeRoomRate ON rateCodeRoomRate.roomTypeID = roomInventory.roomTypeID `;

//     const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date , (roomInventory.baseAmount) as baseprice, (roomInventory.extraAdultPrice)* `
//       + (parseInt(adults) - 1) + ` as extraadultprice, (roomInventory.extraChildPrice)*` + (parseInt(children)) + ` as childrenprice ,((roomInventory.baseAmount)
//         + (roomInventory.extraAdultPrice) * ` + (parseInt(adults) - 1) + `+ (roomInventory.extraChildPrice) * ` + (parseInt(children)) + `) as total ,
//         roomInventory.numAvlRooms FROM roomInventory WHERE (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`

//     //where rateCodeRoomRate.hotelID = ? and rateCodeRoomRate.rateCodeID = ? and (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`;

//     console.log("This is for FIT")
//     console.log(sql);

//     // `SELECT roomInventory.roomType ,rate.baseAmount, roomInventory.numAvlRooms FROM roomInventory INNER JOIN rate ON rate.roomType=roomInventory.roomType;`;

//     // const values = [hotelID, ratecode];

//     connection.query(sql, (error, result) => {

//       if (error) {
//         console.log(error)
//         reject(error);
//       } else {
//         // console.log("i am here")
//         const dataByRoomTypeID = {};
//         // console.log(dataByRoomTypeID)
//         total_price = [];
//         result.forEach(element => {
//           if (!dataByRoomTypeID[element.roomTypeID]) {
//             //  arr_roomtype.push(element.roomTypeID);
//             dailyrates = [];
//             // arr_roomtype[element.roomTypeID] = {"total":element.total,"roomtypeID":element.roomTypeID,"dailyrates": dailyrates};
//             dailyrates.push(element);
//             // dataByRoomTypeID[element.roomTypeID] = [];
//             dataByRoomTypeID[element.roomTypeID] = {
//               totalPrice: element.total,
//               numAvlRooms: element.numAvlRooms,
//               roominfo: dailyrates
//             };
//           }
//           else {
//             dataByRoomTypeID[element.roomTypeID].totalPrice = parseInt(dataByRoomTypeID[element.roomTypeID].totalPrice) + parseInt(element.total);
//             dataByRoomTypeID[element.roomTypeID].roominfo.push(element);
//           }
//         });
//         console.log(dataByRoomTypeID);
//         rateCode[0]['RoomTypeWiseDetails'] = dataByRoomTypeID
//         resolve(rateCode)
//       }
//     }
//     )
//   }
//   )
// };


///This is the Function to store RateCode Selection to Database for reservation////////
const storerateCodeSelection = async (hotelID, reservationID, ratecode, checkIn, checkOut, adults, children, roomtypeid) => {
  const rateCode = await getFullRateCode(ratecode)
  console.log("ReservationID is:- ")
  console.log(reservationID)
  return new Promise((resolve, reject) => {
    // console.log('212');  
    //room_price = 'price_' + adults;    
    // const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date ,(rateCodeRoomRate.oneAdultPrice) as  baseprice ,  (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + ` as extraadultprice ,    (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + `+ (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) +  `)  as total , roomInventory.numAvlRooms FROM roomInventory INNER JOIN rateCodeRoomRate ON rateCodeRoomRate.roomTypeID=roomInventory.roomTypeID INNER JOIN rateCode ON rateCodeRoomRate.rateCodeID=rateCode.id  where rateCodeRoomRate.hotelID = ? and rateCodeRoomRate.rateCodeID = ? and date(rateCode.endSellDate) >= date('` + checkout + `')`  + `and (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`;

    //working query
    const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date ,(rateCodeRoomRate.oneAdultPrice) as  baseprice , 
         (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults) - 1) + ` as extraadultprice ,    (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children))
      + ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults) - 1) + `+ 
          (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + `)  as total , roomInventory.numAvlRooms FROM roomInventory INNER JOIN 
          (select * from rateCodeRoomRate where rateCodeRoomRate.rateCodeID = ? and rateCodeRoomRate.hotelID = ?)  as rateCodeRoomRate ON 
          rateCodeRoomRate.roomTypeID = roomInventory.roomTypeID where roomInventory.roomTypeID= ?  and (roomInventory.inventory_date between '
          ` + checkIn + `' and '` + checkOut + `')`;

    //  const sql = `SELECT roomInventory.roomTypeID ,roomInventory.inventory_date ,(rateCodeRoomRate.oneAdultPrice) as baseprice ,(rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + ` as extraadultprice ,    (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) + ` as childrenprice , ((rateCodeRoomRate.oneAdultPrice)  + (rateCodeRoomRate.extraAdultPrice) * ` + (parseInt(adults)-1) + `+ (rateCodeRoomRate.extraChildPrice) * ` + (parseInt(children)) +  `)  as total , roomInventory.numAvlRooms FROM roomInventory INNER JOIN (select * from rateCodeRoomRate where rateCodeRoomRate.rateCodeID = ? and rateCodeRoomRate.hotelID = ? )  as rateCodeRoomRate ON rateCodeRoomRate.roomTypeID = roomInventory.roomTypeID where (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `') and roomTypeID=` ;
    //   where rateCodeRoomRate.hotelID = ? and rateCodeRoomRate.rateCodeID = ? and (roomInventory.inventory_date between '` + checkin + `' and '` + checkout + `')`;

    console.log(sql);

    const values = [ratecode, hotelID, parseInt(roomtypeid)];
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        let ids = []
        const dataByRoomTypeID = {};
        total_price = [];
        result.forEach(element => {

          if (!dataByRoomTypeID[element.roomTypeID]) {
            dailyrates = [];
            dailyrates.push(element);
            dataByRoomTypeID[element.roomTypeID] = {
              totalPrice: element.total,
              numAvlRooms: element.numAvlRooms,
              roominfo: dailyrates
            };
          }
          else {
            dataByRoomTypeID[element.roomTypeID].totalPrice = parseInt(dataByRoomTypeID[element.roomTypeID].totalPrice) + parseInt(element.total);
            dataByRoomTypeID[element.roomTypeID].roominfo.push(element);
          }
        });

        console.log("room info error")
        console.log(dataByRoomTypeID)
        for (i = 0; i < 7; i++) {
          if (dataByRoomTypeID[i] !== undefined) {
            console.log(dataByRoomTypeID[i])
            for (j = 0; j < dataByRoomTypeID[i]['roominfo'].length; j++) {
              if (dataByRoomTypeID[i]['roominfo'][j] !== undefined) {
                // console.log(dataByRoomTypeID[i]['roominfo'][j])
                // // for (i = 0; i < dataByRoomTypeID['1']['roominfo'].length; i++) {
                //   // if(dataByRoomTypeID['1']['roominfo'])
                let v1 = rateCode[0]['rateCodeID']
                let v2 = rateCode[0]['rateCode']
                let v3 = rateCode[0]['marketID']
                let v4 = rateCode[0]['sourceID']
                let v5 = rateCode[0]['packageID']
                let v6 = rateCode[0]['packageCode']
                let v7 = rateCode[0]['extras'][0]['extraID']
                let v8 = rateCode[0]['extras'][0]['extraCode']
                let v9 = dataByRoomTypeID[i]['roominfo'][j]['roomTypeID']
                let v10 = dataByRoomTypeID[i]['roominfo'][j]['inventory_date']
                let v11 = dataByRoomTypeID[i]['roominfo'][j]['baseprice']
                let v12 = dataByRoomTypeID[i]['roominfo'][j]['extraadultprice']
                let v13 = dataByRoomTypeID[i]['roominfo'][j]['childrenprice']
                let v14 = dataByRoomTypeID[i]['roominfo'][j]['total']
                let v15 = dataByRoomTypeID[i]['roominfo'][j]['numAvlRooms']

                let sql = `INSERT INTO bookingInformation (hotelID, reservationID, rateCodeID, rateCode, marketID, sourceID, packageID, packageCode, extraID, extraCode, roomTypeID, inventory_date, baseprice, extraadultprice, childrenprice, total, numAvlRooms)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                let values = [1, reservationID, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15]
                connection.query(sql, values, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result)
                  }
                });
              }
            }
          }

        }
      }
    }
    )
  }
  )
};


/// Function to selectTempRateCode Selection
const getTempRateCodeSelection = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tempRateCodeSelection WHERE hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


/// This is the function to get Pickup DetailsFrom Company Details
const getPickupDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pickUpDetails where hotelID=? ORDER BY id DESC LIMIT 1`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      console.log(error)
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(result)
      }
    });
  });
};


/// This is the function to get ReservationID source DetailsFrom Company information
// const getCompanyInfoRes_Source = async (reservationid,source,companyID) => {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT id,source,companyid FROM companyInformation ORDER By id DESC LIMIT 1`;
//     // const values = [hotelID]
//     connection.query(sql, (error, result) => {
//       console.log(error)
//       if (error) {
//         reject(error);
//       } else {
//         const id=result.insertId
//         resolve(id,result);
//         console.log(result)
//         console.log("++")
//                 console.log(result.source)
//       }
//     });
//   });
// };


/// This is the function is to Cancellation from ReservationID
const getPackageDescription = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,description FROM package where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function is to Cancellation from ReservationID
const getExtraDescription = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,description FROM extra where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function to get Companyname From Company Details
const getSourceName = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, sourceCode FROM source where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      console.log(error)
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(result)
      }
    });
  });
};


/// This is the function is to Cancellation from ReservationID
const getPayment = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,paymentTypeCode FROM paymentType where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// This is the function to get Daily Details from the Database
const getDailyDetails = async (hotelID) => {
  return new Promise((resolve, reject) => {

    let query = `SELECT * FROM dailyDetails where hotelID = ?`
    let values = [hotelID]
    if ((hotelID == undefined || hotelID == '')) {
      console.log("ERROR ,Parameters missing")
    }
    else {
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    }
  })
}


/// This is the function to get Confirmedreservation from the  Database. 
const getConfirmedReservation = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT companyInformation.source, companyInformation.companyName, dummyReservation.checkIn, dummyReservation.checkOut , dummyReservation.adults, dummyReservation.children, dummyReservation.quantity, tempRateCodeSelection.roomType, tempRateCodeSelection.baseRate, tempRateCodeSelection.totalRate, tempRateCodeSelection.availability, temppackage.packageName, guestProfiles.id, resPaymentInformation.paymentInformation, resPaymentInformation.cardNumber, resPaymentInformation.cardHolderName, resPaymentInformation.expiryDate ,pickUpDetails.pickUpDetails, pickUpDetails.pickUpTime, pickUpDetails.pickUPLocation ,pickUpDetails.dropDetails,pickUpDetails.dropTime,pickUpDetails.dropLocation FROM dummyReservation INNER JOIN tempRateCodeSelection ON dummyReservation.reservationID=tempRateCodeSelection.reservationID INNER JOIN companyInformation ON companyInformation.id = dummyReservation.reservationID INNER JOIN temppackage ON tempRateCodeSelection.reservationID=temppackage.reservationID INNER JOIN guestProfiles ON guestProfiles.reservationID=temppackage.reservationID INNER JOIN resPaymentInformation ON resPaymentInformation.reservationID=guestProfiles.reservationID INNER JOIN pickUpDetails ON pickUpDetails.reservationID= resPaymentInformation.reservationID ORDER BY companyInformation.id DESC LIMIT 1`;
    const values = [hotelID]
    console.log(values)
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};















//---------------Get APIs--------------------//


// API to to Get Company Name
app.get("/getAccountName", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getAccountName(hotelID);
    for (i = 0; i < result.length; i++) {
      result[i]['value'] = result[i]['companyid'];
      result[i]['label'] = result[i]['accountName']
      delete result[i]['accountName'];
      delete result[i]['companyid'];
    }
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Retrived AccountName name Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get CompanyInformation Data
app.get("/getCompanyInformation", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getCompanyInformation(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'CompanyInformation data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get dummyReservation Data
app.get("/dummyReservation", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getDummyReservation(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'dummyReservation data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Rate Details Data
app.get("/getRateCodeSelection", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getRateCodeSelection(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Rate data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


// API to Get PackageDescription from package
app.get("/getPackageDescription", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getPackageDescription(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['description']
      delete result[i]['description'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Package data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get PackageDescription from package
app.get("/getExtraDescription", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getExtraDescription(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['description']
      delete result[i]['description'];
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Extra data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get PackageDescription from package
app.get("/getPayment", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getPayment(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['paymentTypeCode']
      delete result[i]['paymentTypeCode'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Payment data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get PackageDescription from package
app.get("/getSourceName", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getSourceName(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['sourceCode']
      delete result[i]['sourceCode'];
      delete result[i]['id'];
      // delete result[i]['id'];


    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Payment data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Pickup Details Data
app.get("/getPickupDetails", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getPickupDetails(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get Comfirmed Reservation Data
app.get("/confirmedReservation", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getConfirmedReservation(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'ComfirmedReservation data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});
















//---------------Update Functions--------------------//
/// Update Function to Package Details
const updatetemppackage = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE temppackage SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to GuestProfiles Details
const updateGuestProfiles = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE guestProfiles SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to PickUp Details
const updatemanageProfile = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE manageProfile SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to PickUp Details
const updateresPaymentInformation = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE resPaymentInformation SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};


/// Update Function to Payment Type
const updatePickUpDetails = async (columnsToUpdate, id) => {
  return new Promise((resolve, reject) => {

    let query = 'UPDATE pickUpDetails SET ';
    let values = [];
    for (let column in columnsToUpdate) {
      if (columnsToUpdate.hasOwnProperty(column)) {
        query += `${column} = ?, `;
        values.push(columnsToUpdate[column]);
      }
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${id}`;
    connection.query(query, values, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
        resolve(result);
      }
    })
  })
};



















//---------------Update APIs--------------------//
///API to update Payment Type
app.put('/updatetemppackage', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatetemppackage(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updateGuestProfiles', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateGuestProfiles(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updatemanageProfile', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatemanageProfile(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updateresPaymentInformation', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updateresPaymentInformation(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


//API to update Payment Type
app.put('/updatePickUpDetails', async (req, res) => {
  try {
    const columnsToUpdate = req.body;
    const id = req.query['id'];
    const result = await updatePickUpDetails(columnsToUpdate, id);
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "succesfully updated Payment Type",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});

















//-----------------------Other Functions And APIs---------------//
/// This is the function is to Cancellation from ReservationID
const getGuestProfileLastRoomID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM room where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get ReservationID from room class
app.get("/getGuestProfileLastRoomID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getGuestProfileLastRoomID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['id']
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'RoomID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function is to Cancellation from ReservationID
const getGuestProfileLastRateID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM rateCode where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


app.get("/geAccountbyId", async (req, res) => {
  try {
    let hotelId = req.query['hotelID'];
    let companyId = req.query['companyId'];


    const result = await getAccountbyId(hotelId, companyId);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Accounts data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error);
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


// API to Get ReservationID from room class
app.get("/getGuestProfileLastRateID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']

    const result = await getGuestProfileLastRoomID(hotelID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['id']
      delete result[i]['id'];
    }
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});



/// Function to select Room Number On Floor Id and Room Type ID
const getRoomNumberOnFloor = async (floorID, roomTypeID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, roomNumber FROM room WHERE floorID=? AND roomTypeID=?`;
    const values = [floorID, roomTypeID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
        console.log(result)
      }
    });
  })
};


/// API for Select Room Number On Floor and Room Type ID
app.get('/getRoomNumberOnFloor', async (req, res) => {
  try {
    let floorID = req.query['floorID']
    let roomTypeID = req.query['roomTypeID']
    const result = await getRoomNumberOnFloor(floorID, roomTypeID);
    for (i = 0; i < result.length; i++) {
      console.log(result[i])
      result[i]['value'] = result[i]['id'];
      result[i]['label'] = result[i]['roomNumber']
      delete result[i]['roomNumber'];
      delete result[i]['id'];

    }

    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Number By Floor Details fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


/// TO ADD BULK DATA AT ONCE
const addRoomInventoryTEST = async (numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, Inventory_date, roomTypeID, rateType, baseAmount, surgePrice, extraAdultPrice, extraChildPrice) => {
  return new Promise((resolve, reject) => {
    // const NumDays = 10;



    const startDate = new Date('2023-11-01');
    const endDate = new Date('2024-11-01');

    const timeDiff = endDate.getTime() - startDate.getTime();
    const NumDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(NumDays)
    const values = [];
    for (let i = 0; i <= NumDays; i++) {
      for (let j = 0; j < 7; j++) {
        const inventory_date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const date = inventory_date.toISOString().slice(0, 10)
        roomTypeID = j + 1

        if (roomTypeID === 1) {
          numAvlRooms = 9;
          baseAmount = 5000;
        }
        else if (roomTypeID === 2) {
          numAvlRooms = 9;
          baseAmount = 5000;
        }
        else if (roomTypeID === 3) {
          numAvlRooms = 77;
          baseAmount = 6000;
        }
        else if (roomTypeID === 4) {
          numAvlRooms = 73;
          baseAmount = 6000;
        }
        else if (roomTypeID === 5) {
          numAvlRooms = 57;
          baseAmount = 8500;
        }
        else if (roomTypeID === 6) {
          numAvlRooms = 36;
          baseAmount = 8500;
        }
        else if (roomTypeID === 7) {
          numAvlRooms = 6;
          baseAmount = 15000;
        }
        const [numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, rateType, surgePrice, extraAdultPrice, extraChildPrice] = [0, 0, 0, null, null, 0, 2000, 2000]
        values.push([numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, date, roomTypeID, rateType, baseAmount, surgePrice, extraAdultPrice, extraChildPrice]);
      }



    }


    const sql = 'INSERT INTO roomInventory ( numAvlRooms,numSellCtrlRooms,numOodRooms,numOverbookedRooms,sellLimit,Inventory_date,roomTypeID, rateType, baseAmount, surgePrice,extraAdultPrice,extraChildPrice) VALUES ?';

    connection.query(sql, [values], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log(`Inserted ${result.affectedRows} rows`);
      }
    });
  });
};


app.post('/addroominventoryTEST', async (req, res) => {
  try {
    const { numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, Inventory_date, roomTypeID, rateType, baseAmount, surgePrice, extraAdultPrice, extraChildPrice } = req.body;
    const result = await addRoomInventoryTEST(numAvlRooms, numSellCtrlRooms, numOodRooms, numOverbookedRooms, sellLimit, Inventory_date, roomTypeID, rateType, baseAmount, surgePrice, extraAdultPrice, extraChildPrice);
    console.log('hi')
    console.log(res)
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Added successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
});


/// This is the function to get FullRateCode from the Database
const getFullRateCode = async (ratecode) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT distinct rateCode.id as rateCodeID,rateCode.rateCode,rateCode.marketID,marketCode.marketCode,rateCode.sourceID,source.sourceCode,rateCode.packageID,package.packageCode FROM rateCode INNER JOIN rateCodeExtras on rateCode.id=rateCodeExtras.rateCodeID INNER JOIN marketCode on rateCode.marketID=marketCode.id INNER JOIN source ON source.id=rateCode.sourceID INNER JOIN package ON package.id=rateCode.packageID WHERE rateCodeID= ?`;
    const value = [ratecode]
    connection.query(sql, value, (error, result) => {
      if (error || result.length == 0) {
        reject(error);
      } else {
        const sql2 = `SELECT extraID,extraCode from rateCodeExtras INNER join extra on rateCodeExtras.extraID=extra.id WHERE rateCodeID=?`;
        const values = [ratecode]
        connection.query(sql2, values, (error, data) => {
          if (error) {
            reject(error);
          } else {
            result[0]["extras"] = data
            resolve(result);
          }
        });
      }
    });
  });
};


/// API to Get Data
app.get("/getFullRateCode", async (req, res) => {
  try {
    let ratecode = req.query['rateCodeID']
    const result = await getFullRateCode(ratecode);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Full Rate Code data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


/// API to Get Accounts Data
app.get("/test", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await test(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Accounts By ID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


const getinventorytest = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT numAvlRooms, roomTypeID, inventory_date From roomInventory where hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        console.log(error);
      } else {
        console.log(result);




        // const dataByRoomTypeID = {};

        // total_price =[];
        const dataByRoomTypeID = {};

        result.forEach((element) => {




          const dateObject = new Date(element.inventory_date);
          // console.log(dateObject)
          dateobj = dateObject.getDate() + '-' + (parseInt(dateObject.getMonth()) + 1) + '-' + dateObject.getFullYear();
          console.log(dateobj);


          if (!dataByRoomTypeID[dateobj]) {
            //  arr_roomtype.push(element.roomTypeID);
            //   dailyrates =[];

            // arr_roomtype[element.roomTypeID] = {"total":element.total,"roomtypeID":element.roomTypeID,"dailyrates": dailyrates};
            // dailyrates.push(element);
            roomtype_list = [];
            roomcount_list = [];

            //dataByRoomTypeID[element.roomTypeID] = [];

            dataByRoomTypeID[dateobj] = {
              //roomcount: element.numAvlRooms,
              roomtype: roomtype_list,
              roomcount: roomcount_list
            };

            dataByRoomTypeID[dateobj].roomcount.push(element.numAvlRooms);
            dataByRoomTypeID[dateobj].roomtype.push(element.roomTypeID);
            dataByRoomTypeID[dateobj].date = dateobj;



          }
          else {

            dataByRoomTypeID[dateobj].roomcount.push(element.numAvlRooms);
            dataByRoomTypeID[dateobj].roomtype.push(element.roomTypeID);
            dataByRoomTypeID[dateobj].date = dateobj;



            //dataByRoomTypeID[element.roomTypeID].roominfo.push(element);

          }

        });

        //        console.log(dataByRoomTypeID['17-3-2023']['date']);

        // arr = [];
        // arr.push(dataByRoomTypeID)
        // dataByRoomTypeID.push(arr)
        // arr.push(dataByRoomTypeID)
        resolve(dataByRoomTypeID);


      }
    });
  });
};


app.get("/getinventory", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getinventorytest(hotelID);
    console.log("hi")
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Inventory By date data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});



/// Function to select Inventory By date and room Type (numAvlRooms) and Rates
// const getRoomInventoryRates = async (hotelID) => {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT numAvlRooms,roomType,inventory_date,baseAmount,surgePrice,extraAdultPrice,extraChildPrice FROM roomInventory INNER join roomType ON roomTypeID=roomType.id WHERE roomInventory.hotelID=?`;
//     const values = [hotelID]
//     connection.query(sql, values, (error, result) => {
//       if (error) {
//         reject(error);
//       }
//       else {
//         resolve(result);
//         console.log(result)
//       }
//     });
//   })
// };

const getRoomInventoryRates = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT roomInventory.id,numAvlRooms,roomType,inventory_date,baseAmount,surgePrice,extraAdultPrice,extraChildPrice FROM roomInventory INNER join roomType ON roomTypeID=roomType.id WHERE roomInventory.hotelID=?`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        console.log(error);
      } else {
        // console.log(result);




        // const dataByRoomTypeID = {};

        // total_price =[];
        const dataByRoomTypeID = {};

        result.forEach((element) => {




          const dateObject = new Date(element.inventory_date);
          // console.log(dateObject)
          dateobj = dateObject.getDate() + '-' + (parseInt(dateObject.getMonth()) + 1) + '-' + dateObject.getFullYear();
          // console.log(dateobj);


          if (!dataByRoomTypeID[dateobj]) {
            //  arr_roomtype.push(element.roomTypeID);
            //   dailyrates =[];

            // arr_roomtype[element.roomTypeID] = {"total":element.total,"roomtypeID":element.roomTypeID,"dailyrates": dailyrates};
            // dailyrates.push(element);
            roomtype_list = [];
            roomcount_list = [];
            base_amount = [];
            id = [];

            //dataByRoomTypeID[element.roomTypeID] = [];

            dataByRoomTypeID[dateobj] = {
              //roomcount: element.numAvlRooms,
              roomtype: roomtype_list,
              roomcount: roomcount_list,
              baseAmount: base_amount,
              id: id
            };

            dataByRoomTypeID[dateobj].roomcount.push(element.numAvlRooms);
            dataByRoomTypeID[dateobj].roomtype.push(element.roomType);
            dataByRoomTypeID[dateobj].baseAmount.push(element.baseAmount);

            dataByRoomTypeID[dateobj].date = dateobj;
            dataByRoomTypeID[dateobj].id.push(element.id);




          }
          else {

            dataByRoomTypeID[dateobj].roomcount.push(element.numAvlRooms);
            dataByRoomTypeID[dateobj].roomtype.push(element.roomType);
            dataByRoomTypeID[dateobj].baseAmount.push(element.baseAmount);

            dataByRoomTypeID[dateobj].date = dateobj;
            dataByRoomTypeID[dateobj].id.push(element.id);




            //dataByRoomTypeID[element.roomTypeID].roominfo.push(element);

          }

        });

        //        console.log(dataByRoomTypeID['17-3-2023']['date']);

        // arr = [];
        // arr.push(dataByRoomTypeID)
        // dataByRoomTypeID.push(arr)
        // arr.push(dataByRoomTypeID)
        resolve(dataByRoomTypeID);


      }
    });
  });
};


////// API for Select Room Inventory Rates
app.get('/getRoomInventoryRates', async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    // let roomID = req.query['roomID']
    const result = await getRoomInventoryRates(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: 'Room Inventory Rates fetched successfully',
      data: result
    })

  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: 403,
      message: 'Forbidden'
    })
  }
})


/// This is the function to get GuestProfile from the  Database. 
const getGuestProfileNew = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT guestProfile.id,guestProfile.salutation, guestProfile.name, guestProfile.email,guestProfile.phoneNumber, guestProfile.guestStatus,
        guestProfile.companyID ,guestProfile.addressOne,guestProfile.addressTwo, guestProfile.country,guestProfile.state, guestProfile.city, 
        guestProfile.postalCode,guestProfile.gstID ,guestProfile.anniversary, guestProfile.nationality, guestProfile.dob, guestProfile.guestpreferencenotes,
        guestProfile.email, guestProfile.guestType, guestProfile.isBlackListed,idDetails.IDType,idDetails.firstName, idDetails.idNumber, idDetails.issueDate, idDetails.expiryDate,
        idDetails.issuePlace, idDetails.idFile, membershipDetails.membershipType FROM
         guestProfile LEFT JOIN (SELECT * FROM idDetails) idDetails ON guestProfile.id= idDetails.guestID LEFT JOIN (SELECT * FROM membershipDetails) 
         membershipDetails ON guestProfile.id = membershipDetails.guestID`;
    // ORDER BY id DESC LIMIT 1
    const values = [hotelID]
    // console.log(sql)
    connection.query(sql, values, (error, result) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        // console.log(result)
        for (let i = 0; i < result.length; i++) {

          result[i]['idDetails'] = { 'name': result[i]['name'], "IDType": result[i]['IDType'], "idNumber": result[i]['idNumber'], "issueDate": result[i]['issueDate'], "expiryDate": result[i]['expiryDate'] }
          result[i]['membershipDetails'] = { "membershipType": result[i]['membershipType'], "membershipNo": result[i]['membershipNo'], "membershipSince": result[i]['membershipSince'], "membershipLevel": result[i]['membershipLevel'], "expiryDate": result[i]['expiryDate'] }

          // delete result[i]['name']
          delete result[i]['IDType']
          delete result[i]['idNumber']
          delete result[i]['expiryDate']
          delete result[i]['membershipType']
          delete result[i]['membershipNo']
          delete result[i]['membershipSince']
          delete result[i]['membershipLevel']
          delete result[i]['expiryDate']


        }
        const mainData = {};
        const idDetails = {};
        const data = []
        const membershipDetails = {}
        for (i = 0; i < result.length; i++) {
          Object.keys(result[i]).slice(0, 20).forEach(key => {
            mainData[key] = result[i][key];
          });
          Object.keys(result[i]).slice(21, 24).forEach(key => {
            idDetails[key] = result[i][key];
          });
          Object.keys(result[i]).slice(24, 29).forEach(key => {
            membershipDetails[key] = result[i][key];
          });

          mainData.idDetails = idDetails;
          mainData.membershipDetails = membershipDetails;

          const results = JSON.stringify(mainData);
          data.push(mainData)
        }
        // console.log(data)
        // console.log(result)
        resolve(result)
      }
    });
  });
};


/// API to Get guestProfile Data
app.get("/getGuestProfileNew", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await getGuestProfileNew(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'retrived guestProfile name Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// API TO ADD DummyReservation Details
app.post('/addstorerateCodeSelection', async (req, res) => {
  try {
    const { hotelID, reservationID, ratecode, checkIn, checkOut, adults, children, roomtypeid } = req.body;
    console.log(hotelID, reservationID, ratecode, checkIn, checkOut, adults, children, roomtypeid)
    const result = await storerateCodeSelection(hotelID, reservationID, ratecode, checkIn, checkOut, adults, children, roomtypeid);
    // showdetails(result.insertId)
    res.status(200).send({
      status: 'success',
      statuscode: res.statusCode,
      message: "Succesfully added BookingInformation Details",
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: "Forbidden"
    })
  }
});


const showdetails = async (reservationID) => {
  // let res = showdetails2()
  console.log("In show details function")
  console.log(reservationID)
  return new Promise((resolve, reject) => {
    // const sql = 'SELECT '
    const sql = `SELECT * FROM bookingInformation where reservationID=?`;
    const values = [reservationID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {

        console.log(result)
        resolve(result);
      }
    });
  });
};


// API to Get Block Data
app.get("/showdetails", async (req, res) => {
  try {
    let reservationID = req.query['reservationID']
    const result = await showdetails(reservationID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Block data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


const PackageCode = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT packageCode FROM bookingInformation where hotelID=? ORDER BY id DESC LIMIT 1`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Block Data
app.get("/PackageCode", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await PackageCode(hotelID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'PackageCode data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


const ExtraID = async (hotelID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT extraCode FROM bookingInformation where hotelID=? ORDER BY id DESC LIMIT 1`;
    const values = [hotelID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


// API to Get Block Data
app.get("/ExtraID", async (req, res) => {
  try {
    let hotelID = req.query['hotelID']
    const result = await ExtraID(hotelID);
    // const hotelID=req.query['hotelID']
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'ExtraID data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }

});


/// This is the function to get floor from the Database
const getCompleteReservation = async (reservationID) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT dummyReservation.checkIn, dummyReservation.checkOut, dummyReservation.adults, dummyReservation.children, dummyReservation.quantity, tempExtra.extraDescription, tempExtra.source, tempExtra.agent, tempExtra.origin, tempExtra.market, tempExtra.ETA, tempExtra.ETD, tempExtra.resType, tempExtra.booker, tempExtra.package, tempExtra.features, resPaymentInformation.paymentTypeID, resPaymentInformation.cardNumber, resPaymentInformation.cvv,  resPaymentInformation.cardHolderName, resPaymentInformation.expiryDate, pickUpDetails.pickUpDate, pickUpDetails.pickUpTime, pickUpDetails.pickUpStationCode, pickUpDetails.pickUpCarrierCode, pickUpDetails.pickUpTransportType, pickUpDetails.pickupRemarks, pickUpDetails.dropDate, pickUpDetails.dropTime, pickUpDetails.dropStationCode, pickUpDetails.dropCarrierCode, pickUpDetails.dropTransportType, pickUpDetails.dropRemarks, bookingInformation.packageCode, bookingInformation.rateCode from dummyReservation INNER JOIN tempExtra ON dummyReservation.reservationID = tempExtra.reservationID INNER JOIN resPaymentInformation ON dummyReservation.reservationID = resPaymentInformation.reservationID inner join pickUpDetails on dummyReservation.reservationID = pickUpDetails.reservationID INNER join bookingInformation on dummyReservation.reservationID = bookingInformation.reservationID where dummyReservation.reservationID = ? limit 1`;
    // console.log(sql)
    values = [reservationID]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


/// API to Get Block Data
app.get("/getCompleteReservation", async (req, res) => {
  try {
    let reservationID = req.query['reservationID']
    const result = await getCompleteReservation(reservationID);
    console.log(result)
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Complete Reservation data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


///API to get guest details
app.get("/getAllGuestDetails", async (req, res) => {
  try {
    const result = await getAllGuestDetails()
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'Complete Reservation data Fetched Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden'
    })
  }
});


const getAllGuestDetails = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT guestProfile.*, guestProfile.companyID, accountName FROM guestProfile INNER JOIN accounts ON guestProfile.companyID = accounts.companyid`;
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        // console.log(result)
        resolve(result);
      }
    });
  });
};


// For Adding Out Of Order Or Service
const addOutOfOrderAndService = async (fromDate, startTime, toDate, endTime, status, returnStatus, remarks, reasonID, roomID) => {
  return new Promise((resolve, reject) => {

    const Today = moment(new Date()).format("YYYY-MM-DD");
    let date = new Date(toDate)
    date.setDate(date.getDate() - 1);
    let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")
    // roomID = JSON.parse(roomID)
    // console.log("++++++++++")
    // console.log(roomID)
    // console.log(nayu1[0])
    if (fromDate >= Today) {

      for (let i = 0; i < roomID.length; i++) {
        // nayu.push(roomID[i])

        const query1 = `SELECT distinct roomTypeID FROM room WHERE id in (?)`;
        // console.log(query1)
        connection.query(query1, roomID[i], (error, result) => {
          console.log("===================")
          console.log(result)
          console.log("=====================")
          if (error || result.length == 0) {
            reject(error);
          }

          else {

            const roomTypeID = result[0].roomTypeID;
            // console.log(roomTypeID)
            const query2 = 'SELECT * FROM roomWiseInventory WHERE occupancy_date BETWEEN "' + fromDate + '" AND "' + toDate + '" AND roomID = "' + roomID[i] + '" AND reservationID IS NOT NULL';
            connection.query(query2, (error, result) => {
              if (error) {
                reject(error);
              } else {
                if (result.length) {
                  // console.log(result.length)
                  reject(new Error('Room Already Occupied/Reserved'));
                } else {
                  const query3 = 'SELECT numAvlRooms FROM roomInventory WHERE inventory_date BETWEEN "' + fromDate + '"  AND "' + toDate + '" AND roomTypeID = ' + roomTypeID + ' AND numAvlRooms > 0';
                  connection.query(query3, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      // console.log(result.length)

                      if (!result.length) {
                        reject(new Error('No available rooms for the given dates'));

                      }
                      else {
                        const query4 = 'SELECT * FROM room WHERE roomStatus="' + status + '" AND id="' + roomID[i] + '"';
                        connection.query(query4, (error, result) => {
                          if (error) {
                            reject(error);
                          }
                          else {
                            // console.log(result)
                            // console.log(result.length)
                            if (result.length) {
                              // console.log(result.length)
                              reject(new Error('Room Number is Already ' + status));
                            }
                            else {
                              // for (let i = 0; i < roomID.length; i++){
                              const query4 = 'SELECT * FROM room WHERE frontOfficeStatus="Occupied" AND id="' + roomID[i] + '"';
                              connection.query(query4, (error, result) => {
                                if (error) {
                                  reject(error);
                                }
                                else {
                                  // console.log(result)
                                  // console.log(result.length)
                                  if (result.length) {
                                    console.log(result)
                                    // console.log(result.length)
                                    // for (let j = 0; j < roomID.length; j++){
                                    // console.log(result[i]['roomNumber'])
                                    reject(new Error('Room Number is Already Occupied'));
                                    // }
                                  }

                                  else {

                                    const query4 = 'INSERT INTO outOfOrderAndService (fromDate, startTime, toDate, endTime, status, returnStatus, remarks, reasonID, roomID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                    const values = [fromDate, startTime, toDate, endTime, status, returnStatus, remarks, reasonID, roomID[i]];
                                    connection.query(query4, values, (error, result) => {
                                      console.log("result")
                                      // console.log(result)
                                      if (error) {
                                        reject(error);
                                      }
                                      else {
                                        const query5 = 'UPDATE roomWiseInventory SET status="' + status + '" where roomID="' + roomID[i] + '" and occupancy_date BETWEEN "' + fromDate + '" AND "' + oneLessDate + '"';
                                        connection.query(query5, (error, result) => {
                                          if (error) {
                                            reject(error);
                                          }
                                          else {
                                            const query6 = 'UPDATE room SET roomStatus= "' + status + '" where id="' + roomID[i] + '" AND roomTypeID="' + roomTypeID + '" ';
                                            console.log(query6)
                                            connection.query(query6, (error, result) => {
                                              if (error) {
                                                reject(error);
                                              }
                                              else {
                                                if (status === 'Out Of Order') {
                                                  if(fromDate!=toDate){
                                                    const query7 = 'UPDATE roomInventory SET numAvlRooms=(numAvlRooms-1) ,numOodRooms=(numOodRooms+1) where roomTypeID="' + roomTypeID + '" and inventory_date BETWEEN "' + fromDate + '" AND "' + oneLessDate + '"';
                                                    connection.query(query7, (error, result) => {
                                                      console.log(query7)
                                                      if (error) {
                                                        reject(error);
                                                      }
                                                      else {
                                                        resolve(result);
                                                      }
                                                    });  ////=====
                                                  }
                                                  else{
                                                  const query7 = 'UPDATE roomInventory SET numAvlRooms=(numAvlRooms-1) ,numOodRooms=(numOodRooms+1) where roomTypeID="' + roomTypeID + '" and inventory_date BETWEEN "' + fromDate + '" AND "' + toDate + '"';
                                                  connection.query(query7, (error, result) => {
                                                    console.log(query7)
                                                    if (error) {
                                                      reject(error);
                                                    }
                                                    else {
                                                      resolve(result);
                                                    }
                                                  }); 
                                                } ////=====
                                                }
                                                else {
                                                  resolve(result);
                                                }
                                              }
                                            });
                                          }
                                        });
                                      }

                                    });//----------
                                  }

                                }
                              })

                            }
                          }
                        })
                      }//---------
                    }
                  });
                }
              }
            });

          }
        });
      }

    }  ///hello
    else {
      reject(new Error('From Date Should Be Greater Then Or Equal to Today Date'));

    }

  });
};


/// API for add Room Inventory
app.post('/addOutOfOrderAndService', async (req, res) => {
  console.log("Hello")
  try {

    const { fromDate, startTime, toDate, endTime, status, returnStatus, remarks, reasonID, roomID } = req.body;
    const result = await addOutOfOrderAndService(fromDate, startTime, toDate, endTime, status, returnStatus, remarks, reasonID, roomID);
    res.status(200).send({
      status: 'Success',
      statusCode: res.statusCode,
      message: 'OutOfOrder or Service added Successfully',
      data: result
    })
  }
  catch (error) {
    console.log(error)
    res.status(403).send({
      status: 'Failed',
      statusCode: res.statusCode,
      message: 'Forbidden',
      data: error.message
    })
  }
});



////// Function to select out Of Order / Service
const getOutOfOrderOrServiceDetails = async (roomID, fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * from outOfOrderAndService INNER join room on room.id=outOfOrderAndService.roomID WHERE outOfOrderAndService.roomID=? and fromDate=? and toDate=?  AND outOfOrderAndService.status!='Released'`;
    const values = [roomID, fromDate, toDate]
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        const modifiedResult = result.map((row) => {
          const fromDate = moment(row.fromDate).format('YYYY-MM-DD');
          const toDate = moment(row.toDate).format('YYYY-MM-DD');
          return {
            ...row,
            fromDate,
            toDate,
          };
        }); 
        resolve(modifiedResult)

          }
        });
      })
      
  };


  // const getOutOfOrderandService = async (roomID, fromDate, toDate) => {
  //   return new Promise((resolve, reject) => {
  //     const sql = `SELECT * from outOfOrderAndService INNER join room on room.id=outOfOrderAndService.roomID WHERE outOfOrderAndService.roomID=? and fromDate=? and toDate=?'`;
  //     const values = [roomID, fromDate, toDate]
  //     console.log(values)
  //     connection.query(sql, values, (error, result) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       else {
  //         const modifiedResult = result.map((row) => {
  //           const fromDate = moment(row.fromDate).format('YYYY-MM-DD');
  //           const toDate = moment(row.toDate).format('YYYY-MM-DD');
  //           return {
  //             ...row,
  //             fromDate,
  //             toDate,
  //           };
  //         }); 
  //         resolve(modifiedResult)
  
  //           }
  //         });
  //       })
        
  //   };
  const getOutOfOrderandService = async(roomID,fromDate,toDate) => {
    return new Promise((resolve,reject) => {
      const sql = `SELECT * from outOfOrderAndService INNER join room on room.id=outOfOrderAndService.roomID WHERE outOfOrderAndService.roomID=? and fromDate=? and toDate=?`;
      const values = [roomID, fromDate, toDate]
      connection.query(sql, values, (error, outOfOrderAndService) => {
        if (error) {
          reject(error);
        }
        else  {
          console.log("++++++++____________+++++++++++")
          console.log(outOfOrderAndService)
          console.log("++++++++____________+++++++++++")
          resolve(outOfOrderAndService[0]);
        }
      
      })
    })

  }

  // getOutOfOrderandService(177,'2023-05-24','2023-05-26')

  const outOfOrderAndServiceRelease = async (roomID, fromDate, toDate, roomTypeID, OODSID, status) => {
    // console.log(OODSID)
    const getOODOOS = await getOutOfOrderOrServiceDetails(roomID, fromDate, toDate)
    const getRoomStatus = await getOutOfOrderandService(roomID, fromDate, toDate)
    console.log(getRoomStatus.status)
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      let date = new Date(toDate)
      date.setDate(date.getDate() - 1);
      let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")
      // if (getRoomStatus.status != 'Released') {
        if (getOODOOS.length!=0) {
        const sql = 'UPDATE roomWiseInventory SET status=? where roomID=? and occupancy_date BETWEEN ? AND ?';
        const values = [getRoomStatus.returnStatus, roomID, fromDate, oneLessDate]
        console.log(values)
        connection.query(sql, values, (error, result) => {
          if (error) {
            reject(error);
          } else {
            // console.log(result)
            const query6 = 'UPDATE room SET roomStatus=?,reservationStatus=? where id=? AND roomTypeID=?';
            const values = [getRoomStatus.returnStatus, 'Not Reserved', roomID, roomTypeID]
            connection.query(query6, values, (error, result) => {
              if (error) {
                reject(error);
              }
              else {

                const query6 = 'UPDATE outOfOrderAndService SET status=? where id=?';
                const values = ['Released', OODSID]
                connection.query(query6, values, (error, result) => {
                  if (error) {
                    reject(error);
                  }
                  else {

                    if (getOODOOS[0]['status'] === 'Out Of Order') {
                      if(Today<=toDate){
                        const query7 = 'UPDATE roomInventory SET numAvlRooms=(numAvlRooms+1) ,numOodRooms=(numOodRooms-1) where roomTypeID=? and inventory_date BETWEEN ? AND ?';
                        const values = [roomTypeID, Today, toDate]
                        connection.query(query7, values, (error, result) => {
                          console.log(query7)
                          if (error) {
                            reject(error);
                          }
                          else {
                            resolve(result);
                          }
                        });  ////=====
                      }
                      else{
                        resolve(result)
                      } ////=====
                    }
                    else {
                      resolve(result);
                    }
                  }
                })

              }
            });
          }
        });
      }
      else {
        reject(new Error('Already Released'))
      }
    });
  };



  /// API for Release Out Of Order And Service
  app.put('/outOfOrderAndServiceRelease', async (req, res) => {
    try {

      const { roomID, fromDate, toDate, roomTypeID, OODSID } = req.body;
      const result = await outOfOrderAndServiceRelease(roomID, fromDate, toDate, roomTypeID, OODSID);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'OutOfOrder Release Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden',
        data: error.message
      })
    }
  });




  /// TO ADD BULK DATA AT ONCE
  const addRoomWiseInventoryBulk = async (roomID, reservationID, mainReservationID, occupancy_date, status) => {
    return new Promise((resolve, reject) => {
      // const NumDays = 10;
      const startDate = new Date('2023-04-17');
      const endDate = new Date('2023-07-17');
      const timeDiff = endDate.getTime() - startDate.getTime();
      const NumDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      // console.log(NumDays)
      const values = [];
      for (let i = 0; i <= NumDays; i++) {
        for (let j = 1; j <= 257; j++) {
          const occupancy_date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          const date = occupancy_date.toISOString().slice(0, 10)
          roomID = j
          // reservationID=j

          const [reservationID, mainReservationID, status] = [null, null, 'Vaccant']
          values.push([roomID, reservationID, mainReservationID, date, status]);
        }
      }
      const sql = 'INSERT INTO roomWiseInventory ( roomID, reservationID,mainReservationID,occupancy_date,status) VALUES ?';
      connection.query(sql, [values], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
          // console.log(`Inserted ${result.affectedRows} rows`);
        }
      });
    });
  };


  app.post('/addRoomWiseInventoryBulk', async (req, res) => {
    try {
      const { roomID, reservationID, mainReservationID, occupancy_date, status } = req.body;
      const result = await addRoomWiseInventoryBulk(roomID, reservationID, mainReservationID, occupancy_date, status);
      // console.log('hi')
      // console.log(res)
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: 'Room Wise Inventory Added successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: 403,
        message: 'Forbidden'
      })
    }
  });


  /// This is the function is to Cancellation from ReservationID
  const getAccountUser = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id,FirstName FROM user where hotelID=?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get PackageDescription from package
  app.get("/getAccountUser", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getAccountUser(hotelID);
      for (i = 0; i < result.length; i++) {
        console.log(result[i])
        result[i]['value'] = result[i]['id'];
        result[i]['label'] = result[i]['FirstName']
        delete result[i]['FirstName'];
        delete result[i]['id'];
      }
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Extra data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  });



  ////////////// This is the function to get RateCodeRoomRate from the Database. 
  const getRoomRateonRateCode = async (hotelID, rateCodeID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT roomTypeID, oneAdultPrice, twoAdultPrice,threeAdultPrice,extraAdultPrice,extraChildPrice, roomType.roomType FROM rateCodeRoomRate INNER JOIN roomType ON rateCodeRoomRate.roomTypeID= roomType.id where roomType.hotelID=? && rateCodeID=?  `;
      const values = [hotelID, rateCodeID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get RateCodeRoomRate Data
  app.get("/getRoomRates", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      let rateCodeID = req.query['rateCodeID']
      const result = await getRoomRateonRateCode(hotelID, rateCodeID);
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'RateCodeRoomRate data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  });






  app.put('/updatePackageInfo', async (req, res) => {
    try {
      // const id = req.query['id'];
      const { packageCode, id } = req.body;
      // const packageCode = req.body.packageCode;
      // const { id, packageCode}=req.body
      // const body = req.body
      console.log("-------------------------------------")
      console.log(packageCode, id)
      console.log("-------------------------------------")
      const result = await updatePackageInfo(packageCode, id);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated package details",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });


  const updatePackageInfo = async (packageCode, id) => {
    return new Promise((resolve, reject) => {
      console.log()
      let query = 'UPDATE bookingInformation SET packageCode=? WHERE id = ? ';
      let values = [packageCode, id];
      connection.query(query, values, (err, result) => {
        if (err) {
          console.log(err)
          reject(err);
        }
        else {
          resolve(result);
        }
      })
    })
  };



  /// Function to Upadate Room Inventory base Rate
  const updateRoomInventoryBasePrice = async (baseAmount, id) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE roomInventory SET baseAmount=? WHERE id=?`
      const values = [baseAmount, id];
      // console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };



  //API to update Room Inventory baseAmount
  app.put('/updateRoomInventoryBasePrice', async (req, res) => {
    try {

      const { baseAmount, id } = req.body
    console.log(baseAmount, id )

      const result = await updateRoomInventoryBasePrice(baseAmount, id);
      console.log(result)
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Room Inventory",
        data: result
      })
    }
    catch (error) {
      console.log(error)

      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });




  /// Function to Upadate Room Inventory base Rate by Form
  const updateRoomInventoryByForm = async (baseAmount, roomTypeID, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE dummyRoomInventory SET baseAmount=? Where roomTypeID=? and inventory_date BETWEEN "' + fromDate + '" and "' + toDate + '"'
      const values = [baseAmount, roomTypeID, fromDate, toDate];
      console.log("+++++")
      console.log(sql)
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  //API to update Room Inventory baseAmount by Form
  app.put('/updateRoomInventoryByForm', async (req, res) => {
    try {

      const { baseAmount, roomTypeID, fromDate, toDate } = req.body
      const result = await updateRoomInventoryByForm(baseAmount, roomTypeID, fromDate, toDate);
      // console.log(result)
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Room Inventory Base Price",
        data: result
      })
    }
    catch (error) {
      console.log(error)

      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });









  //Function for Master Reservation
  const createReservation = async (data) => {
    return new Promise((resolve, reject) => {
      //Booking Transaction
      if ((typeof (data.Reservations.Reservation) !== "undefined")) {
        for (let i = 0; i < data.Reservations.Reservation.length; i++) {
          if ((typeof (data.Reservations.Reservation[i].BookingTran) !== "undefined")) {
            for (k = 0; k < data.Reservations.Reservation[i]['BookingTran'].length; k++) {
              let SubBookingId = data.Reservations.Reservation[i]['BookingTran'][k]['SubBookingId']
              let TransactionId = data.Reservations.Reservation[i]['BookingTran'][k]['TransactionId']
              let Createdatetime = data.Reservations.Reservation[i]['BookingTran'][k]['Createdatetime']
              let Modifydatetime = data.Reservations.Reservation[i]['BookingTran'][k]['Modifydatetime']
              let Status = data.Reservations.Reservation[i]['BookingTran'][k]['Status']
              let IsConfirmed = data.Reservations.Reservation[i]['BookingTran'][k]['IsConfirmed']
              let CurrentStatus = data.Reservations.Reservation[i]['BookingTran'][k]['CurrentStatus']
              let VoucherNo = data.Reservations.Reservation[i]['BookingTran'][k]['VoucherNo']
              let PackageCode = data.Reservations.Reservation[i]['BookingTran'][k]['PackageCode']
              let PackageName = data.Reservations.Reservation[i]['BookingTran'][k]['PackageName']
              let RateplanCode = data.Reservations.Reservation[i]['BookingTran'][k]['RateplanCode']
              let RateplanName = data.Reservations.Reservation[i]['BookingTran'][k]['RateplanName']
              let RoomTypeCode = data.Reservations.Reservation[i]['BookingTran'][k]['RoomTypeCode']
              let RoomTypeName = data.Reservations.Reservation[i]['BookingTran'][k]['RoomTypeName']
              let RoomID = data.Reservations.Reservation[i]['BookingTran'][k]['RoomID']
              let RoomName = data.Reservations.Reservation[i]['BookingTran'][k]['RoomName']
              let Start = data.Reservations.Reservation[i]['BookingTran'][k]['Start']
              let End = data.Reservations.Reservation[i]['BookingTran'][k]['End']
              let ArrivalTime = data.Reservations.Reservation[i]['BookingTran'][k]['ArrivalTime']
              let DepartureTime = data.Reservations.Reservation[i]['BookingTran'][k]['DepartureTime']
              let CurrencyCode = data.Reservations.Reservation[i]['BookingTran'][k]['CurrencyCode']
              let TotalAmountAfterTax = data.Reservations.Reservation[i]['BookingTran'][k]['TotalAmountAfterTax']
              let TotalAmountBeforeTax = data.Reservations.Reservation[i]['BookingTran'][k]['TotalAmountBeforeTax']
              let TotalTax = data.Reservations.Reservation[i]['BookingTran'][k]['TotalTax']
              let TotalDiscount = data.Reservations.Reservation[i]['BookingTran'][k]['TotalDiscount']
              let TotalExtraCharge = data.Reservations.Reservation[i]['BookingTran'][k]['TotalExtraCharge']
              let TotalPayment = data.Reservations.Reservation[i]['BookingTran'][k]['TotalPayment']
              let TACommision = data.Reservations.Reservation[i]['BookingTran'][k]['TACommision']
              let Salutation = data.Reservations.Reservation[i]['BookingTran'][k]['Salutation']
              let FirstName = data.Reservations.Reservation[i]['BookingTran'][k]['FirstName']
              let LastName = data.Reservations.Reservation[i]['BookingTran'][k]['LastName']
              let Gender = data.Reservations.Reservation[i]['BookingTran'][k]['Gender']
              let DateOfBirth = data.Reservations.Reservation[i]['BookingTran'][k]['DateOfBirth']
              let SpouseDateOfBirth = data.Reservations.Reservation[i]['BookingTran'][k]['SpouseDateOfBirth']
              let WeddingAnniversary = data.Reservations.Reservation[i]['BookingTran'][k]['WeddingAnniversary']
              let Address = data.Reservations.Reservation[i]['BookingTran'][k]['Address']
              let City = data.Reservations.Reservation[i]['BookingTran'][k]['City']
              let State = data.Reservations.Reservation[i]['BookingTran'][k]['State']
              let Country = data.Reservations.Reservation[i]['BookingTran'][k]['Country']
              let Nationality = data.Reservations.Reservation[i]['BookingTran'][k]['Nationality']
              let Zipcode = data.Reservations.Reservation[i]['BookingTran'][k]['Zipcode']
              let Phone = data.Reservations.Reservation[i]['BookingTran'][k]['Phone']
              let Mobile = data.Reservations.Reservation[i]['BookingTran'][k]['Mobile']
              let Fax = data.Reservations.Reservation[i]['BookingTran'][k]['Fax']
              let Email = data.Reservations.Reservation[i]['BookingTran'][k]['Email']
              let RegistrationNo = data.Reservations.Reservation[i]['BookingTran'][k]['RegistrationNo']
              let IdentiyType = data.Reservations.Reservation[i]['BookingTran'][k]['IdentiyType']
              let IdentityNo = data.Reservations.Reservation[i]['BookingTran'][k]['IdentityNo']
              let ExpiryDate = data.Reservations.Reservation[i]['BookingTran'][k]['ExpiryDate']
              let TransportationMode = data.Reservations.Reservation[i]['BookingTran'][k]['TransportationMode']
              let Vehicle = data.Reservations.Reservation[i]['BookingTran'][k]['Vehicle']
              let PickupDate = data.Reservations.Reservation[i]['BookingTran'][k]['PickupDate']
              let PickupTime = data.Reservations.Reservation[i]['BookingTran'][k]['PickupTime']
              let Source = data.Reservations.Reservation[i]['BookingTran'][k]['Source']
              let Comment = data.Reservations.Reservation[i]['BookingTran'][k]['Comment']
              let AffiliateName = data.Reservations.Reservation[i]['BookingTran'][k]['AffiliateName']
              let AffiliateCode = data.Reservations.Reservation[i]['BookingTran'][k]['AffiliateCode']

              const sql = `INSERT INTO BookingTran (SubBookingId, TransactionId, Createdatetime, Modifydatetime, Status, IsConfirmed, CurrentStatus, VoucherNo, PackageCode, PackageName, RateplanCode, RateplanName, RoomTypeCode, RoomTypeName, RoomID, RoomName, Start, End, ArrivalTime, DepartureTime, CurrencyCode, TotalAmountAfterTax, TotalAmountBeforeTax, TotalTax, TotalDiscount, TotalExtraCharge, TotalPayment, TACommision, Salutation, FirstName, LastName, Gender, DateOfBirth, SpouseDateOfBirth, WeddingAnniversary, Address, City, State, Country, Nationality, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, IdentiyType, IdentityNo, ExpiryDate, TransportationMode, Vehicle, PickupDate, PickupTime, Source, Comment, AffiliateName, AffiliateCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              const values = [SubBookingId, TransactionId, Createdatetime, Modifydatetime, Status, IsConfirmed, CurrentStatus, VoucherNo, PackageCode, PackageName, RateplanCode, RateplanName, RoomTypeCode, RoomTypeName, RoomID, RoomName, Start, End, ArrivalTime, DepartureTime, CurrencyCode, TotalAmountAfterTax, TotalAmountBeforeTax, TotalTax, TotalDiscount, TotalExtraCharge, TotalPayment, TACommision, Salutation, FirstName, LastName, Gender, DateOfBirth, SpouseDateOfBirth, WeddingAnniversary, Address, City, State, Country, Nationality, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, IdentiyType, IdentityNo, ExpiryDate, TransportationMode, Vehicle, PickupDate, PickupTime, Source, Comment, AffiliateName, AffiliateCode]
              connection.query(sql, values, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  console.log("inserted Bookingtran")
                  resolve(result);
                }
              });
            }
          }
        }
      }


      //Tax Details, Sharer, rental info and other informations
      if ((typeof (data.Reservations.Reservation) !== "undefined")) {
        for (let i = 0; i < data.Reservations.Reservation.length; i++) {


          if (typeof (data.Reservations.Reservation[i].BookingTran) !== "undefined") {
            for (let j = 0; j < data.Reservations.Reservation[i].BookingTran.length; j++) {
              const SubBookingId = data.Reservations.Reservation[i]['BookingTran'][j]['SubBookingId']
              if ((typeof (data.Reservations.Reservation[i].BookingTran[j].TaxDeatil)) !== "undefined") {
                for (let k = 0; k < data.Reservations.Reservation[i].BookingTran[j].TaxDeatil.length; k++) {
                  let TaxCode = data.Reservations.Reservation[i]['BookingTran'][j]['TaxDeatil'][k]['TaxCode']
                  let TaxName = data.Reservations.Reservation[i]['BookingTran'][j]['TaxDeatil'][k]['TaxName']
                  let TaxAmount = data.Reservations.Reservation[i]['BookingTran'][j]['TaxDeatil'][k]['TaxAmount']
                  const sql = "INSERT INTO TaxDetails(SubBookingid, TaxCode, TaxName, TaxAmount) VALUES (?, ?, ?, ?)"
                  const values = [SubBookingId, TaxCode, TaxName, TaxAmount]
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      console.log("inserted tax details")
                      resolve(result);
                    }
                  });
                }
              }



              if ((typeof (data.Reservations.Reservation[i].BookingTran[j].RentalInfo)) !== "undefined") {
                for (let k = 0; k < data.Reservations.Reservation[i].BookingTran[j].RentalInfo.length; k++) {
                  // const SubBookingId = data.Reservations.Reservation[i].BookingTran[j]['SubBookingID']
                  let RoomID = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['RoomID']
                  let RoomName = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['RoomName']
                  let EffectiveDate = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['EffectiveDate']
                  let PackageCode = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['PackageCode']
                  let PackageName = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['PackageName']
                  let RoomTypeCode = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['RoomTypeCode']
                  let RoomTypeName = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['RoomTypeName']
                  let Adult = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['Adult']
                  let Child = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['Child']
                  let RentPreTax = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['RentPreTax']
                  let Rent = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['Rent']
                  let Discount = data.Reservations.Reservation[i]['BookingTran'][j]['RentalInfo'][k]['Discount']
                  const sql = "INSERT INTO RentalInfo (SubBookingid, RoomID, RoomName, EffectiveDate, PackageCode, PackageName, RoomTypeCode, RoomTypeName, Adult, Child, RentPreTax, Rent, Discount ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                  const values = [SubBookingId, RoomID, RoomName, EffectiveDate, PackageCode, PackageName, RoomTypeCode, RoomTypeName, Adult, Child, RentPreTax, Rent, Discount]
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      console.log("inserted Rental Info")
                      resolve(result);
                    }
                  });
                }
              }



              if ((typeof (data.Reservations.Reservation[i].BookingTran[j].Sharer)) !== "undefined") {
                for (let k = 0; k < data.Reservations.Reservation[i].BookingTran[j].Sharer.length; k++) {
                  // const SubBookingId = data.Reservations.Reservation[i].BookingTran[j]['SubBookingID']
                  let Salutation = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Salutation']
                  let FirstName = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['FirstName']
                  let LastName = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['LastName']
                  let Gender = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Gender']
                  let DateOfBirth = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['DateOfBirth']
                  let SpouseDateOfBirth = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['SpouseDateOfBirth']
                  let WeddingAnniversary = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['WeddingAnniversary']
                  let Nationality = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Nationality']
                  let Address = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Address']
                  let City = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['City']
                  let State = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['State']
                  let Country = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Country']
                  let Zipcode = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Zipcode']
                  let Phone = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Phone']
                  let Mobile = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Mobile']
                  let Fax = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Fax']
                  let Email = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['Email']
                  let RegistrationNo = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['RegistrationNo']
                  let IdentiyType = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['IdentiyType']
                  let IdentityNo = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['IdentityNo']
                  let ExpiryDate = data.Reservations.Reservation[i]['BookingTran'][j]['Sharer'][k]['ExpiryDate']

                  const sql = "INSERT INTO SharerDetails (SubBookingid, Salutation, FirstName, LastName, Gender, DateOfBirth, SpouseDateOfBirth, WeddingAnniversary, Nationality, Address, City, State, Country, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, IdentiyType, IdentityNo, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                  const values = [SubBookingId, Salutation, FirstName, LastName, Gender, DateOfBirth, SpouseDateOfBirth, WeddingAnniversary, Nationality, Address, City, State, Country, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, IdentiyType, IdentityNo, ExpiryDate]
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      console.log("inserted Sharer  Info")
                      resolve(result);
                    }
                  });
                }
              }
            }
          }


          let LocationId = data.Reservations.Reservation[i]['LocationId']
          let UniqueID = data.Reservations.Reservation[i]['UniqueID']
          let BookedBy = data.Reservations.Reservation[i]['BookedBy']
          let Salutation = data.Reservations.Reservation[i]['Salutation']
          let FirstName = data.Reservations.Reservation[i]['FirstName']
          let LastName = data.Reservations.Reservation[i]['LastName']
          let Gender = data.Reservations.Reservation[i]['Gender']
          let Address = data.Reservations.Reservation[i]['Address']
          let City = data.Reservations.Reservation[i]['City']
          let State = data.Reservations.Reservation[i]['State']
          let Country = data.Reservations.Reservation[i]['Country']
          let Zipcode = data.Reservations.Reservation[i]['Zipcode']
          let Phone = data.Reservations.Reservation[i]['Phone']
          let Mobile = data.Reservations.Reservation[i]['Mobile']
          let Fax = data.Reservations.Reservation[i]['Fax']
          let Email = data.Reservations.Reservation[i]['Email']
          let RegistrationNo = data.Reservations.Reservation[i]['RegistrationNo']
          let Source = data.Reservations.Reservation[i]['Source']
          let IsChannelBooking = data.Reservations.Reservation[i]['IsChannelBooking']

          const sql = "INSERT INTO OtherBasicDetails ( LocationId, UniqueID, BookedBy, Salutation, FirstName, LastName, Gender, Address, City, State, Country, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, Source, IsChannelBooking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          const values = [LocationId, UniqueID, BookedBy, Salutation, FirstName, LastName, Gender, Address, City, State, Country, Zipcode, Phone, Mobile, Fax, Email, RegistrationNo, Source, IsChannelBooking]
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              console.log("inserted other informations")
              resolve(result);
            }
          });
        }
      }


      //cancel reservations
      if ((typeof (data.Reservations.CancelReservation) !== "undefined")) {
        for (let i = 0; i < data.Reservations.CancelReservation.length; i++) {
          let LocationId = data.Reservations.CancelReservation[i]['LocationId']
          let UniqueID = data.Reservations.CancelReservation[i]['UniqueID']
          let Status = data.Reservations.CancelReservation[i]['Status']
          let Canceldatetime = data.Reservations.CancelReservation[i]['Canceldatetime']
          let Remark = data.Reservations.CancelReservation[i]['Remark']
          let VoucherNo = data.Reservations.CancelReservation[i]['VoucherNo']

          let sql = "INSERT INTO cancelReservation(LocationId, UniqueID, Status, Canceldatetime, Remark, VoucherNo) VALUES (?, ?, ?, ?, ?, ?)"
          let values = [LocationId, UniqueID, Status, Canceldatetime, Remark, VoucherNo]

          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              console.log("inserted cancel reservation")
              resolve(result);
            }
          });
        }
      }

    });
  };


  //API to post Master reservation
  app.post('/createMasterReservation', async (req, res) => {
    try {
      console.log(JSON.stringify(req.body, null, 2));
      const result = await createReservation(req.body);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully created master reservation",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });




  /// This is the function to get GuestProfile from the  Database. 
  const getCompleteRateCode = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT rateCode.rateCode,rateCode.description,rateCode.addAccounts,rateCode.roomTypeID,rateCode.beginSellDate, rateCode.endSellDate,rateCode.daysApplicable,rateCode.printRate, rateCode.dayUse,rateCode.discount, rateCode.discountAmount,rateCode.isActive,rateCode.marketID, rateCode.packageID,rateCode.sourceID, accounts.accountName, sourceGroup.sourceGroup, rateCodeRoomRate.rateCodeID, rateCodeRoomRate.roomTypeID, rateCodeRoomRate.oneAdultPrice, rateCodeRoomRate.twoAdultPrice,rateCodeRoomRate.threeAdultPrice FROM rateCode INNER JOIN accounts ON rateCode.addAccounts= accounts.companyid INNER JOIN marketGroup ON rateCode.marketID = marketGroup.id INNER JOIN package ON rateCode.packageID = package.id INNER JOIN sourceGroup ON rateCode.sourceID = sourceGroup.id INNER JOIN (SELECT * FROM rateCodeRoomRate)  rateCodeRoomRate ON rateCodeRoomRate.rateCodeID = rateCode.id`;
      // ORDER BY id DESC LIMIT 1
      const values = [hotelID]
      console.log(sql)
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          console.log(result)
          for (let i = 0; i < result.length; i++) {

            result[i]['rateCodeRoomRate'] = { 'rateCodeID': result[i]['rateCodeID'], "roomTypeID": result[i]['roomTypeID'], "oneAdultPrice": result[i]['oneAdultPrice'], "twoAdultPrice": result[i]['twoAdultPrice'], "threeAdultPrice": result[i]['threeAdultPrice'] }

            //   result[i]['membershipDetails'] = { "membershipType": result[i]['membershipType'], "membershipNo": result[i]['membershipNo'], "membershipSince": result[i]['membershipSince'], "membershipLevel": result[i]['membershipLevel'],"expiryDate": result[i]['expiryDate'] }

            // delete result[i]['name']
            delete result[i]['rateCodeID']
            delete result[i]['roomTypeID']
            delete result[i]['oneAdultPrice']
            delete result[i]['twoAdultPrice']
            delete result[i]['threeAdultPrice']
            //   delete result[i]['membershipSince']
            //   delete result[i]['membershipLevel']
            //   delete result[i]['expiryDate']


          }
          const mainData = {};
          const rateCodeRoomRate = {};
          const data = []
          // const membershipDetails = {}
          for (i = 0; i < result.length; i++) {
            Object.keys(result[i]).slice(0, 17).forEach(key => {
              mainData[key] = result[i][key];
            });
            Object.keys(result[i]).slice(18, 21).forEach(key => {
              rateCodeRoomRate[key] = result[i][key];
            });
            //   Object.keys(result[i]).slice(24, 29).forEach(key => {
            //     membershipDetails[key] = result[i][key];
            //   });

            mainData.rateCodeRoomRate = rateCodeRoomRate;
            //   mainData.membershipDetails = membershipDetails;

            const results = JSON.stringify(mainData);
            data.push(mainData)
          }
          console.log(data)
          resolve(result)
        }
      });
    });
  };


  /// API to Get guestProfile Data
  app.get("/getCompleteRateCode", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getCompleteRateCode(hotelID);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'retrived rateDetails Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });


  ////////////// This is the function to get floor from the Database
  const getBokingTransaction = async () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM BookingTran `;
      const values = []
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get Floor Data
  app.get("/getBokingTransaction", async (req, res) => {
    try {
      const result = await getBokingTransaction();
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'BokingTransaction data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });



  ////////////// This is the function to get floor from the Database
  const getGuestHistoryDetails = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT reservation.bookingID, reservation.arrivalDate, reservation.departureDate, reservation.room,reservation.roomTypeID, reservation.rateCodeID,reservation.sourceID , reservation.agentID,reservation.rate, reservation.packageID, reservation.companyID,package.packageCode, accounts.accountName, roomType.roomType FROM reservation INNER JOIN guestProfile ON reservation.guestID=guestProfile.id INNER JOIN package ON reservation.packageID= package.id INNER JOIN accounts ON reservation.companyID= accounts.companyid INNER JOIN roomType ON reservation.roomTypeID = roomType.id`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get Floor Data
  app.get("/getGuestHistoryDetails", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getGuestHistoryDetails(hotelID);
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Guest History Details Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  });


  // API to Get Agent List
  app.get("/getAgentList", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getAgentList(hotelID);
      for (i = 0; i < result.length; i++) {
        console.log(result[i])
        result[i]['value'] = result[i]['companyid']
        result[i]['label'] = result[i]['accountName']
        delete result[i]['companyid'];
        delete result[i]['accountName'];
      }
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Successfully retrieved Agent List',
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  });


  const getAgentList = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT companyid, accountName FROM accounts where (accountType = 'Agent' OR accountType = 'agent') and hotelID = ?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get Booker List
  app.get("/getBookerList", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getBookerList(hotelID);
      for (i = 0; i < result.length; i++) {
        console.log(result[i])
        result[i]['value'] = result[i]['id']
        result[i]['label'] = result[i]['name']
        delete result[i]['name'];
        delete result[i]['id'];
      }
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Successfully retrieved booker List',
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  });


  const getBookerList = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, name FROM booker where hotelID = ?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };






  ///////////-------------------- eZee integration ----------------------//////////////////////



  /// This is the function is to get Room Which are not in roomWiseInventory
  const getAvailabilityForDates = async (fromDate, toDate, roomTypeID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT numAvlRooms,baseAmount,extraAdultPrice,extraChildPrice FROM roomInventory WHERE inventory_date BETWEEN ? AND ? and roomTypeID=?`;
      const values = [fromDate, toDate, roomTypeID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
  /// This is the function is to get CRS Hotel Mapping
  const getCRSHotelID = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT crsHotelID,authCode FROM CRShotelMapping WHERE hotelID=?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };



  /// This is the function is to get CRS Hotel Mapping
  const getCRSPackageMapping = async (hotelID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT CRSPackageID,packageID,crsExtraPrice FROM CRSPackageMapping WHERE hotelID=?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  /// This is the function is to get Crs Room Type Mapping
  const getCrsRoomTypeMapping = async (hotelID, roomTypeID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT roomTypeID,crsRoomTypeID FROM CRSRoomTypeMapping WHERE hotelID=? and roomTypeID=?`;
      const values = [hotelID, roomTypeID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  /// Function to Upadate Room Inventory of eZee (Integration)
  const updateRoomInventoryEZee = async (hotelID, fromDate, toDate, roomTypeID) => {
    result1 = await getAvailabilityForDates(fromDate, toDate, roomTypeID);
    result2 = await getCRSHotelID(hotelID);
    result3 = await getCrsRoomTypeMapping(hotelID, roomTypeID)
    // console.log(result1,result2,result3)
    return new Promise((resolve, reject) => {

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const NumDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      //     console.log(NumDays)
      // console.log(result2[0])

      const fullJson = {
        "RES_Request": {
          "Request_Type": "UpdateAvailability",
          "Authentication": {
            "HotelCode": result2[0]['crsHotelID'],
            "AuthCode": result2[0]['authCode']
          },
          "RoomType": []
        }
      }

      for (let i = 0; i < NumDays; i++) {
        fullJson.RES_Request.RoomType.push({
          "RoomTypeID": result3[0]['crsRoomTypeID'],
          "FromDate": fromDate,
          "ToDate": fromDate,
          "Availability": result1[i]['numAvlRooms']
        });
        const date = new Date(fromDate);
        date.setDate(date.getDate() + 1);

        fromDate = moment(new Date(date)).format("YYYY-MM-DD")
      }

      // console.log(fullJson['RES_Request']['RoomType'])



      const apiUrl = 'https://live.ipms247.com/pmsinterface/pms_connectivity.php';

      axios.post(apiUrl, fullJson).then(response => {
        console.log(response.data);
        resolve(response.data);
      })
        .catch(error => {
          console.error(error);
          throw error;
        });

    });
  };


  // Ezee Api For Update Invenotory
  app.post('/updateRoomInventoryEZee', async (req, res) => {
    try {
      const { hotelID, fromDate, toDate, roomTypeID } = req.body;
      const result = await updateRoomInventoryEZee(hotelID, fromDate, toDate, roomTypeID);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: 'Room Inventory eZee Added successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: 403,
        message: 'Forbidden'
      })
    }
  });











  /// Function to Upadate Room Rates of eZee
  const updateRoomRatesEZee = async (hotelID, fromDate, toDate, roomTypeID) => {
    result1 = await getAvailabilityForDates(fromDate, toDate, roomTypeID,);
    result2 = await getCRSHotelID(hotelID);
    result3 = await getCrsRoomTypeMapping(hotelID, roomTypeID)
    result4 = await getCRSPackageMapping(hotelID)
    console.log(result1, result2, result3, result4)
    return new Promise((resolve, reject) => {

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const NumDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      console.log(NumDays)
      console.log("=======")
      console.log(result4[0].length)

      const fullJson = {
        "RES_Request": {
          "Request_Type": "UpdateRoomRates",
          "Authentication": {
            "HotelCode": result2[0]['crsHotelID'],
            "AuthCode": result2[0]['authCode']
          },
          "RateType": []
        }
      }

      // console.log(result4)
      // let date = new Date(fromDate)

      // console.log(result1[0]['baseAmount'],result4[0]['crsExtraPrice'])
      // console.log(result1[0]['baseAmount'],result4[j]['crsExtraPrice'])

      const initialFromDate = fromDate;

      for (let j = 0; j < 2; j++) {

        for (let i = 0; i <= NumDays; i++) {
          const baseAmount = result1[0]['baseAmount']
          const extraAmount = result4[j]['crsExtraPrice']

          fullJson.RES_Request.RateType.push({
            "RoomTypeID": result3[0]['crsRoomTypeID'],
            "RateTypeID": result4[j]['CRSPackageID'],
            "FromDate": fromDate,
            "ToDate": fromDate,
            "RoomRate": {
              "Base": baseAmount + extraAmount,
              "ExtraAdult": result1[0]['extraAdultPrice'],
              "ExtraChild": result1[0]['extraChildPrice']
            }
          });

          const date = new Date(fromDate);
          date.setDate(date.getDate() + 1);

          fromDate = moment(new Date(date)).format("YYYY-MM-DD")


        }
        fromDate = initialFromDate;


      }

      // resolve(fullJson)



      const apiUrl = 'https://live.ipms247.com/pmsinterface/pms_connectivity.php';

      axios.post(apiUrl, fullJson).then(response => {
        console.log(response.data);
        resolve(response.data);
      })
        .catch(error => {
          console.error(error);
          throw error;
        });

    });
  };



  // Ezee Api For Update Room Rates
  app.post('/updateRoomRatesEZee', async (req, res) => {
    try {
      const { hotelID, fromDate, toDate, roomTypeID, packageID } = req.body;
      const result = await updateRoomRatesEZee(hotelID, fromDate, toDate, roomTypeID, packageID);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: 'Room Rates eZee Added successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: 403,
        message: 'Forbidden'
      })
    }
  });



  // API for Master Reservation
  app.post('/addMasterReservation', async (req, res) => {
    try {
      const { reservationID } = req.body;
      const result = await getCompleteReservation(reservationID);
      console.log(result)
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Extra added Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  })


  const getRoomtypesRoom = async () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, roomType FROM roomType`;
      // const values = [hotelID]
      connection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get ReservationID from room class
  app.get("/getRoomtypesRoom", async (req, res) => {
    try {
      // let hotelID = req.query['hotelID']

      const result = await getRoomtypesRoom();
      for (i = 0; i < result.length; i++) {
        console.log(result[i])
        result[i]['value'] = result[i]['id'];
        result[i]['label'] = result[i]['roomType']
        delete result[i]['roomType'];
      }
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Room Types data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });

  ///////////// This is the function is to Cancellation from ReservationID
  const getRemainingRoomtype = async (hotelID, rateCodeID) => {
    console.log(hotelID, rateCodeID)
    return new Promise((resolve, reject) => {
      const sql = `SELECT roomType.id, roomType.roomType FROM roomType WHERE roomType.id NOT IN (SELECT roomTypeID FROM rateCodeRoomRate WHERE rateCodeRoomRate.hotelID = ? and rateCodeID = ?)`;
      const values = [hotelID, rateCodeID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get ReservationID from room class
  app.get("/getRemainingRoomtype", async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      let rateCodeID = req.query['rateCodeID']

      const result = await getRemainingRoomtype(hotelID, rateCodeID);
      for (i = 0; i < result.length; i++) {
        console.log(result[i])
        result[i]['value'] = result[i]['id'];
        result[i]['label'] = result[i]['roomType']
        delete result[i]['id'];
        delete result[i]['roomType'];
      }
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Room Types data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });


  const addMasterReservation = async (result) => {
    return new Promise((resolve, reject) => {

      const Arrival = new Date(result[0]['checkIn']);
      const Departure = new Date(result[0]['checkOut']);
      const Nights = (Departure - Arrival) / (1000 * 60 * 60 * 24)
      let cardDetailsID;
      let lastSharingID;
      let cno = 'XXXX XXXX XXXX '
      let cvv = 'XXX'
      for (let i = 12; i < result[0]['cardNumber'].length; i++) {
        cno += result[0]['cardNumber'][i]
      }

      const cardDetails = `INSERT INTO cardDetails(guestProfileID, paymentTypeID, cardNumber, maskedCardNumber, nameOnCard, expiryDate, CVV, maskedCVV) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      const cardValues = [result[0]['guestProfileID'], result[0]['paymentTypeID'], result[0]['cardNumber'], cno, result[0]['cardHolderName'], result[0]['expiryDate'], result[0]['cvv'], cvv]
      connection.query(cardDetails, cardValues, (error, cardDetailsresult) => {
        cardDetailsID = cardDetailsresult.insertId
        if (error) {
          console.log(error)
        }
        else {
          const query = `SELECT id FROM sharingID ORDER BY id DESC LIMIT 1`
          connection.query(query, (error, result1) => {
            let lastID = result1[0]
            if (lastID === undefined) {
              lastID = 1
            }
            else {
              lastID = result1[0]['id'] + 1
            }
            const sql = 'INSERT INTO sharingID(id, sharingID, numberOfReservations, Arrival, Departure, Adults, NumberOfChild, NumberOfRooms, Nights) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const values = [lastID, lastID, 1, result[0]['checkIn'], result[0]['checkOut'], result[0]['adults'], result[0]['children'], result[0]['quantity'], Nights]
            connection.query(sql, values, (error, sharingIDresult) => {
              if (error) {
                reject(error)
              }
              else {
                let reservationStatus;
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`
                if (formattedDate === result[0]['checkIn']) {
                  reservationStatus = "DueIn"
                }
                else {
                  reservationStatus = "Reserved"
                }

                let totalBaseAmount = 0;
                for (j = 0; j < result.length; j++) {
                  totalBaseAmount += result[j]['total']
                }
                let totaltax = 0;
                for (i = 0; i < result.length; i++) {
                  let tax = 0;
                  if (result[i]['total'] < 1000) {
                    tax = 0;
                  }
                  else if (1000 <= result[i]['total'] < 7500) {
                    tax = result[i]['total'] * 0.12
                  }
                  else {
                    tax = result[i]['total'] * 0.18
                  }
                  totaltax = totaltax + tax
                }
                let stayTotal = totalBaseAmount + totaltax;
                let totalCostOfStay = stayTotal * result[0]['quantity']
                console.log(totalBaseAmount)
                console.log(totaltax)
                console.log(stayTotal)
                console.log(totalCostOfStay)

                const reservationQuery = `INSERT INTO (guestID, bookingID, sharingID, arrivalDate, numberOfNights, departureDate, numberOfAdults, numberOfChildren, numberOfRooms, roomTypeID, room, rateCodeID, rate, roomToCharge, packageID, blockCodeID, ETA, ETD, reservationTypeID, marketID, sourceID, origin, paymentTypeID, cardDetailsID, balance, splitBy, companyID, agentID, bookerID, printRate, reservationStatus, commission, totalDiscount, totalBaseAmount, totalExtraCharge, totalTax, totalPayment, stayTotal, travelAgentCommission, totalCostOfStay, pickUpID, dropID, comments, billingInstruction, uniqueID, subBookingID, transactionID, voucherNumber, doNotMove, noPost, isMain) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

                console.log(result[0]['guestProfileID'], lastID, lastID, result[0]['checkIn'], Nights, result[0]['checkOut'], result[0]['adults'], result[0]['children'], result[0]['quantity'], result[0]['roomTypeID'], 0, result[0]['rateCodeID'], result[0]['baseprice'], result[0]['roomTypeID'], result[0]['packageID'], 0, result[0]['ETA'], result[0]['ETD'], result[0]['resType'], result[0]['marketID'], result[0]['sourceID'], result[0]['origin'], result[0]['paymentTypeID'], cardDetailsID, 0, 0, result[0]['companyID'], result[0]['agent'], result[0]['booker'], 1, reservationStatus, 0, 0, totalBaseAmount, 0, totaltax, 0, stayTotal, 0, totalCostOfStay, result[0]['pickUpID'], result[0]['pickUpID'], result[0]['comment'], result[0]['billingInstructions'], 0, 0, 0, 0, 0, 0, 1)


                const reservationValues = [result[0]['guestProfileID'], lastID, lastID, result[0]['checkIn'], Nights, result[0]['checkOut'], result[0]['adults'], result[0]['children'], result[0]['quantity'], result[0]['roomTypeID'], 0, result[0]['rateCodeID'], result[0]['baseprice'], result[0]['roomTypeID'], result[0]['packageID'], 0, result[0]['ETA'], result[0]['ETD'], result[0]['resType'], result[0]['marketID'], result[0]['sourceID'], result[0]['origin'], result[0]['paymentTypeID'], cardDetailsID, 0, 0, result[0]['companyID'], result[0]['agent'], result[0]['booker'], 1, reservationStatus, 0, 0, totalBaseAmount, 0, totaltax, 0, stayTotal, 0, totalCostOfStay, result[0]['pickUpID'], result[0]['pickUpID'], result[0]['comment'], result[0]['billingInstructions'], 0, 0, 0, 0, 0, 0, 1]

                console.log(reservationQuery)
                connection.query(reservationQuery, reservationValues, (error, reservationResult) => {
                  if (error) {
                    console.log(error);
                  }
                  else {
                    console.log(reservationResult)
                  }
                })
              }
            })
          })
        }
      })

    });
  };






  //-------------------------------------------------------===================================----------------------------------------------------------/////
  // ------------------- Check In ----------------------- //


  /// Function to Upadate Room Inventory
  const UpdateRoomInventory = async (fromDate, toDate, roomTypeID, numOfRooms) => {
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      let date = new Date(toDate)
      date.setDate(date.getDate() - 1);
      let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")
      const sql = 'UPDATE roomInventory SET numAvlRooms=(numAvlRooms-?) Where roomTypeID=? and inventory_date BETWEEN ? and ?'
      const values = [numOfRooms, roomTypeID, fromDate, oneLessDate];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  /// Function to Upadate Daily Details
  const updateDailyDetails = async (roomID, reservationID, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE dailyDetails set roomID=? WHERE reservationID=? and date BETWEEN ? AND ?'
      const values = [roomID, reservationID, fromDate, toDate];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };



  /// Function to Upadate Reservation Booking
  const getReservationFromBookingTran = async (guestID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT SubBookingId FROM BookingTran WHERE guestID=?`
      const values = [id];
      // console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  /// Function to Upadate Reservation Booking
  const updateReservationBookingCheckIn = async (PmsStatus, id, guestID, roomID) => {
    // const result1= await getReservationFromBookingTran(guestID)
    return new Promise((resolve, reject) => {
      const sql = `SELECT nationality from guestProfile where id=?`
      const values = [guestID];
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          // console.log(result)
          // console.log(result[0]['nationality'])

          if (result[0]['nationality'] != 'Indian') {
            // For Foreign Guest
            console.log("Foreign Guest")

            const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
            const values = [guestID];
            // console.log(values)
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              }
              else {
                // resolve(result);
                if (result.length == 0) {
                  console.log("Foreign Dont have ID")
                  reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                }
                else {
                  const sql = `UPDATE BookingTran SET PmsStatus=? WHERE id=?`
                  const values = [PmsStatus, id];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      // resolve(result);
                      // const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                      // const values = [roomID];
                      // // console.log(values)
                      //   connection.query(sql, values, (error, result) => {
                      //     if (error) {
                      //       reject(error);
                      //     } else {
                      //       resolve(result);
                      //     }
                      //   });
                    }
                  });
                }
              }
            })
          }
          else {
            console.log("Indian")

            // For Indian Guest
            const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
            const values = [guestID];
            // console.log(values)
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              }
              else {
                if (result.length == 0) {
                  console.log("Indian Dont have ID")

                  reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                }
                else {
                  const sql = `UPDATE BookingTran SET PmsStatus=? WHERE id=?`
                  const values = [PmsStatus, id];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      // resolve(result);
                      // const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                      // const values = [roomID];
                      // // console.log(values)
                      //   connection.query(sql, values, (error, result) => {
                      //     if (error) {
                      //       reject(error);
                      //     } else {
                      //       resolve(result);
                      //     }
                      //   });
                    }
                  });
                }
              }

            })
          }


          // const sql = `UPDATE BookingTran SET PmsStatus=? WHERE id=?`
          // const values = [PmsStatus,id];
          // // console.log(values)
          //   connection.query(sql, values, (error, result) => {
          //     if (error) {
          //       reject(error);
          //     } else {
          //       resolve(result);
          //     }
          //   });
        }
      });
    });
  }


  //API to update Reservation Booking  
  app.put('/updateReservationBookingCheckIn', async (req, res) => {
    try {
      const { PmsStatus, id, guestID } = req.body;
      // const id = req.query['id'];
      const result = await updateReservationBookingCheckIn(PmsStatus, id, guestID);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Checked In Reservation Booking",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error.message
      })
    }
  });


  ////////////// This is the function to get Reservation from the Database.
  const getReservationForFrontDesk = async (hotelID) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid  WHERE reservation.hotelID= ? ORDER BY reservation.id DESC`
      let values = [hotelID]
      if ((hotelID == undefined || hotelID == '')) {
        console.log("ERROR ,Parameters missing")
      }
      else {
        connection.query(query, values, (err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      }
    })
  }





  //API to get Reservation
  app.get('/getReservationForFrontDesk', async (req, res) => {
    try {
      let hotelID = req.query['hotelID']
      const result = await getReservationForFrontDesk(hotelID);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully retrived Reservation",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden",
        data: error
      })
    }
  })



  ////////////// This is the function to get Reservation from the Database.
  const getReservationForFrontDeskToday = async (Start) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid  WHERE reservation.arrivalDate= ?`
      let values = [Start]
      // console.log(values)
      if ((Start == undefined || Start == '')) {
        console.log("ERROR ,Parameters missing")
      }
      else {
        connection.query(query, values, (err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      }
    })
  }





  //API to get Reservation
  app.get('/getReservationForFrontDeskToday', async (req, res) => {
    try {
      let Start = req.query['Start']
      const result = await getReservationForFrontDeskToday(Start);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully retrived Reservation",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden",
        data: error
      })
    }
  })



  ////////////// This is the function to get Reservation from the Database.
  const getReservationForFrontDeskTomarrow = async (Start) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid  WHERE reservation.arrivalDate= ?`
      let values = [Start]
      // console.log(values)
      if ((Start == undefined || Start == '')) {
        console.log("ERROR ,Parameters missing")
      }
      else {
        connection.query(query, values, (err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      }
    })
  }



  //  This function is to get count on table
    const getAvailabilitryCount = async () => {
      return new Promise((resolve, reject) => {
    const Today = moment(new Date()).format("YYYY-MM-DD");

        let query = 'SELECT ( SELECT COUNT(*) FROM reservation WHERE arrivalDate = ?) AS arrivalCount,(SELECT COUNT(*) FROM reservation WHERE departureDate =  ?) AS departureCount,(SELECT SUM(numAvlRooms) FROM roomInventory WHERE inventory_date =  ?) AS numAvlRooms,(SELECT COUNT(*) FROM room WHERE frontOfficeStatus = "Occupied") AS occupiedCount';
        // console.log(values)
      let values = [Today,Today,Today]
          connection.query(query,values, (err, result) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(result)
            }
          })
      })
    }


      //API to get Reservation
  app.get('/getAvailabilitryCount', async (req, res) => {
    try {
      const result = await getAvailabilitryCount();
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully retrived Reservation Availability Count",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden",
        data: error
      })
    }
  })

  //API to get Reservation
  app.get('/getReservationForFrontDeskTomarrow', async (req, res) => {
    try {
      let Start = req.query['Start']
      const result = await getReservationForFrontDeskTomarrow(Start);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully retrived Reservation",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden",
        data: error
      })
    }
  })


  /// This is the function is to get Booking Tran by Departures
  const getReservationForFrontDeskDepartures = async (End) => {
    return new Promise((resolve, reject) => {
      let sql = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid  WHERE reservation.departureDate= ?`
      const values = [End]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  /// API to Get Booking Tran On Basis of Departures
  app.get("/getReservationForFrontDeskDepartures", async (req, res) => {
    try {
      let End = req.query['End']

      const result = await getReservationForFrontDeskDepartures(End);
      // const hotelID=req.query['hotelID']
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Reservation Departures data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });


  /// This is the function is to get In House Guest by in house guest
  const getReservationForFrontDeskInHouseGuest = async (reservationStatus) => {
    return new Promise((resolve, reject) => {
      let sql = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,balance,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid  WHERE reservation.reservationStatus='Checked In' OR reservation.reservationStatus='Due Out'`;
      const values = [reservationStatus]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };



  // API to Get Booking Tran On Basis of In House guest
  app.get("/getReservationForFrontDeskInHouseGuest", async (req, res) => {
    try {
      let reservationStatus = req.query['reservationStatus']
      const result = await getReservationForFrontDeskInHouseGuest(reservationStatus);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Reseervation by InHouseGuest By PmsStatus data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });


  /// This is the function is to get StayOver
  const getReservationForFrontDeskStayOverBWToday = async (Start, End) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT reservation.id,guestID,bookingID,sharingID,arrivalDate,departureDate,reservation.reservationStatus,reservation.room,room.roomNumber,reservation.roomTypeID,roomType.roomType,reservation.agentID,reservation.marketID,marketCode.marketCode,reservation.sourceID,source.sourceCode,paymentTypeID,reservation.companyID,accounts.accountName,guestID,guestProfile.name,rateCodeID,rateCode.rateCode,origin,paymentTypeID,subBookingID FROM reservation inner JOIN roomType on roomType.id=reservation.roomTypeID LEFT JOIN room on room.id=reservation.room INNER JOIN rateCode on rateCode.id=reservation.rateCodeID INNER JOIN source on reservation.sourceID=source.id INNER JOIN guestProfile on guestProfile.id=reservation.guestID INNER JOIN marketCode on reservation.marketID=marketCode.id INNER join accounts on reservation.companyID=accounts.companyid WHERE arrivalDate<? AND departureDate>?`;
      const values = [Start, End]
      // const values = [End]

      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  // API to Get Booking Tran On Basis of StayOver
  app.get("/getReservationForFrontDeskStayOverBWToday", async (req, res) => {
    try {
      let Start = req.query['Start']
      let End = req.query['End']

      const result = await getReservationForFrontDeskStayOverBWToday(Start, End);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Reservation by StayOver By PmsStatus data Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });

  ////////////////////////New FrontDesk


  /// Function to Upadate Room Wise Inventory
  const updateRoomWiseInventoryForAssign = async (reservationID, mainReservationID, status, roomID, fromDate, toDate, frontOfficeStatus) => {
    let result1 = updateDailyDetails(roomID, reservationID, fromDate, toDate);
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      let date = new Date(toDate)
      date.setDate(date.getDate() - 1);
      let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")
      const sql = 'UPDATE roomWiseInventory SET reservationID=?,mainReservationID=?,status=? Where roomID=? and occupancy_date BETWEEN ? and ?'
      const values = [reservationID, mainReservationID, status, roomID, fromDate, oneLessDate];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // resolve(result);
          const sql = 'UPDATE room SET frontOfficeStatus=? Where id=?'
          const values = [frontOfficeStatus, roomID];
          console.log(values)
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  };


  //API to update Room Wise Inventory
  app.put('/updateRoomWiseInventoryForAssign', async (req, res) => {
    try {

      const { reservationID, mainReservationID, status, roomID, fromDate, toDate, frontOfficeStatus } = req.body
      const result = await updateRoomWiseInventoryForAssign(reservationID, mainReservationID, status, roomID, fromDate, toDate, frontOfficeStatus);
      // console.log(result)
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Room Wise Inventory",
        data: result
      })
    }
    catch (error) {
      console.log(error)

      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });

  app.put('/sharerCheckIn', async (req, res) => {
    try {

      const { sharingID, guestID, reservationStatus, roomID } = req.body
      const result = await sharerCheckIn(sharingID, guestID, reservationStatus, roomID);
      // console.log(result)
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated CheckIn for sharer",
        data: result
      })
    }
    catch (error) {
      console.log(error)

      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });
  const sharerCheckIn = async (sharingID, guestID, reservationStatus, roomID) => {

    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");

      const mySql = `SELECT * FROM reservation WHERE sharingID=? and reservationStatus!='Checked In'`
      const value = [sharingID];
      // console.log(values)
      connection.query(mySql, value, (error, result1) => {
        if (error) {
          reject(error);
        } else {
          // console.log(result1[0]['id'])
          // if (result1.length > 1) {
          for (let i = 0; i < result1.length; i++) {
            console.log("+++++")
            console.log(result1[i]['id'])

            const sql = `SELECT nationality from guestProfile where id=?`
            const values = [guestID];

            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              }
              else {
                if (result[0]['nationality'] != 'Indian') {
                  // For Foreign Guest
                  console.log("Foreign Guest")

                  const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
                  const values = [guestID];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    }
                    else {
                      // resolve(result);
                      console.log(result)
                      if (result.length == 0) {
                        console.log("Foreign Dont have ID")
                        reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                      }
                      else {
                        const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`
                        const values = [reservationStatus, result1[i]['id']];
                        // console.log(values)
                        connection.query(sql, values, (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            // resolve(result);
                            const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                            const values = [reservationStatus, 'Occupied', roomID];
                            // console.log(values)
                            connection.query(sql, values, (error, result) => {
                              if (error) {
                                reject(error);
                              } else {
                                resolve(result);
                              }
                            });
                          }
                        });
                      }
                    }
                  })
                }
                else {
                  console.log("Indian")

                  // For Indian Guest
                  const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
                  const values = [guestID];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    }
                    else {
                      if (result.length == 0) {
                        console.log("Indian Dont have ID")

                        reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                      }
                      else {
                        const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`
                        const values = [reservationStatus, result1[i]['id']];
                        // console.log(values)
                        connection.query(sql, values, (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            // resolve(result);
                            const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                            const values = [reservationStatus, 'Occupied', roomID];
                            // console.log(values)
                            connection.query(sql, values, (error, result) => {
                              if (error) {
                                reject(error);
                              } else {
                                // resolve(result);
                              }
                            });
                          }
                        });
                      }
                    }

                  })
                }


              }
              // }
              resolve(result1)
            })
          }
        }
      })
    })
  }








  /// Function to get sharer
  const getSharer = async (sharingID) => {
    return new Promise((resolve, reject) => {
      const mySql = `SELECT * FROM reservation WHERE sharingID=?`
      const value = [sharingID];
      // console.log(values)
      connection.query(mySql, value, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // console.log(result1[0]['arrivalDate'])
          resolve(result)
        }
      })
    });
  };

  /// Function to get sharer
  const getSharerDetails = async (sharingID) => {
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      const mySql = `SELECT * FROM reservation WHERE sharingID=? and isMain=0 and arrivalDate=?`
      const value = [sharingID, Today];
      // console.log(values)
      connection.query(mySql, value, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result)
          console.log(result)
        }
      })
    });
  };


  app.post('/getSharerDetails', async (req, res) => {
    try {
      let { sharingID } = req.body
      const result = await getSharerDetails(sharingID);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "Sharer Details Fetched Success",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error,
        data: error.message
      })
    }
  })


  /// Function to get Reservation By SharingID
  const getSharerCheckInStatus = async (reservationID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM reservation WHERE sharingID = ( SELECT sharingID FROM reservation WHERE id = ? ) AND reservationStatus = 'Checked In'`
      const values = [reservationID];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // console.log(result[0]['sharerCount'])
          resolve(result);
        }
      });
    });
  };







  /// Function to Upadate Reservation Booking
  const updateReservationBookingCheckInNew = async (reservationStatus, id, guestID, roomID, sharingID) => {
    // const result1= await getReservationFromBookingTran(guestID)
    // console.log(reservationStatus, id, guestID, roomID, sharingID)
    let sharer = await getSharer(sharingID)
    let sharerCheckInStatus = await getSharerCheckInStatus(id)
    console.log("+++++++")
    console.log(sharerCheckInStatus.length)
    console.log("+++++++")
    return new Promise((resolve, reject) => {
      // const isSharerRepeated = result.some(item => item['sharerId1'] === sharer || item['sharerId2'] === sharer);

      const Today = moment(new Date()).format("YYYY-MM-DD");
      const sql = `SELECT * FROM reservation where id=?`
      const values = [id];
      console.log(values)
      connection.query(sql, values, (error, reservation) => {
        if (error) {
          reject(error);
        }
        else {
          if(roomID!='undefiend' && roomID!='' && roomID!=null){
          if (reservation[0]['reservationStatus'] != 'Checked In') {
            if (reservation[0]['arrivalDate'] == Today) {
              const sql = `SELECT nationality from guestProfile where id=?`
              const values = [guestID];
              console.log("++++")
              console.log(values)
              connection.query(sql, values, (error, result) => {
                if (error) {
                  reject(error);
                }
                else {
                  // console.log(result)
                  // console.log(result[0]['nationality'])

                  const sql = `SELECT frontOfficeStatus,roomStatus,roomNumber,id FROM room WHERE id=?`
                  const values = [roomID];
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    }
                    else {
                      // console.log(result)
                      // console.log(result[0]['frontOfficeStatus'])
                      // console.log(result[0]['roomStatus'])
                      const isSharerPresent = sharer.length > 1
                      // console.log("+++" + sharer[0]['reservationStatus'] + "++")
                      // if(isSharerPresent){
                      // for (let i = 0; i < sharer.length; i++) {
                      //   Object.entries(sharer[i]).forEach(([key, value]) => {
                      // console.log('-------------------------------------------')
                      // console.log(key)
                      // console.log(sharer[key])
                      // console.log('-------------------------------------------')

                      // if (key == 'id' && sharer[i][key] == id) {
                      //   console.log('Sharer is here +++++++++++++++++++++++')
                      // console.log(sharer[i]['isMain'])
                      // if(sharer[i]['reservationStatus']!='Checked In'){  // -----Extra

                      // if (result[0]['frontOfficeStatus'] === 'Occupied' && isSharerPresent && sharer[i]['isMain'] == 1 && sharerCheckInStatus.length==0) {
                      //   console.log("Condition 1")
                      //   reject(new Error('Room Is Occupied'));

                      // }
                      // }  // -----Extra

                      // else if (result[0]['frontOfficeStatus'] === 'Occupied' && isSharerPresent && sharer[i]['reservationStatus'] != 'Checked In'){
                      //   reject(new Error('Room Is Occupied'));

                      // }

                      //     }

                      //   })
                      // }

                      // }
                      // for(let i=0; i<sharer.length; i++){
                      // if(result[0]['frontOfficeStatus'] === 'Occupied' && isSharerPresent && sharer[i]['isMain']==1){
                      //   console.log("Condition 1")
                      //   reject(new Error('Room Is Occupied'));

                      // }
                      // }
                      // else 
                      if (result[0]['frontOfficeStatus'] === 'Occupied' && isSharerPresent && sharerCheckInStatus.length == 0) {
                        console.log("Condition 2")

                        // console.log("+++")
                        // console.log(result[0]['frontOfficeStatus'])
                        reject(new Error('Room Is Occupied'));
                      }
                      else if (result[0]['frontOfficeStatus'] === 'Occupied' && !isSharerPresent) {
                        console.log("Condition 2")

                        // console.log("+++")
                        // console.log(result[0]['frontOfficeStatus'])
                        reject(new Error('Room Is Occupied'));
                      }
                      // else if(result[0]['frontOfficeStatus'] === 'Occupied' && isSharerPresent && sharer[0]['isMain']==1){
                      //   reject(new Error('Room Is Occupied'));

                      // }
                      // else if(isSharerPresent){
                      // for(let i=0; i<sharer.length; i++){
                      // console.log("Hello")
                      // else if(isSharerPresent && result[0]['frontOfficeStatus'] === 'Occupied' && sharer[i]['reservationStatus']!='checkedIn'){
                      //   reject(new Error('Room Is Occupied'));
                      // }
                      // }
                      // }

                      else if (result[0]['roomStatus'] != 'Inspected' && isSharerPresent && sharerCheckInStatus.length == 0) {
                        // console.log(result[0]['roomStatus'])
                        reject(new Error('Room Is Not Inspected'));

                      }
                      else if (result[0]['roomStatus'] != 'Inspected') {
                        // console.log(result[0]['roomStatus'])
                        reject(new Error('Room Is Not Inspected'));

                      }



                      // if(isSharerPresent){
                      //   for(let i=0; i<sharer.length; i++){
                      //   if (sharer[i]['isMain']==1 && result[0]['frontOfficeStatus'] === 'Occupied') {
                      //     //     // console.log("+++")
                      //     //     // console.log(result[0]['frontOfficeStatus'])
                      //         reject(new Error('Room Is Occupied'));
                      //       }
                      //       else{
                      //         let checkIn=ForCheckin(result,guestID,reservationStatus,id,roomID)
                      //         console.log(checkIn)

                      //       }
                      //     }
                      // }

                      else {

                        if (result[0]['nationality'] != 'Indian') {
                          // For Foreign Guest
                          console.log("Foreign Guest")

                          const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
                          const values = [guestID];
                          // console.log(values)
                          connection.query(sql, values, (error, result) => {
                            if (error) {
                              reject(error);
                            }
                            else {
                              // resolve(result);
                              console.log(result)
                              if (result.length == 0) {
                                console.log("Foreign Dont have ID")
                                reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                              }
                              else {
                                const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`
                                const values = [reservationStatus, id];
                                // console.log(values)
                                connection.query(sql, values, (error, result) => {
                                  if (error) {
                                    reject(error);
                                  } else {
                                    // resolve(result);
                                    const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                                    const values = [reservationStatus, 'Occupied', roomID];
                                    // console.log(values)
                                    connection.query(sql, values, (error, result) => {
                                      if (error) {
                                        reject(error);
                                      } else {
                                        resolve(result);
                                      }
                                    });
                                  }
                                });
                              }
                            }
                          })
                        }
                        else {
                          console.log("Indian")

                          // For Indian Guest
                          const sql = `SELECT IDType from idDetails WHERE guestID=? and IDType is not null` //and IDType='Visa' or IDType='Passport
                          const values = [guestID];
                          // console.log(values)
                          connection.query(sql, values, (error, result) => {
                            if (error) {
                              reject(error);
                            }
                            else {
                              if (result.length == 0) {
                                console.log("Indian Dont have ID")

                                reject(new Error('Guest ID Details are Not Added, Please Add to Continue with CheckIn Process'));
                              }
                              else {
                                const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`
                                const values = [reservationStatus, id];
                                // console.log(values)
                                connection.query(sql, values, (error, result) => {
                                  if (error) {
                                    reject(error);
                                  } else {
                                    // resolve(result);
                                    const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                                    const values = [reservationStatus, 'Occupied', roomID];
                                    // console.log(values)
                                    connection.query(sql, values, (error, result) => {
                                      if (error) {
                                        reject(error);
                                      } else {
                                        // resolve(result);
                                      }
                                    });
                                  }
                                });
                              }
                            }

                          })
                        }
                        if (reservation[0]['isMain'] == 1) {
                          const mySql = `SELECT * FROM reservation WHERE sharingID=? and isMain=0 and arrivalDate=? and reservationStatus!='Checked in'`
                          const value = [sharingID, Today];
                          // console.log(values)
                          connection.query(mySql, value, (error, result1) => {
                            if (error) {
                              reject(error);
                            } else {
                              // console.log(result1[0]['arrivalDate'])
                              if (result1.length >= 1) {
                                console.log("--------------------------------")
                                console.log(result1)
                                for (let i = 0; i < result1.length; i++) {
                                  console.log("+++++")
                                  console.log(result1[i])
                                  if (result1[i]['arrivalDate'] == Today) {
                                    resolve("Do you want to checkIn sharer also?")
                                  }
                                  else {
                                    resolve(result)

                                  }
                                }
                              }
                            }
                          })
                        }

                        else {
                          resolve(result)

                        }




                      }
                    }
                  })
                }
              });

            }
            else {
              reject(new Error('CheckIn date should be equal to ' + Today + ''));

            }
          }
          else {
            reject(new Error('Guest already Checked In'));

          }
        }
        else{
          reject(new Error('Room Not Assigned'));

        }
        }

      })
    });
  }


  // Api to update FrontDesk checkIn
  app.put('/updateReservationBookingCheckInNew', async (req, res) => {
    try {
      let { reservationStatus, id, guestID, roomID, sharingID } = req.body
      const result = await updateReservationBookingCheckInNew(reservationStatus, id, guestID, roomID, sharingID);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully updated Checkin",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error,
        data: error.message
      })
    }
  })



  ///// Update Function to Update Reservation Booking 
  const updateReservationBookingAssignNew = async (columnsToUpdate, id) => {
    return new Promise((resolve, reject) => {

      let query = 'UPDATE reservation SET ';
      let values = [];
      for (let column in columnsToUpdate) {
        if (columnsToUpdate.hasOwnProperty(column)) {
          query += `${column} = ?, `;
          values.push(columnsToUpdate[column]);
        }
      }
      query = query.slice(0, -2);
      query += ` WHERE id = ${id}`;
      connection.query(query, values, (err, result) => {
        if (err) {
          console.log(err)
          reject(err);
        }
        else {
          console.log(`Successfully updated ${Object.keys(columnsToUpdate).length} columns`);
          resolve(result);
        }
      })
    })
  };


  //API to update Reservation Booking  
  app.put('/updateReservationBookingAssignNew', async (req, res) => {
    try {
      const columnsToUpdate = req.body;
      const id = req.query['id'];
      const result = await updateReservationBookingAssignNew(columnsToUpdate, id);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Reservation Booking",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });


  /// This is the function is to get Room Which are not in roomWiseInventory
  const getRoomBasedOnStatusNew = async (fromDate, toDate, floorID, roomType) => {
    return new Promise((resolve, reject) => {
      // const sql = `SELECT DISTINCT roomID,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID  WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service')`;
      const sql = `SELECT DISTINCT roomID,room.id,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service') AND room.frontOfficeStatus NOT IN ('Occupied') AND occupancy_date BETWEEN ? AND ? and roomType.roomType=?`;
      const values = [fromDate, toDate, floorID, fromDate, toDate, roomType]
      // console.log(sql)
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          // console.log(error) 
          reject(error);
        } else {
          // console.log(result) 
          resolve(result);
        }
      });
    });
  };



  /// API to Get Room Count Based on Room Wise Inventory
  app.get("/getRoomBasedOnStatusNew", async (req, res) => {
    try {
      let fromDate = req.query['fromDate']
      let toDate = req.query['toDate']
      let floorID = req.query['floorID']
      let roomType = req.query['roomType']
      const result = await getRoomBasedOnStatusNew(fromDate, toDate, floorID, roomType);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Room Count Based on Room Wise Inventory Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });

  /// This is the function is to get Room Which are not in roomWiseInventory
  const getRoomsForRoomMove = async (fromDate, toDate, floorID, roomType) => {
    return new Promise((resolve, reject) => {
      // const sql = `SELECT DISTINCT roomID,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID  WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service')`;
      const sql = `SELECT DISTINCT roomID,room.id,room.roomNumber,room.frontOfficeStatus,room.roomStatus,roomType.roomType FROM roomWiseInventory INNER JOIN room on room.id=roomWiseInventory.roomID INNER join roomType on roomType.id=room.roomTypeID WHERE roomWiseInventory.roomID NOT IN (SELECT roomID FROM roomWiseInventory WHERE status IN ('Out Of Order', 'Out Of Service') AND occupancy_date BETWEEN ? AND ?) and reservationID is null AND room.floorID=? and room.roomStatus NOT IN ('Out Of Order', 'Out Of Service') AND room.frontOfficeStatus NOT IN ('Occupied') AND  room.roomStatus='Inspected' AND occupancy_date BETWEEN ? AND ? and roomType.roomType=?`;
      const values = [fromDate, toDate, floorID, fromDate, toDate, roomType]
      // console.log(sql)
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          // console.log(error) 
          reject(error);
        } else {
          // console.log(result) 
          resolve(result);
        }
      });
    });
  };





  /// API to Get Room Count Based on Room Wise Inventory
  app.get("/getRoomsForRoomMove", async (req, res) => {
    try {
      let fromDate = req.query['fromDate']
      let toDate = req.query['toDate']
      let floorID = req.query['floorID']
      let roomType = req.query['roomType']
      const result = await getRoomsForRoomMove(fromDate, toDate, floorID, roomType);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Room Count Based for Room Move Fetched Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }

  });

  /// This is the function is to Check Availability
  const CheckAvailability = async (RoomTypeID, fromDate, toDate) => {
    console.log(RoomTypeID, fromDate, toDate)
    return new Promise((resolve, reject) => {
      const sql = `SELECT min(numAvlRooms) AS numAvlRooms FROM roomInventory WHERE roomTypeID=? AND inventory_date BETWEEN ? AND ?`;
      const values = [RoomTypeID, fromDate, toDate]
      console.log("----")
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  /// This is the Function to add Room Move
  const addRoomMove = async (hotelID, reservationID, sharingID, roomTypeID, RoomTypeID, oldRoomID, newRoomID, reasonID, reasonText) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO roomMove(hotelID,reservationID,sharingID,fromRoomTypeID,toRoomTypeID,fromRoomID,toRoomID,reasonID,reasonText) VALUES (?,?,?,?,?,?,?,?,?)`;
      const values = [hotelID, reservationID, sharingID, roomTypeID, RoomTypeID, oldRoomID, newRoomID, reasonID, reasonText]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

    });
  };


  ////// API for add Room Move
  app.post('/addroommove', async (req, res) => {
    try {
      const { hotelID, reservationID, sharingID, roomTypeID, RoomTypeID, oldRoomID, newRoomID, reasonID, reasonText } = req.body;
      const result = await addRoomMove(hotelID, reservationID, sharingID, roomTypeID, RoomTypeID, oldRoomID, newRoomID, reasonID, reasonText);
      res.status(200).send({
        status: 'Success',
        statusCode: res.statusCode,
        message: 'Room Move Details added Successfully',
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: 'Failed',
        statusCode: res.statusCode,
        message: 'Forbidden'
      })
    }
  })



  /// This is the function is to Clear room Wise inventory
  const clearRoomWiseInventory = async (reservationID, mainReservationID, roomID, fromDate, oneLessDate) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE roomWiseInventory SET reservationID=?,mainReservationID=? WHERE roomID=? and occupancy_date BETWEEN ? AND ?`;
      const values = [reservationID, mainReservationID, roomID, fromDate, oneLessDate]
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


  /// Function to Upadate Room Move 

  const updateRoomMoveAssign = async (roomTypeID, RoomTypeID, reservationID, newRoomID, oldRoomID, fromDate, toDate) => {
    // console.log(roomTypeID, RoomTypeID, reservationID, newRoomID, oldRoomID, fromDate, toDate)
    let doNotMove = await getReservationByID(reservationID)
    // console.log("---- "+doNotMove['doNotMove'])
    const result3 = await CheckAvailability(RoomTypeID, fromDate, toDate)
    // const result2=await RoomStatusUpdate('Vacant','Not Reserved',oldRoomID,'Vacant')
    // const result3=await UpdateReservationRoomStatus(reservationID,newRoomID,'Occupied')
    return new Promise((resolve, reject) => {
      // let RoomTypeID=roomTypeID;
      // if(RoomTypeID.length===0)
      // {
      // let RoomTypeID=roomTypeID;
      // }
      console.log(doNotMove[0]['doNotMove'])
      if (doNotMove[0]['doNotMove'] != 1) {
        const Today = moment(new Date()).format("YYYY-MM-DD");
        let date = new Date(toDate)
        date.setDate(date.getDate() - 1);
        let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")
        if (roomTypeID === RoomTypeID) {
          console.log("same room type")
          const sql = `UPDATE reservation SET room=? WHERE id=?`;
          const values = [newRoomID, reservationID]
          // console.log(values)
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              // resolve(result);
              // console.log(result)
              const sql = `UPDATE dailyDetails SET roomID=? WHERE date BETWEEN ? AND ? and reservationID=?`;
              const values = [newRoomID, fromDate, toDate, reservationID]
              // console.log(values)
              connection.query(sql, values, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  // resolve(result);
                  const sql = `UPDATE roomWiseInventory SET roomID=? WHERE occupancy_date BETWEEN ? AND ? AND reservationID=?`;
                  const values = [newRoomID, fromDate, oneLessDate, reservationID]
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      const result1 = RoomStatusUpdate('Vacant', 'Not Reserved', oldRoomID, 'Vacant')


                      const result2 = UpdateReservationRoomStatus(reservationID, newRoomID, 'Occupied')

                      const result3 = clearRoomWiseInventory(null, null, oldRoomID, fromDate, oneLessDate)

                      resolve(result);


                    }
                  });

                }
              });
            }
          });


        }
        else if (roomTypeID != RoomTypeID) {

          console.log("diff room type")
          // console.log(result[0]['numAvlRooms'])
          console.log("++++")
          // console.log(result3)
          console.log("++++")

          console.log(result3['numAvlRooms'])
          console.log("++++")
          if (result3[0]['numAvlRooms'] >= 1) {

            const sql = `UPDATE reservation SET room=?,roomTypeID=? WHERE id=?`;
            const values = [newRoomID, RoomTypeID, reservationID]
            // console.log(values)
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                // resolve(result);
                const sql = `UPDATE dailyDetails SET roomID=?,roomTypeID=? WHERE date BETWEEN ? AND ? and reservationID=?`;
                const values = [newRoomID, RoomTypeID, fromDate, toDate, reservationID]
                // console.log(values)
                connection.query(sql, values, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    // resolve(result);
                    const sql = `UPDATE roomWiseInventory SET roomID=? WHERE occupancy_date BETWEEN ? AND ? AND reservationID=? `;
                    const values = [newRoomID, fromDate, oneLessDate, reservationID]
                    // console.log(values)
                    connection.query(sql, values, (error, result) => {
                      if (error) {
                        reject(error);
                      } else {

                        const result1 = RoomStatusUpdate('Vacant', 'Not Reserved', oldRoomID, 'Vacant')


                        const result2 = UpdateReservationRoomStatus(reservationID, newRoomID, 'Occupied')


                        const result3 = clearRoomWiseInventory(null, null, oldRoomID, fromDate, oneLessDate)


                        const sql = `UPDATE roomInventory set numAvlRooms=(numAvlRooms+1) WHERE roomTypeID=? and inventory_date BETWEEN ? AND ?`;
                        const values = [roomTypeID, fromDate, oneLessDate]
                        // console.log(values)
                        connection.query(sql, values, (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            // resolve(result);
                            // New Room Type
                            const sql = `UPDATE roomInventory set numAvlRooms=(numAvlRooms-1) WHERE roomTypeID=? and inventory_date BETWEEN ? AND ?`;
                            const values = [RoomTypeID, fromDate, oneLessDate]
                            // console.log(values)
                            connection.query(sql, values, (error, result) => {
                              if (error) {
                                reject(error);
                              } else {
                                resolve(result);

                              }
                            });

                          }
                        });
                        //   }
                        // })
                        //   }
                        // });

                      }
                    });

                  }
                });
              }
            });
          }
          else {
            reject(new Error("No Rooms Available For this Room Type"))
          }


        }
      }
      else {
        reject(new Error("You can't move it's DNM"))
      }


    });
  };


  //API to update Reservation Booking Room Move 
  app.put('/updateRoomMoveAssign', async (req, res) => {
    try {
      const { roomTypeID, RoomTypeID, reservationID, newRoomID, oldRoomID, fromDate, toDate } = req.body;
      const result = await updateRoomMoveAssign(roomTypeID, RoomTypeID, reservationID, newRoomID, oldRoomID, fromDate, toDate);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully updated Reservation Booking Room Move",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error.message
      })
    }
  });



  /// This is the function is to Room Status
  const RoomStatusUpdate = async (frontOfficeStatus, reservationStatus, roomID) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
      const values = [frontOfficeStatus, reservationStatus, roomID]
      console.log("++++++++++")
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
  // /// This is the function is to Room Status
  // const RoomStatusFOSandResStatusUpdate = async (frontOfficeStatus,reservationStatus,roomID) => {
  //   return new Promise((resolve, reject) => {
  //     const sql=`UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
  //     const values = [frontOfficeStatus,reservationStatus,roomID]
  //     // console.log(values)
  //     connection.query(sql, values, (error, result) => {
  //       if (error) {
  //         reject(error);
  //       } else { 
  //         resolve(result);
  //       }
  //     });
  //   });
  // };



  /// This is the function is to update Reservation Room Status
  const UpdateReservationRoomStatus = async (reservationID, roomID, frontOfficeStatus) => {
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      console.log(reservationID, roomID, frontOfficeStatus)
      let sql = `SELECT arrivalDate,departureDate from reservation WHERE id=?`;
      const values = [reservationID]
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // resolve(result);
          console.log(result[0]['arrivalDate'])
          console.log(result[0]['departureDate'])
          console.log(Today)

          if (result[0]['arrivalDate'] == Today) {
            console.log('Arrived')
            let sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
            const values = [frontOfficeStatus, 'Arrived', roomID]
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result)
              }
            })
            // const result1=RoomStatusUpdate(frontOfficeStatus,'Arrived',roomID)
          }
          else if (result[0]['arrivalDate'] < Today & Today < result[0]['departureDate']) {
            console.log('Stay Over')

            let sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
            const values = [frontOfficeStatus, 'Stay Over', roomID]
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result)
              }
            })
            // const result2=RoomStatusUpdate(frontOfficeStatus,'Stay Over',roomID)

          }
          else if (result[0]['arrivalDate'] == Today & Today == result[0]['departureDate']) {
            console.log('Day Use')

            let sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
            const values = [frontOfficeStatus, 'Day Use', roomID]
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result)
              }
            })
            // const result3=RoomStatusUpdate(frontOfficeStatus,'Day Use',roomID)

          }
          else if (result[0]['departureDate'] == Today) {
            console.log('Due Out')

            let sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? WHERE id=?`;
            const values = [frontOfficeStatus, 'Due Out', roomID]
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result)
              }
            })
            // const result3=RoomStatusUpdate(frontOfficeStatus,'Due Out',roomID)

          }
          else {
            console.log('Error')
          }


        }

      });
    });
  };


  //API to update Reservation update Reservation Room Status
  app.put('/UpdateReservationRoomStatus', async (req, res) => {
    try {
      const { reservationID, roomID, frontOfficeStatus } = req.body;
      const result = await UpdateReservationRoomStatus(reservationID, roomID, frontOfficeStatus);
      res.status(200).send({
        status: 'success',
        statuscode: res.statusCode,
        message: "succesfully updated Reservation Room Status",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: "Forbidden"
      })
    }
  });


  /// Function to add Cancel CheckIn
  const addCancelCheckIn = async (hotelID, reservationID, sharerID, roomID, reasonID, reasonText) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO cancelCheckIn (hotelID, reservationID, sharerID, roomID, reasonID, reasonText) VALUES (?,?,?,?,?,?)`
      const values = [hotelID, reservationID, sharerID, roomID, reasonID, reasonText];
      connection.query(sql, values, (error, result1) => {
        if (error) {
          reject(error);
        } else {
          resolve(result1);
        }
      });
    });
  };

  /// Function to get Reservation By id
  const getReservationByID = async (reservationID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM reservation WHERE id=?`
      const values = [reservationID];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // console.log(result)
          resolve(result);
        }
      });
    });
  };


    //API to update Reservation update Reservation Room Status
    app.get('/getReservationByID', async (req, res) => {
      try {
        console.log("+++++++++++++++++++")
        const { reservationID} = req.query;
        const result = await getReservationByID(reservationID);
        res.status(200).send({
          status: 'success',
          statuscode: res.statusCode,
          message: "succesfully get Reservation",
          data: result
        })
      }
      catch (error) {
        console.log(error)
        res.status(403).send({
          status: "Failed",
          statusCode: 403,
          message: "Forbidden"
        })
      }
    });

  /// Function to get Reservation By SharingID
  const getSharerForReservation = async (reservationID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as sharerCount FROM reservation WHERE sharingID = ( SELECT sharingID FROM reservation WHERE id = ? ) AND reservationStatus = 'Checked In'`
      const values = [reservationID];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // console.log(result[0]['sharerCount'])
          resolve(result);
        }
      });
    });
  };

  // getSharerForReservation(3)

  /// Function to Cancel CheckIn
  const UpdateCancelCheckIn = async (hotelID, reservationID, sharerID, roomID, reasonID, reasonText) => {
    console.log(hotelID, reservationID, sharerID, roomID, reasonID, reasonText)
    let result1 = await getReservationByID(reservationID)
    // console.log(result1)
    let sharer = await getSharerForReservation(reservationID)
    // console.log("++++______+____+___"+sharer[0])
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      console.log("+++++++++++++++++")
      console.log(sharer.length)
      console.log(sharer[0]['sharerCount'])
      console.log("+++++++++++++++++")
      if(roomID!='undefined' && roomID!=''){
      if (result1[0]['arrivalDate'] == Today) {
        if (result1[0]['reservationStatus'] == 'Checked In') {

          if (result1[0]['balance'] != 0) {
            reject('Balance Not Cleared')
          }
          else {
            const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`
            const values = ['Assigned', reservationID];
            connection.query(sql, values, (error, result) => {
              if (error) {
                reject(error);
              } else {
                if (sharer[0]['sharerCount'] > 1) {
                  console.log("Occupied")
                  const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                  const values = ['Arrivals', 'Occupied', roomID];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      let result2 = addCancelCheckIn(hotelID, reservationID, sharerID, roomID, reasonID, reasonText)
                      resolve(result1)
                    }
                  });
                }
                else {
                  console.log("Arrivals")

                  const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                  const values = ['Arrivals', 'Vacant', roomID];
                  // console.log(values)
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      let result2 = addCancelCheckIn(hotelID, reservationID, sharerID, roomID, reasonID, reasonText)
                      resolve(result1)
                    }
                  });
                }
              }
            })

          }
        }
        else {
          reject("Guest not Checked In")
        }
      }
      else {
        reject("You can't cancel checkin because arrival Date : " + result1[0]['arrivalDate'] + " not equal to Today Date : " + Today)
      }
    }
    else{
      reject("Room Not Assigned, You can't cancel checkin");

    }


    });
  };


  //API to Cancel CheckIn
  app.put('/UpdateCancelCheckIn', async (req, res) => {
    try {
      const { hotelID, reservationID, sharerID, roomID, reasonID, reasonText } = req.body;
      const result = await UpdateCancelCheckIn(hotelID, reservationID, sharerID, roomID, reasonID, reasonText);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully Cancelled CheckIn",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error
      })
    }
  });



  /// Function to UnAssign During CancelCheckin
  const UnAssignforCancelCheckin = async (reservationID, roomID) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE reservation SET room=?,reservationStatus=? where id=?`
      const values = [null, 'Reserved', reservationID];
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // resolve(result);
          const sql = `UPDATE dailyDetails SET roomID=? where reservationID=?`
          const values = [null, reservationID];
          connection.query(sql, values, (error, result) => {
            if (error) {
              reject(error);
            } else {
              // resolve(result);
              const sql = `UPDATE roomWiseInventory SET reservationID=?,mainReservationID=? where reservationID=?`
              const values = [null, null, reservationID];
              connection.query(sql, values, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  // resolve(result);
                  const sql = `UPDATE room SET frontOfficeStatus=?,reservationStatus=? where id=?`
                  const values = ['Vacant', 'Not Reserved', roomID];
                  connection.query(sql, values, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result);
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  };

  //API to UnAssign During CancelCheckin
  app.put('/UnAssignforCancelCheckin', async (req, res) => {
    try {
      const { reservationID, roomID } = req.body;
      const result = await UnAssignforCancelCheckin(reservationID, roomID);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully UnAssign",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error
      })
    }
  });


  /// Function to get Sharere from Reservation
  const getSharerReservation = async (sharingID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM reservation WHERE sharingID=?`
      const values = [sharingID];
      // console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  /// Function to add unAssign Room
  const addRoomUnassign = async (hotelID, reservationID, sharingID, roomID, reasonID, reasonText) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO roomUnassign (hotelID, reservationID, sharerID, roomID, reasonID, reasonText) VALUES (?,?,?,?,?,?)`
      const values = [hotelID, reservationID, sharingID, roomID, reasonID, reasonText];
      console.log(values)
      connection.query(sql, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  /// Function to UnAssign Room Including Sharer
  const UnAssignRoom = async (sharingID, roomID, hotelID, reasonID, reasonText) => {
    console.log(sharingID, roomID, hotelID, reasonID, reasonText)
    console.log(sharingID, roomID)
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      const sql = `SELECT * FROM reservation WHERE sharingID=?`
      const values = [sharingID];
      // console.log(values)
      connection.query(sql, values, (error, result1) => {
        if (error) {
          reject(error);
        } else {
          // let result1=getSharerReservation(sharingID)
          console.log(result1)
          // if (result.length > 1) {
            if(roomID!='undefined' && roomID!=''){
          if (Today <= result1[0]['arrivalDate']) {
            if (result1[0]['reservationStatus'] != 'Checked In') {
              for (let i = 0; i < result1.length; i++) {
                console.log(result1[i]['id'])
                const sql = `UPDATE reservation SET room=?,reservationStatus=? WHERE id=?`
                const values = [null, 'Reserved', result1[i]['id']];
                connection.query(sql, values, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    const sql = `UPDATE dailyDetails SET roomID=? WHERE reservationID=?`
                    const values = [null, result1[i]['id']];
                    connection.query(sql, values, (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        const sql = `UPDATE roomWiseInventory SET reservationID=?,mainReservationID=? WHERE reservationID=?`
                        const values = [null, null, result1[i]['id']];
                        connection.query(sql, values, (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            // resolve(result)
                            const sql = `UPDATE room SET reservationStatus=?,frontOfficeStatus=? WHERE id=?`
                            const values = ['Not Reserved', 'Vacant', roomID];
                            connection.query(sql, values, (error, result) => {
                              if (error) {
                                reject(error);
                              } else {
                                addRoomUnassign(hotelID, result1[i]['id'], result1[i]['id'], roomID, reasonID, reasonText)
                                resolve(result)

                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
            else {
              reject("Guest Already Checked in you can't unassign room")
            }
          }
          else {
            reject(" Today date : " + Today + " should be less then arrival date : " + result1[0]['arrivalDate'] + "")

          }
          }
          else{
            reject('Room Not Assigned');

          }
        }
      });
    });
  };


  //API to UnAssign During
  app.put('/UnAssignRoom', async (req, res) => {
    try {
      const { sharingID, roomID, hotelID, reasonID, reasonText } = req.body;
      const result = await UnAssignRoom(sharingID, roomID, hotelID, reasonID, reasonText);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully UnAssign",
        data: result
      })
    }
    catch (error) {
      console.log(error)
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error
      })
    }
  });



  /// Function to Upadate Assign Room
  const UpdateAssignRoom = async (sharingID, roomID, fromDate, toDate, frontOfficeStatus) => {
    return new Promise((resolve, reject) => {
      const Today = moment(new Date()).format("YYYY-MM-DD");
      let date = new Date(toDate)
      date.setDate(date.getDate() - 1);
      let oneLessDate = moment(new Date(date)).format("YYYY-MM-DD")


      const sql = `SELECT * FROM reservation WHERE sharingID=?`
      const values = [sharingID];
      // console.log(values)
      connection.query(sql, values, (error, result1) => {
        if (error) {
          reject(error);
        } else {
          for (let i = 0; i < result1.length; i++) {
            if (result1[i]['reservationStatus'] != 'Checked In') {
              if (result1[i]['reservationStatus'] != 'Assigned') {

                let updateRates = updateDailyDetails(roomID, result1[i]['id'], fromDate, toDate);

                const sql = 'UPDATE roomWiseInventory SET reservationID=?,mainReservationID=? Where roomID=? and occupancy_date BETWEEN ? and ?'
                const values = [result1[i]['id'], result1[i]['id'], roomID, fromDate, oneLessDate];
                console.log(values)
                connection.query(sql, values, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    // resolve(result);
                    const sql = 'UPDATE room SET frontOfficeStatus=? Where id=?'
                    const values = [frontOfficeStatus, roomID];
                    console.log(values)
                    connection.query(sql, values, (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        // resolve(result);
                        const sql = 'UPDATE reservation SET room=?,reservationStatus=? Where id=?'
                        const values = [roomID, 'Assigned', result1[i]['id']];
                        console.log(values)
                        connection.query(sql, values, (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            resolve(result);
                          }
                        });
                      }
                    });
                  }
                });
              }
              else {
                reject(new Error('Room already assigned for the guest'));

              }
            }
            else {
              reject(new Error('Room already Checked In'));

            }
          }
        }
      })
    });
  };



  /// Function to Upadate Assign Room
  app.put('/UpdateAssignRoom', async (req, res) => {
    try {
      let { sharingID, roomID, fromDate, toDate, frontOfficeStatus } = req.body
      const result = await UpdateAssignRoom(sharingID, roomID, fromDate, toDate, frontOfficeStatus);
      res.status(200).send({
        status: 'success',
        statusCode: res.statusCode,
        message: "succesfully updated Assign Room",
        data: result
      })
    }
    catch (error) {
      res.status(403).send({
        status: "Failed",
        statusCode: 403,
        message: error,
        data: error.message
      })
    }
  })


//  Update Reservation Status for reservation Table
  const ReservationStatus = async (reservationStatus, reservationID) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE reservation SET reservationStatus=? WHERE id=?`;
        const values = [reservationStatus, reservationID]
        connection.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

// Update Reservation Status Automatic
const ReservationStatusAutoMatic = async (hotelID) => {
  return new Promise((resolve, reject) => {
      const sql = `SELECT * from reservation WHERE hotelID=?`;
      const values = [hotelID]
      connection.query(sql, values, (error, result) => {
          if (error) {
              reject(error);
          } else {
              // resolve(result);
              for(let i=0; i<result.length; i++){
                let changeStatus = ChangeReservationStatus(result[i]['id'])
              resolve(changeStatus)

              }
          }
      });
  });
};



// Update Reservation Status Automatic
const ChangeReservationStatus = async (reservationID) => {
    let reservation = await getReservationByID(reservationID)
    const Today = moment(new Date()).format("YYYY-MM-DD");
    return new Promise((resolve, reject) => {

        if (reservation[0]['arrivalDate'] < Today && reservation[0]['reservationStatus']!= 'Checked In') {
            let result1 = ReservationStatus('No Show', reservationID)
            resolve(result1)
        }
        else if (reservation[0]['arrivalDate'] == Today) {
            let result1 = ReservationStatus('Due In', reservationID)
            resolve(result1)
        }
        else if (reservation[0]['departureDate'] == Today) {
            let result1 = ReservationStatus('Due Out', reservationID)
            resolve(result1)
        }

    });

};

// Update Reservation Status Automatic

app.put('/ReservationStatusAutoMatic', async (req, res) => {
  try {
    let { hotelID } = req.body
    const result = await ReservationStatusAutoMatic(hotelID);
    res.status(200).send({
      status: 'success',
      statusCode: res.statusCode,
      message: "succesfully updated Assign Room",
      data: result
    })
  }
  catch (error) {
    res.status(403).send({
      status: "Failed",
      statusCode: 403,
      message: error,
      data: error.message
    })
  }
})











////////////////    Reservation Modification    ///////////////

/// Update Function to Update stay information
const updateStayInformation = async (columnsToUpdate, id) => {
  let dates = await getStayInformation(id)
  let roomTypeID = await getRoomTypeOfReservation(id)
  let currentArrival = dates[0]['checkIn']
  let currentDeparture = dates[0]['checkOut']
  let newArrival = columnsToUpdate['checkIn']
  let newDeparture = columnsToUpdate['checkOut']
  console.log(roomTypeID)



  // //Case1:- When arrival date is same but departure date varies
  if (currentArrival === newArrival) {

      // Sub case1:- When new departure date is within current departure date
      // No need to check for availabilities, just update the reservation details and after final submit increase the inventory
      if (newDeparture < currentDeparture) {
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ? WHERE reservationID = ?';
              let values = [columnsToUpdate['checkOut'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }

      
      // Sub case2:- When new departure date is after current departure date
      // Check availability for new departure dates.
      else {
          currentArrival = currentDeparture;
          currentDeparture = newDeparture;
          console.log(roomTypeID, currentArrival, currentDeparture)
          let result = await CheckAvailability(roomTypeID, currentArrival, currentDeparture)
          if(result[0]['numAvlRooms'] > 0){
              return new Promise((resolve, reject) => {
                  let query = 'UPDATE dummyReservation SET checkOut = ? WHERE reservationID = ?';
                  let values = [columnsToUpdate['checkOut'], id];
                  connection.query(query, values, (err, result) => {
                      if (err) {
                          console.log(err)
                          reject(err);
                      }
                      else {
                          UpdateRoomInventory(currentArrival, currentDeparture, roomTypeID, dates[0]['quantity'])
                          console.log(`Successfully updated stay information`);
                          resolve(result);
                      }
                  })
              })
          }
          else{
              return new Promise((resolve, reject) => {
                  resolve("Cannot Modify Departure Date")
              })
          }
      }
  }


  //Case2:- When Departure date is same but Arrival date varies
  else if (currentDeparture === newDeparture) {
      // Sub case1:- When new Arrival date is after current Arrival date
      // Check availability for new Arrival dates.
      if (newArrival < currentArrival) {
          currentArrival = newArrival;
          currentDeparture = currentArrival;
          let result = await CheckAvailability(roomTypeID, currentArrival, currentDeparture)
          if(result[0]['numAvlRooms'] > 0){
              return new Promise((resolve, reject) => {
                  let query = 'UPDATE dummyReservation SET checkIn = ?  WHERE reservationID = ?';
                  let values = [columnsToUpdate['checkIn'], id];
                  connection.query(query, values, (err, result) => {
                      if (err) {
                          console.log(err)
                          reject(err);
                      }
                      else {
                          console.log(`Successfully updated stay information`);
                          resolve(result);
                      }
                  })
              })
          }
      }


      // Sub case2:- When new Arrival date is before current Arrival date
      // No need to check for availabilities, just update the reservation details and after final submit increase the inventory
      else {
        console.log("NA>CA")
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ? WHERE reservationID = ?';
              let values = [columnsToUpdate['checkIn'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }
  }


  //Case3:- When new departure date and new arrival date both are different than current dates
  //SubCase 1:- New arrival date is earlier than current arrival date and new departure date is earlier than current dates
  else if((newArrival < currentArrival) && (newDeparture < currentDeparture)){
      currentArrival = newArrival;
      currentDeparture = currentArrival;
      let result = await CheckAvailability(roomTypeID, currentArrival, currentDeparture)
      if(result[0]['numAvlRooms'] > 0){
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ?, checkOut = ?  WHERE reservationID = ?';
              let values = [columnsToUpdate['checkIn'], columnsToUpdate['checkOut'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }
  }


  //SubCase 2:-New arrival date is after current arrival date and new departure date is after current dates
  else if((newArrival > currentArrival) && (newDeparture > currentDeparture)){
      currentArrival = currentDeparture;
      currentDeparture = newDeparture;
      let result = await CheckAvailability(roomTypeID, currentArrival, currentDeparture)
      if(result[0]['numAvlRooms'] > 0){
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ?, checkOut = ?  WHERE reservationID = ?';
              let values = [columnsToUpdate['checkIn'], columnsToUpdate['checkOut'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }
  }


  //SubCase 3:- When new arrival date is after current arrival date and new departure date is within current departure
  else if((newArrival > currentArrival) && (newDeparture < currentDeparture)){
      return new Promise((resolve, reject) => {
          let query = 'UPDATE dummyReservation SET checkIn = ? WHERE reservationID = ?';
          let values = [columnsToUpdate['checkIn'], id];
          connection.query(query, values, (err, result) => {
              if (err) {
                  console.log(err)
                  reject(err);
              }
              else {
                  console.log(`Successfully updated stay information`);
                  resolve(result);
              }
          })
      })
  }

  //SubCase 4:- When new arrival date is earlier than current arrival date and new departure date is after current departure
  else if((newArrival < currentArrival) && (newDeparture > currentDeparture)){
      let check1 = await CheckAvailability(roomTypeID, newArrival, currentArrival)
      let check2 = await CheckAvailability(roomTypeID, currentDeparture, newDeparture)
      if((check1[0]['numAvlRooms'] > 0) && (check2[0]['numAvlRooms'] > 0)) {
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ?, checkOut = ?  WHERE reservationID = ?';
              let values = [columnsToUpdate['checkIn'], columnsToUpdate['checkOut'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }
  }


  //Case4:- When new arrival date and new departure both are different than current arrival and current departure and will fall out of them. 
  else if((newArrival > currentDeparture) || (newDeparture < currentArrival)){
      let check = await CheckAvailability(roomTypeID, newArrival, newDeparture)
      console.log("ownc owknc")
      if(check[0]['numAvlRooms'] > 0) {
          return new Promise((resolve, reject) => {
              let query = 'UPDATE dummyReservation SET checkIn = ?, checkOut = ?  WHERE reservationID = ?';
              let values = [columnsToUpdate['checkIn'], columnsToUpdate['checkOut'], id];
              connection.query(query, values, (err, result) => {
                  if (err) {
                      console.log(err)
                      reject(err);
                  }
                  else {
                      console.log(`Successfully updated stay information`);
                      resolve(result);
                  }
              })
          })
      }
  }

};


//API to update guest complaint
app.put('/updateStayInformation', async (req, res) => {
  try {
      const columnsToUpdate = req.body
      const id = req.query['reservationID'];
      const result = await updateStayInformation(columnsToUpdate, id);
      res.status(200).send({
          status: 'success',
          statuscode: res.statusCode,
          message: "succesfully updated guest complaint",
          data: result
      })
  }
  catch (error) {
      console.log(error)
      res.status(403).send({
          status: "Failed",
          statusCode: 403,
          message: "Forbidden"
      })
  }
});


//Function to get previouse stay dates for perticular reservation
const getStayInformation = async (reservationID) => {
  return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM dummyReservation WHERE reservationID = ?`
      let values = [reservationID]
      connection.query(sql, values, (err, result) => {
          if (err) {
              reject(err)
          }
          else {
              resolve(result)
          }
      })
  })
}


//Function to get previouse stay dates for perticular reservation
const getRoomTypeOfReservation = async (reservationID) => {
  return new Promise((resolve, reject) => {
      let sql = `SELECT roomTypeID FROM bookingInformation WHERE reservationID = ?`
      let values = [reservationID]
      connection.query(sql, values, (err, result) => {
          if (err) {
              reject(err)
          }
          else {
            console.log(result[0])
              resolve(result[0]['roomTypeID'])
          }
      })
  })
}


// console.log(getRoomTypeOfReservation(1))