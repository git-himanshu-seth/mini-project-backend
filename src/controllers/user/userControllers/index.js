const { validateUserData, loginValidation } = require("./userValidation");
const {
  handleResponseWithoutData,
  handleResponseWithData,
} = require("../../../helpers/ResponseHandler");
const { RESPONSE_TYPE } = require("../../../helpers/constants");
const { Users, Department } = require("../../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = (req, res) => {
  let reqBody = req?.body;
  try {
    validateUserData({ ...reqBody }, res, async (isValid) => {
      if (isValid) {
        const userExist = await Users.findOne({
          email_address: reqBody.email_address,
        });

        if (userExist) {
          return res
            .status(200)
            .json(
              handleResponseWithoutData("userAlreadyExist", RESPONSE_TYPE.FAIL)
            );
        }
        bcrypt.genSalt(process.env.SALT_ROUND, function (err, salt) {
          bcrypt.hash(reqBody.password, salt, async (err, hash) => {
            if (hash) {
              const userData = {
                ...reqBody,
                password: hash,
              };
              const user = await Users.create(userData);
              if (user) {
                const token = jwt.sign(
                  {
                    userId: user._id,
                    user_type: user.user_type,
                    email_address: user.email_address,
                    first_name: user.first_name,
                    last_name: user.last_name,
                  },
                  process.env.JWT_SECRET_ACCESS_KEY_USER,
                  {
                    expiresIn: "2h",
                  }
                );
                const refreshToken = jwt.sign(
                  {
                    userId: user._id,
                    email_address: user.email_address,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_type: user.user_type,
                  },
                  process.env.JWT_REFRESH_KEY_USER,
                  {
                    expiresIn: "7h",
                  }
                );
                return res.status(200).json({
                  data: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    user_type: userData.user_type,
                    email_address: userData.email_address,
                    id: userData.id,
                  },
                  meta: {
                    code: 1,
                    refreshToken: refreshToken,
                    accessToken: token,
                    message: "SignUp success",
                  },
                });
              }
            } else {
              return res
                .status(400)
                .json(
                  handleResponseWithoutData(
                    "invalidUserData",
                    RESPONSE_TYPE.FAIL
                  )
                );
            }
            if (err)
              return res
                .status(500)
                .json(
                  handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL)
                );
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const userLogin = (req, res) => {
  const reqBody = req.body;
  try {
    loginValidation(reqBody, res, async (isValid) => {
      if (isValid) {
        const userData = await Users.findOne({
          email_address: reqBody.email,
        });
        if (userData) {
          bcrypt
            .compare(reqBody.password, userData.password)
            .then(function (result) {
              if (result) {
                const token = jwt.sign(
                  {
                    userId: userData._id,
                    user_type: userData.user_type,
                    email_address: userData.email_address,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                  },
                  process.env.JWT_SECRET_ACCESS_KEY_USER,
                  {
                    expiresIn: "2h",
                  }
                );
                const refreshToken = jwt.sign(
                  {
                    userId: userData._id,
                    email_address: userData.email_address,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    user_type: userData.user_type,
                  },
                  process.env.JWT_REFRESH_KEY_USER,
                  {
                    expiresIn: "7h",
                  }
                );
                return res.status(200).json({
                  data: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    user_type: userData.user_type,
                    email_address: userData.email_address,
                    id: userData.id,
                  },
                  meta: {
                    code: 1,
                    refreshToken: refreshToken,
                    accessToken: token,
                    message: "Login success",
                  },
                });
              }
              return res
                .status(400)
                .json({ message: "Incorrect username or password" });
            });
        } else {
          return res.status(200).json({ message: "No user Found " });
        }
      } else {
        return res.status(400).send("Invalid user data");
      }
    });
  } catch {
    (err) => {
      return res.status(400).send("Some thing went wrong");
    };
  }
};

const getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const user_type = req.query.type || "employee";
  const sortField = req.query.sortField || "location";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  try {
    const skip = (page - 1) * limit;

    const totalUsers = await Users.countDocuments({
      user_type,
      deletedAt: null,
    });

    const users = await Users.find({ user_type, deletedAt: null })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("department")
      .lean();
    users.forEach((user) => {
      user.user_name = `${user.first_name} ${user.last_name}`;
      user.department_name = user?.department?.name || "NA";
      user.department_id = user?.department?._id || "NA";
      user.department_code = user?.department?.department_code || "NA";
      user.department_name = user?.department?.department_name || "NA";
    });

    const totalPages = Math.ceil(totalUsers / limit);

    const response = {
      employees: users,
      totalDocuments: totalUsers,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };

    res
      .status(200)
      .json(
        handleResponseWithData(
          "getEmployeesSuccess",
          RESPONSE_TYPE.SUCCESS,
          response
        )
      );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findOne({ _id: userId, deleteAt: null });

    if (!user) {
      return res
        .status(404)
        .json(handleResponseWithData("UserNotFound", RESPONSE_TYPE.FAIL));
    }
    res
      .status(200)
      .json(
        handleResponseWithData("getUserSuccess", RESPONSE_TYPE.SUCCESS, user)
      );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

const assignDepartmentToEmployee = async (req, res) => {
  const { employeeId, departmentId } = req.body;

  if (!employeeId || !departmentId) {
    return res.status(400).json({
      message: "Employee ID and Department ID are required",
      type: RESPONSE_TYPE.FAIL,
    });
  }

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        type: RESPONSE_TYPE.FAIL,
      });
    }

    const employee = await Users.findByIdAndUpdate(
      employeeId,
      { department: departmentId, department_assigne_by: "" },
      { new: true }
    ).populate("department");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        type: RESPONSE_TYPE.FAIL,
      });
    }

    res.status(200).json({
      message: "Department assigned successfully",
      type: RESPONSE_TYPE.SUCCESS,
      data: employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
      type: RESPONSE_TYPE.FAIL,
    });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "Employee ID is required",
      type: RESPONSE_TYPE.FAIL,
    });
  }

  try {
    const employee = await Users.findByIdAndUpdate(id, {
      deleteAt: Date.now(),
    });

    if (!employee) {
      return res
        .status(404)
        .json(
          handleResponseWithoutData("Employee not found", RESPONSE_TYPE.FAIL)
        );
    }

    res
      .status(200)
      .json(
        handleResponseWithoutData(
          "Employee deleted successfully",
          RESPONSE_TYPE.SUCCESS
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
      type: RESPONSE_TYPE.FAIL,
    });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res
      .status(400)
      .json(
        handleResponseWithoutData("Employee ID is required", RESPONSE_TYPE.FAIL)
      );
  }

  try {
    const employee = await Users.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    console.log(employee);

    if (!employee) {
      return res
        .status(404)
        .json(
          handleResponseWithoutData("employeeNotFound", RESPONSE_TYPE.FAIL)
        );
    }

    res
      .status(200)
      .json(
        handleResponseWithoutData(
          "EmployeeUpdatedSuccessfully",
          RESPONSE_TYPE.SUCCESS
        )
      );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(handleResponseWithoutData(err.message, RESPONSE_TYPE.FAIL));
  }
};

module.exports = {
  registerUser,
  userLogin,
  getEmployees,
  getUserDetails,
  assignDepartmentToEmployee,
  deleteEmployee,
  updateEmployee,
};
