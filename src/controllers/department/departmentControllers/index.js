const {
  validateCreateDepartmentData,
  validateUpdateDepartmentData,
} = require("./departmentValidation");
const {
  handleResponseWithoutData,
  handleResponseWithData,
} = require("../../../helpers/ResponseHandler");

const { RESPONSE_TYPE } = require("../../../helpers/constants");
const { Department } = require("../../models/index");

const createDepartment = async (req, res) => {
  let reqBody = req?.body;
  try {
    validateCreateDepartmentData({ ...reqBody }, res, async (isValid) => {
      if (isValid) {
        const departmentExist = await Department.findOne({
          department_name: reqBody.department_name,
          deletedAt: null,
        });

        if (departmentExist) {
          return res
            .status(200)
            .json(
              handleResponseWithoutData(
                "departmentAlreadyExist",
                RESPONSE_TYPE.FAIL
              )
            );
        }
        let department = Department.create({ ...reqBody });
        if (department) {
          return res
            .status(201)
            .json(
              handleResponseWithoutData(
                "departmetCreatedSuccessfull",
                RESPONSE_TYPE.SUCCESS
              )
            );
        } else {
          return res
            .status(400)
            .json(
              handleResponseWithoutData(
                "departmetCreationFail",
                RESPONSE_TYPE.FAIL
              )
            );
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const updateDepartment = async (req, res) => {
  let reqBody = req?.body;
  const departmentId = req.params.id;
  try {
    validateUpdateDepartmentData({ ...reqBody }, res, async (isValid) => {
      if (isValid) {
        let department = await Department.findByIdAndUpdate(
          departmentId,
          reqBody,
          { new: true }
        );

        if (department) {
          return res
            .status(200)
            .json(
              handleResponseWithData(
                "departmentUpdatedSuccessfully",
                RESPONSE_TYPE.SUCCESS,
                department
              )
            );
        } else {
          return res
            .status(404)
            .json(
              handleResponseWithoutData(
                "departmentNotFound",
                RESPONSE_TYPE.FAIL
              )
            );
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const deleteDepartment = async (req, res) => {
  const departmentId = req?.params?.id ? req?.params?.id : null;
  try {
    if (!departmentId) {
      return res
        .status(400)
        .json(
          handleResponseWithoutData("departmentIdRequired", RESPONSE_TYPE.FAIL)
        );
    }

    const department = await Department.findByIdAndUpdate(departmentId, {
      deleteAt: Date.now(),
    });

    if (department) {
      return res
        .status(200)
        .json(
          handleResponseWithoutData(
            "departmentDeletedSuccessfully",
            RESPONSE_TYPE.SUCCESS
          )
        );
    } else {
      return res
        .status(404)
        .json(
          handleResponseWithoutData("departmentNotFound", RESPONSE_TYPE.FAIL)
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const getDepartments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const departments = await Department.aggregate([
      {
        $match: { deleteAt: null },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
        },
      },
      {
        $unwind: "$created_by",
      },
      {
        $addFields: {
          created_by_name: {
            $concat: ["$created_by.first_name", " ", "$created_by.last_name"],
          },
        },
      },
      {
        $project: {
          created_by: 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]).exec();

    const count = await Department.countDocuments({ deleteAt: null });

    return res.status(200).json(
      handleResponseWithData(
        "getDepartmentListSuccess",
        RESPONSE_TYPE.SUCCESS,
        {
          departments,
          totalPages: Math.ceil(count / limit),
          totalDocuments: count, // Add total document count
          currentPage: page,
        }
      )
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const getDepartmentById = async (req, res) => {
  const departmentId = req.params.id;

  try {
    const department = await Department.findOne({
      _id: departmentId,
      deleteAt: null, // Ensure deletedAt is null
    }).populate("created_by", "first_name last_name");

    if (department) {
      return res.status(200).json(department);
    } else {
      return res
        .status(404)
        .json(
          handleResponseWithData(
            "departmentNotFound",
            RESPONSE_TYPE.FAIL,
            department
          )
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

module.exports = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartments,
  getDepartmentById,
};
