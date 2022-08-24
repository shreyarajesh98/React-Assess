import { React, useState} from 'react';
import { Button, Container, Grid, Paper, TextField , IconButton, InputAdornment} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

 const Register = () => {
    const navigate = useNavigate()
    const [values , setValues] = useState({
        firstname: "",
        emailaddress: "",
        password: "",
        showPassword: false
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/register" , { 
            firstname : values.firstname,
            emailaddress: values.emailaddress,
            password: values.password
        }
        ).then((res) => {
            console.log(res)
            if(res.status === 200) {
                toast.success(res.data.message);
                navigate("/login");
            }
        }).catch((err) => {
            toast.error(err.response.data.message)
        })

    }
    const handlePassword =() => {
      setValues({
        ...values,
        showPassword: !values.showPassword
      })

    }
    return (
        <div>
        <Container maxWidth='sm'>
            <Grid 
                container 
                spacing={2}
                direction="column"
                justifyContent="center"
                style={{ minHeight : "100vh" }}
            >
                <Paper elevation={2} sx={{ padding: 5}}>
                    <form onSubmit={handleSubmit}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <TextField 
                                    type="name" 
                                    fullWidth 
                                    label="Enter user name"
                                    placeholder='User Name'
                                    required
                                    onChange={(e) => setValues({ ...values, firstname: e.target.value})}
                                />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    type="email" 
                                    fullWidth 
                                    label="Enter email address" 
                                    placeholder='Email address'
                                    required
                                    onChange={(e) => setValues({ ...values, emailaddress: e.target.value})}
                                />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    type={values.showPassword ? 'text' : 'password'} 
                                    fullWidth 
                                    label="Enter password" 
                                    placeholder='Password'
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton
                                        onClick={handlePassword}
                                        aria-label="toggle password"
                                        edge="end"
                                        >
                                        {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                        </InputAdornment>
                                        ),
                                    }}
                                    required
                                    onChange={(e) => setValues({ ...values, password: e.target.value})}
                                />
                            </Grid>
                            <Grid item>
                            <Button type="submit" variant="contained" fullWidth>
                                Sign Up
                            </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid item>
                        <p> Already have an account ?  
                        <Link to={{ pathname: "/login" }}> Sign In </Link>
                        </p>
                    </Grid>
                </Paper>
                <ToastContainer/>
            </Grid>
            </Container>
        </div>
    )
 }
 export default Register;