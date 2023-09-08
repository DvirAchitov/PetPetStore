import React, {useEffect, useState} from "react";
import {FirebaseAuth, users} from "./firebase_functions";
import {Link} from "react-router-dom";
import "./login.css"
import background from "../assets/StorePics/productback.jpg"
import Loading from "./Loading";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import SendIcon from '@material-ui/icons/SendRounded';
import 'bootstrap/dist/js/bootstrap.min.js';
import {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBModalFooter,
    MDBRow
} from "mdb-react-ui-kit";
import {Col, Row} from "reactstrap";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@material-ui/core/Button";
import {AccountCircleRounded} from "@material-ui/icons";
import {LoginRounded} from "@mui/icons-material";

export function SignIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/store");
            }
        });
    }, [props.history]);

    const handleSignIn = async () => {
        setIsLoading(true);
        await FirebaseAuth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
            })
            .catch(error => {
                alert(error.message);
                setIsLoading(false);
            });
    };
    if (isLoading)
        return <Loading/>
    return (

        <div style={{padding: "50px",
            height: "100vh",
            backgroundImage: `url(${background})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",

            }}>
                <MDBCard
                    className='card-image'
                    style={{
                        display: "inline-block",
                        margin: "0 auto",
                        padding: "3px",
                        backgroundColor: "#8ebf42",
                        backgroundImage:
                            'url(https://img.freepik.com/free-vector/different-pets-concept_52683-37940.jpg?w=2000)',
                        width: '28rem'
                    }}
                >
                    <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
                        <div className='text-center'>
                            <strong>PetPet store</strong>
                            <h3 className='white-text mb-5 mt-4 font-weight-bold'>

                                <strong>SIGN</strong>
                                <a href='/' className='green-text font-weight-bold'>
                                    <strong> IN</strong>
                                </a>
                            </h3>
                        </div>
                        <MDBInput
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                            }}
                            type="email"
                            id="form2Example1"
                            className="form-control"
                            placeholder="Email address"
                            label='Your email'
                            validate={'true'}
                            labelClass='white-text'

                        />
                        <MDBInput
                            onChange={e => {
                                setPassword(e.target.value);
                            }}
                            onKeyDown={(key) => {
                                if (key.key === 'Enter') handleSignIn();
                            }}
                            value={password}
                            type="password"
                            id="form2Example2"
                            className="form-control"
                            placeholder="Password"
                            label='Your password'
                            validate={'true'}
                            labelClass='white-text'
                        />
                        <br/><br/>
                        <Row>
                            <Col md={12} sm={12} xs={12} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Don't have an account? <Link to="/signup">Sign up!</Link>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={12} sm={12} xs={12} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Forgot your password? <Link to="/reset_password">Reset password!</Link>
                            </Col>
                        </Row>
                        <br/><br/>

                        <MDBRow style={{display: "flex",
                            justifyContent: "center",
                            alignItems: "center"}} className='d-flex align-items-center mb-4'>

                                <Button
                                    onClick={handleSignIn}
                                    type="submit"
                                    className="btn-block z-depth-1"
                                    color='primary'
                                    variant={'contained'}
                                    rounded={'true'}
                                    startIcon={<LoginRounded/>}
                                    style={{width:"150px",fontSize: "18px"}}
                                >
                                    Sign in
                                </Button>

                        </MDBRow>
                    </div>
                </MDBCard>

            </MDBContainer>

            {/****************/}
        </div>

    );
}

export function SignUp(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    let flag = false;
    const handlePasswordChange = () => {
        const p = document.getElementById("password").value;
        const cp = document.getElementById("cpassword").value;

        if (strongRegex.test(p)) {
            document.getElementById("password1error").style.color = "green";
            document.getElementById("password1error").innerText = 'password is strong';
            flag = true;

        } else if (mediumRegex.test(p)) {
            document.getElementById("password1error").style.color = "orange";
            document.getElementById("password1error").innerText = 'password is midium';
            flag = true;

        } else {
            document.getElementById("password1error").style.color = "red";
            document.getElementById("password1error").innerText = 'password is too weak';
            flag = false;

        }
        if (p.length === 0)
            return;
        if (p !== cp) {
            document.getElementById("password2error").style.color = "red";
            document.getElementById("password2error").innerText = "passwords do not match !"
            flag = false;
        } else {
            document.getElementById("password2error").style.color = "lightgreen";
            document.getElementById("password2error").innerText = "passwords match !"
            flag = true;
        }
        console.log(flag);
    };
    const createUserInDatabase = async (email) => {
        console.log(email);
        await users.doc(email).set({cart: {}, name: email.split('@')[0]});
    }

    const createRandom = () => {
        const rmail = Math.random().toString(36).substring(2, 15) + '@test.test';
        const pass = 'qwer1234'
        document.getElementById('emailInput').value = rmail;
        document.getElementById("password").value = pass;
        document.getElementById("cpassword").value = pass;
    }

    const handleSignUp = async () => {
        if(email === '')
            createRandom();
        handlePasswordChange();
        console.log(flag);
        let success = false;
        if (!flag)
            return;
        // if got here then all good.
        if (toast.isActive('this is love'))
            return;
        const emailAddress =  document.getElementById('emailInput').value;
        const emailPassword = document.getElementById("password").value;
        const response = await toast.promise(
            FirebaseAuth.createUserWithEmailAndPassword(emailAddress, emailPassword), {
                pending: {
                    render() {
                        return "Creating account"
                    },
                    icon: false,
                },
                success: {
                    render() {
                        console.log('creating account');
                        console.log('account created');
                        success = true;
                        toast.info('logging in');
                        return `Account has been created`
                    },
                    // other options
                    icon: "✔️",
                    autoClose: 1000
                },
                error: {
                    render({data}) {
                        console.log(email);
                        // When the promise reject, data will contains the error
                        return `Failed to create account - ${data.message}`
                    }
                },
            }, {
                toastId: 'this is love',
                onClose: () => {if(success) {
                    createUserInDatabase(emailAddress).then(() => {
                        props.history.push('/');
                    });
                }}
            }
        );

        console.log(response);
    };

    return (
        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${background})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",
            }}>
                <MDBCard
                    className='card-image'
                    style={{
                        display: "inline-block",
                        margin: "0 auto",
                        padding: "3px",
                        backgroundColor: "#8ebf42",
                        backgroundImage:
                            'url(https://mdbcdn.b-cdn.net/img/Photos/Others/pricing-table7.jpg)',
                        width: '28rem'
                    }}
                >
                    <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
                        <div className='text-center'>
                            <strong>PetPet store</strong>
                            <h3 className='white-text mb-5 mt-4 font-weight-bold'>

                                <strong>SIGN</strong>
                                <a href={'/signup'} link='/signup' className='green-text font-weight-bold'>
                                    <strong> Up</strong>
                                </a>
                            </h3>
                        </div>
                        <MDBInput
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                            }}
                            type="email"
                            id="emailInput"
                            className="form-control"
                            label='Your email'
                            validate={'true'}
                            labelClass='white-text'
                        />
                        <MDBInput
                            onChange={e => {
                                setPassword(e.target.value);
                                handlePasswordChange();
                            }}
                            value={password}
                            type="password"
                            id="password"
                            className="form-control"
                            label='password'
                            validate={'true'}
                            labelClass='white-text'
                        />

                        <MDBInput
                            onChange={e => {
                                setConfirm_Password(e.target.value);
                                handlePasswordChange();
                            }}
                            onKeyDown={async (key) => {
                                if (key.key === 'Enter') await handleSignUp();
                            }}
                            value={confirm_password}
                            type="password"
                            id="cpassword"
                            className="form-control"
                            label='Confirm password '
                            validate={'true'}
                            labelClass='white-text'
                        />
                        <span className={"error"}><p id="password1error"/></span>
                        <span className={"error"}><p id="password2error"/></span>
                        <br/>
                        <div>
                            login into existing account <Link to="/">Sign in!</Link>
                        </div>

                        <br/><br/><br/>
                        <MDBRow style={{display: "flex",
                            justifyContent: "center",
                            alignItems: "center"}} className='d-flex align-items-center mb-4'>

                            <Button
                                onClick={handleSignUp}
                                className="btn-block z-depth-1"
                                color='primary'
                                variant={'contained'}
                                startIcon={<AccountCircleRounded/>}
                                rounded={'true'}
                                style={{width:"150px",fontSize: "18px"}}
                            >
                                Sign up
                            </Button>
                        </MDBRow>
                    </div>
                </MDBCard>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    style={{width: 'auto'}}
                />
            </MDBContainer>
        </div>
    );
}

export function ResetPassword(props) {
    const [email, setEmail] = useState("");

    const handleResetPassword = async () => {
        if (toast.isActive('resetToast'))
            return;
        let success = false;
        await toast.promise(FirebaseAuth.sendPasswordResetEmail(email), {
                pending: {
                    render() {
                        return "Sending Email"
                    },
                    icon: false,
                },
                success: {
                    render() {
                        success = true;
                        return `Email successfully sent`
                    },
                    // other options
                    icon: "🟢", autoClose: 1500
                },
                error: {
                    render({data}) {
                        // When the promise reject, data will contains the error
                        return `Failed to send email - ${data.message}`
                    }
                },
            }, {
                toastId: 'resetToast',
                onClose: props1 => {
                    console.log(props1);
                    if(success)
                        props.history.push('/');
                }
            }
        );
    }
    return (
        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${background})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",
            }}>
                <MDBCard style={{
                    display: "inline-block",
                    margin: "0 auto",
                    padding: "3px",
                    width: '28rem'
                }}>
                    <MDBCardBody>
                        <MDBCardHeader className="form-header warm-flame-gradient rounded">
                            <h3 className="my-3">
                                <MDBIcon icon="lock"/> Reset password
                            </h3>
                        </MDBCardHeader>
                        <form>
                            <br/><br/>
                            <div className="grey-text">
                                <MDBInput
                                    placeholder="email"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                    }}
                                    onKeyDown={async (key) => {
                                        if (key.key === 'Enter') await handleResetPassword();
                                    }}
                                />

                            </div>
                            <br/>
                            <Button
                                onClick={handleResetPassword}
                                className="btn-block z-depth-1"
                                color='primary'
                                variant={'contained'}
                                startIcon={<SendIcon/>}
                                rounded={'true'}
                                style={{width:"150px",fontSize: "18px"}}
                            >
                                Send
                            </Button>

                        </form>
                        <br/>
                        <MDBModalFooter style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div
                                className="font-weight-light">
                                Did you remember your password? <Link to="/">Sign in!</Link>
                                <br/>
                                Not a member? <Link to="/signup">Sign up!</Link>
                            </div>
                        </MDBModalFooter>
                    </MDBCardBody>
                </MDBCard>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    style={{width: 'auto'}}
                />
            </MDBContainer>
        </div>
    )
}
