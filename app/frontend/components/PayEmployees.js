import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function PayEmployees({ openSnackbar }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getUnpaid();
  }, []);

  function getUnpaid() {
    fetch("api/getunpaid/")
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          setEmployees(json);
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to retrieve employees with unpaid hours");
      })
  }

  function payEmployees() {
    fetch("api/pay/")
      .then(response => response.json())
      .then(json => {
        if (json.errors.length > 0) {
          getUnpaid();
          openSnackbar("An error occurred while paying the employees", true);
        }
        else {
          getUnpaid();
          openSnackbar("Successfully paid employees");
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to pay employees", true);
      })
  }

  const employeeItems = employees.map((employee, index) => 
    <p key={index}>{employee.name}: {employee.hours} hours</p>
  );

  return (
    <>
    <Typography variant="h4" gutterBottom>Pay Employees</Typography>
    <Button 
      variant="contained" 
      onClick={payEmployees}
      sx={{maxWidth: '200px'}}
    >
      Pay All Employees
    </Button>
    {employeeItems}
    </>
  );
}
