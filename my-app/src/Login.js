import { React, useState} from 'react';
import { Button, Container, Grid, Paper, TextField , IconButton, InputAdornment} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link ,useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


 const Login = () => {
    const navigate = useNavigate()

    const [values , setValues] = useState({
        emailaddress: "",
        password: "",
        showPassword: false
    })
    const handleSubmit =(e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/login", {
            emailaddress: values.emailaddress,
            password : values.password
        }).then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("expire", res.data.expiresAt);
            toast.success(res.data.message)
            setTimeout(() => {
                navigate("/");
              }, 1000);
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
                    <form onSubmit ={handleSubmit}>
                    <Grid container direction="column" spacing={2}>
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
                                onChange={(e) => setValues({ ...values, password: e.target.value})}/>
                        </Grid>
                        <Grid item>
                        <Button type="submit" variant="contained" fullWidth>
                            Sign In
                        </Button>
                        </Grid>
                        </Grid>
                    </form>
                    <Grid item>
                    <p> Dont have an account ? 
                        <Link to={{ pathname: "/register" }}> Sign Up </Link>
                    </p>
                </Grid>
                <ToastContainer />
                </Paper>
            </Grid>
            </Container>
        </div>
    )
 }
 export default Login;