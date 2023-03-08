const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const RankList = require("../models/RankList");
var sortJsonArray = require("sort-json-array");

const createDb = async (req, res) => {
  // req.body.createdBy = req.user.userId;
  // const job = await Job.create(req.body);
  const obj = require("/Users/Gaurang/Desktop/Data/iit_nit_all_final_new_1.json");
  const newObj = obj.map(async (item) => {
    // console.log(item);
    if (item.Gender == "") {
      item.Gender = "NA";
    }
    if (item.Quota == "") {
      item.Quota = "NA";
    }
    const listItem = await RankList.create(item);
    // console.log(listItem);
  });
  // const len = Object.keys()

  res.status(StatusCodes.CREATED).json({ newObj });
};

const getInstitutes = async (req, res) => {
  const {
    Institute_Name,
    Branch_Name,
    Quota,
    Seat_Type,
    Gender,
    Rank,
    Delta,
    year,
    Institute_Type,
    page,
    itemsPerPage,
    filter,
    sortType,
  } = req.body;
  // console.log(req.body);
  req.search = {};
  if (Institute_Name !== "" && Institute_Name !== "All") {
    req.search.Institute_Name = Institute_Name;
  }

  if (Branch_Name != "" && Branch_Name != "All") {
    req.search.Branch_Name = Branch_Name;
  }
  if (Quota != "" && Quota != "Both") {
    req.search.Quota = Quota;
  }
  if (Seat_Type != "" && Seat_Type != "All") {
    req.search.Seat_Type = Seat_Type;
  }
  if (Gender != "" && Gender != "Both") {
    if (Gender === "Female-only")
      req.search.Gender = "Female-only (including Supernumerary)";
  }
  if (year != "") {
    req.search.year = year;
  }

  if (Institute_Type != "") {
    req.search.Institute_Type = Institute_Type;
  }

  // console.log(req.search);
  var findInstitues = await RankList.find(req.search);
  if (!findInstitues) {
    throw new NotFoundError(
      `No institute found with matching features : ${req.search}`
    );
  }

  if (Rank != "") {
    var newDelta = 0;
    if (Delta != "") {
      newDelta = Number(Delta);
    }
    var newRank = Number(Rank);
    var upperLimit = newRank + newDelta;
    var LowerLimit = Math.max(0, newRank - newDelta);

    var temp = [];
    // console.log(newRank, newDelta, upperLimit, LowerLimit);
    findInstitues.map(async (item) => {
      var or = item.Opening_Rank;
      var cr = item.Closing_Rank;
      // console.log(or, cr, Rank);
      if (or[or.length - 1] == "P") {
        or = or.slice(0, or.length - 1);
        or = Number(or);
      }
      if (cr[cr.length - 1] == "P") {
        cr = cr.slice(0, cr.length - 1);
        cr = Number(cr);
      }
      if (
        (or <= upperLimit && or >= LowerLimit) ||
        (cr <= upperLimit && cr >= LowerLimit) ||
        (or <= upperLimit && cr >= upperLimit) ||
        (or <= LowerLimit && cr >= LowerLimit)
      ) {
        temp.push(item);
      }
      findInstitues = temp;
    });
  }

  if (filter == "Opening_Rank" || filter == "Closing_Rank") {
    // findInstitues.sort(sortByProperty(filter, sortType));
    await findInstitues.sort(function (a, b) {
      var al = a[filter].length;
      var bl = b[filter].length;
      // console.log(al, bl, "hi");
      if (a[filter][al - 1] == "P") {
        a[filter] = a[filter].slice(0, al - 1);
        al = al - 1;
      }
      if (b[filter][bl - 1] == "P") {
        b[filter] = b[filter].slice(0, bl - 1);
        bl = bl - 1;
      }
      var ans = -1;
      if (al > bl) {
        ans = 1;
      } else if (al == bl) {
        if (a[filter] > b[filter]) {
          ans = 1;
        } else if (a[filter] < b[filter]) {
          ans = -1;
        }
      }
      return sortType === "asc" ? ans : -1 * ans;
    });
  } else {
    findInstitues = sortJsonArray(findInstitues, filter, sortType);
  }

  const noOfPages = Math.ceil(findInstitues.length / itemsPerPage);
  const start = itemsPerPage * (page - 1);
  const paginatedInstitutes = findInstitues.slice(
    start,
    start + Math.min(itemsPerPage, findInstitues.length)
  );
  res.status(StatusCodes.OK).json({
    paginatedInstitutes,
    noOfPages,
    noOfItems: findInstitues.length,
    itemsPerPage: itemsPerPage,
  });
};
module.exports = { createDb, getInstitutes };

function sortByProperty(property, sortType) {
  return function (a, b) {
    const al = a[property].length;
    const bl = b[property].length;
    // console.log(al, bl, "hi");
    if (a[property][al - 1] == "P") {
      a[property] = a[property].slice(0, al - 1);
      al = al - 1;
    }
    if (b[property][bl - 1] == "P") {
      b[property] = b[property].slice(0, bl - 1);
      bl = bl - 1;
    }
    var ans = -1;
    if (al > bl) {
      ans = 1;
    } else if (al == bl) {
      if (a[property] > b[property]) {
        ans = 1;
      } else if (a[property] < b[property]) {
        ans = -1;
      }
    }
    return sortType === "asc" ? ans : -1 * ans;
  };
}
