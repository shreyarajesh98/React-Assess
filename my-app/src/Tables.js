import  React , { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button , Grid, Paper, TextField } from '@mui/material';
import  data  from './data'
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


export default function BasicTable() {

const [searchedVal, setSearchedVal] = useState("");
const user = JSON.parse(localStorage.getItem("user"));


const handleSubmit = (e , value) => {
  e.preventDefault()
  const formData = {
    document: JSON.stringify(value),
    emailaddress: user.emailaddress,
  };
  axios.post("http://localhost:5000/update", formData).then(
    (res) => {
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    },
    (err) => {
      console.log(err)
      toast.error(err.response.data.message)
    }
  )
}
  return (
    <TableContainer direction="row">
      <Paper elevation={2}>
        <Grid>
        <Paper elevation={1} sx={{ padding: 2}}>
        <Grid item>
          <TextField
            id="search-bar"
            className="text"
            onChange={(e) => setSearchedVal(e.target.value)}
            label="Enter the language to search "
            variant="outlined"
            placeholder="Search..."
            style ={{width: '90%' }}
          />
        </Grid>
        </Paper>
        </Grid>
      <Table sx={{ minWidth: 650 ,  "& .MuiTableCell-root": {
         borderLeft: "1px solid black"
        }}} aria-label="simple table">
        <TableHead sx={{
          backgroundColor: "gray" ,
        }}>
          <TableRow>
            <TableCell width="20%" > <b> Languages</b> </TableCell>
            <TableCell width="60%" align="center"> <b> Code Snippets </b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
              .filter((row) =>
                !searchedVal.length || row.name
                  .toString()
                  .toLowerCase()
                  .includes(searchedVal.toString().toLowerCase()) 
              )
              .map((value) => (
            <TableRow
              key={value.body}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {value.name}
              </TableCell>
              <TableCell align="center">{value.body}</TableCell>
              <TableCell align="center">
                <Button type="submit" variant="contained" onClick={(e) => handleSubmit(e , value)}> Save </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Paper>
      <ToastContainer/>
    </TableContainer>
  );
}
