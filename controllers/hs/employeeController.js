"use strict";
import { GetEmployeeByEmail } from "../../utils/Dynamics/Employee.js";

const getEmployeeByEmail = async (req, res) => {
  const email = req.params.email;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const employee = await GetEmployeeByEmail(token, email);

    if (employee == null) {
      res.status(401).send(`Employee not found with email: ${email}`);
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).send();
  }
};

export { getEmployeeByEmail };
