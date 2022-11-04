import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function PayEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("api/getunpaid")
      .then(response => response.json())
      .then(json => {
        setEmployees(json);
      })
  });

  function payEmployees() {
    fetch("api/pay/")
      .then(response => response.json())
  }

  const employeeItems = employees.map((employee, index) => 
    <Typography>{employee.name}: {employee.hours}</Typography>
  );

  return (
    <>
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
