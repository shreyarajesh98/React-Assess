import  React , { useEffect } from 'react' ;
import { useNavigate } from "react-router-dom";
import  DataTable from './Tables'
import axios from "axios";
import { Button, Grid } from '@mui/material';
import { toast } from "react-toastify";

const Dashboard = () => {
    const navigate = useNavigate()
    
    const getToken = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem("user"));
        
    useEffect(() => {
        if (getToken === null){
            navigate("/login")   
        }
        else {
            axios.defaults.headers.common["Authorization"] =
            "Bearer " + getToken;
          axios
          .post("http://localhost:5000/user", {
            headers: { token: getToken },
            emailaddress: user.emailaddress
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res)
            }
          }).catch((err) => {
              if(err.response.status === 404) { 
                toast.error("You do not have permission to access this page !!")
                setTimeout(() => {
                  navigate("/login")
                }, 1000);
            }
            })
          };
    },[navigate , getToken])

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.clear();
        toast.success("Log out successfull")
        setTimeout(() => {
          navigate("/login")
        }, 1000);
    }
    return(
        <div>
             <h1> Welcome to code Snippets{ user?.firstname }  </h1>
             <Grid container>
                <Button onClick={(e) => handleSubmit(e)} variant="contained" color="warning"> Log out</Button>
             </Grid>
             <DataTable></DataTable>
        </div>
    )
}
export default Dashboard