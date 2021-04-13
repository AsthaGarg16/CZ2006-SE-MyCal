import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LeakAddTwoTone, LiveTvTwoTone } from "@material-ui/icons";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [limits, setLimits] = useState(3);

  const [correctVerificationCode, setCorrectVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [currentform, setcurrentform] = useState(0);

  function validatePassword() {
    return password.length > 0;
  }
  function validateEmail() {
    return email.length > 0;
  }
  function validateVerificationCode() {
    return verificationCode.length > 0;
  }

  // const switchForm = {
  //   0: { function: validateEmail, text: "Send verification code" },
  //   1: { function: validateVerificationCode, text: "Submit verification code" },
  //   2: { function: validatePassword, text: "Reset password" },
  // };
  const history = useHistory();

  function handleSubmit(event) {
    event.preventDefault();
    let reqbody;
    switch (currentform) {
      case 0:
        reqbody = {
          email: email,
        };
        console.log(reqbody);
        axios
          .post("/user/forgotPassword/sendCode", reqbody)
          .then((response) => {
            console.log(response.data);
            alert(response.data.message);
            // console.log(response.data.token);
            // setToken(response.data.token);
            // history.push("/planner");
            setCorrectVerificationCode(response.data.code);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
            }
          });
        setcurrentform(1);
        break;
      case 1:
        if (verificationCode !== correctVerificationCode) {
          if (limits === 1) {
            setLimits(3);
            alert("Limits exceeded to enter the verification code.");
            setcurrentform(0);
            break;
          }
          setLimits((prevlimit) => prevlimit - 1);

          alert("Wrong code. Please try again.");
        } else {
          console.log(reqbody);
          setcurrentform(2);
        }

        break;
      case 2:
        if (password.length < 6) {
          alert(
            "The password must contain at least 6 characters. Please try again."
          );
        } else if (password !== cpassword) {
          alert("The passwords do not match. Please try again.");
        } else {
          reqbody = {
            email: email,
            password: password,
          };
          axios
            .post("/user/forgotPassword/reset", reqbody)
            .then((response) => {
              console.log(response.data);
              alert(response.data.message);
              history.push("/login");
              // console.log(response.data.token);
              // setToken(response.data.token);
              // history.push("/planner");
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data.message);
              }
            });
        }

        break;
      default:
        break;
    }

    // alert(JSON.stringify(reqbody));
  }

  switch (currentform) {
    case 0:
      return (
        <div className="login_container">
          <h1 className="head1"> Forgot password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>Email:</label>
              <input
                type="text"
                placeholder="Enter Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Send code"
              className="btn2 btn2-block"
            />
          </form>
        </div>
        // <div>
        //   <h4>Forgot password</h4>
        //   <Form onSubmit={handleSubmit}>
        //     <Form.Group size="lg" controlId="email">
        //       <Form.Label>Email</Form.Label>
        //       <br />
        //       <Form.Control
        //         autoFocus
        //         type="email"
        //         value={email}
        //         onChange={(e) => setEmail(e.target.value)}
        //         placeholder="Enter email"
        //       />
        //     </Form.Group>

        //     <Button
        //       block
        //       size="lg"
        //       type="submit"
        //       disabled={!validateEmail()}
        //       onclick={handleSubmit}
        //     >
        //       <span>Send code</span>
        //     </Button>
        //   </Form>
        // </div>
      );
      break;
    case 1:
      return (
        <div className="login_container">
          <h1 className="head1"> Forgot password</h1>
          <h6 className="head1">Verification Code</h6>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>Enter code:</label>
              <input
                type="text"
                placeholder="Enter verification code"
                required
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Verify code"
              className="btn2 btn2-block"
            />
          </form>
        </div>

        // <div>
        //   <h4>Forgot password</h4>
        //   <Form onSubmit={handleSubmit}>
        //     <Form.Group size="lg" controlId="username">
        //       <Form.Label>Verification Code</Form.Label>
        //       <br />
        //       <Form.Control
        //         type="text"
        //         value={verificationCode}
        //         onChange={(e) => setVerificationCode(e.target.value)}
        //         placeholder="Enter verification code"
        //       />
        //     </Form.Group>

        //     <Button
        //       block
        //       size="lg"
        //       type="submit"
        //       disabled={!validateVerificationCode()}
        //       onclick={handleSubmit}
        //     >
        //       <span>Verify code</span>
        //     </Button>
        //   </Form>
        // </div>
      );
      break;
    case 2:
      return (
        <div className="login_container">
          <h1 className="head1"> Forgot password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>Password:</label>
              <input
                type="text"
                placeholder="Enter password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label>Confirm Password:</label>
              <input
                type="text"
                placeholder="Confirm password"
                required
                onChange={(e) => setcPassword(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Reset password"
              className="btn2 btn2-block"
            />
          </form>
        </div>

        // <div>
        //   <h4>Forgot password</h4>
        //   <Form onSubmit={handleSubmit}>
        //     <Form.Group size="lg" controlId="password">
        //       <Form.Label>Password</Form.Label>
        //       <br />
        //       <Form.Control
        //         type="password"
        //         value={password}
        //         onChange={(e) => setPassword(e.target.value)}
        //         placeholder="Enter password"
        //       />
        //     </Form.Group>
        //     <Form.Group size="lg" controlId="password">
        //       <Form.Label>Confirm Password</Form.Label>
        //       <br />
        //       <Form.Control
        //         type="password"
        //         value={cpassword}
        //         onChange={(e) => setcPassword(e.target.value)}
        //         placeholder="Confirm password"
        //       />
        //     </Form.Group>

        //     <Button
        //       block
        //       size="lg"
        //       type="submit"
        //       disabled={!validatePassword()}
        //       onclick={handleSubmit}
        //     >
        //       <span>Reset password</span>
        //     </Button>
        //   </Form>
        // </div>
      );
      break;

    default:
      break;
  }
}

export default ForgotPassword;
