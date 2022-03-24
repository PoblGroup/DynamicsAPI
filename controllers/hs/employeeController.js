"use strict";
import { GetEmployeeByEmail } from "../../utils/Dynamics/Employee.js";
import { GetEmployeeJobRoles } from "../../utils/Dynamics/JobRoles.js";

const getEmployeeByEmail = async (req, res) => {
  const employeeId = req.query.empId;
  const email = req.params.email;
  const token = req.headers["authorization"].split(" ")[1];
  let employeeRoles = [];

  try {
    const employee = await GetEmployeeByEmail(token, email);

    if (employee == null) {
      res.status(401).send(`Employee not found with email: ${email}`);
    }

    // Fetch Employee Job Roles
    const roles = await GetEmployeeJobRoles(token, employeeId);

    try {
      if (roles.value.length > 0) {
        roles.value.map((role) => {
          const r = {
            id: role.pobl_jobroleid,
            title: role.pobl_jobroletitle,
            startDate: role.pobl_jobrolestartdate,
            endDate: role.pobl_jobroleend,
          };
          employeeRoles.push(r);
        });
      } else {
        employeeRoles.push({ message: "Not Job Roles Found" });
      }
    } catch (error) {
      console.log("ERROR", error);
    }

    res.status(200).json({ employee, employeeRoles });
  } catch (error) {
    res.status(500).send();
  }
};

export { getEmployeeByEmail };
