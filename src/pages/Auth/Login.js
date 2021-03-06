// import React, { Component } from "react";

// import Input from "../../components/Form/Input/Input";
// import Button from "../../components/Button/Button";
// import { required, length, email } from "../../util/validators";
// import Auth from "./Auth";

// class Login extends Component {
//   state = {
//     loginForm: {
//       email: {
//         value: "",
//         valid: false,
//         touched: false,
//         validators: [required, email]
//       },
//       password: {
//         value: "",
//         valid: false,
//         touched: false,
//         validators: [required, length({ min: 5 })]
//       },
//       formIsValid: false
//     }
//   };

//   inputChangeHandler = (input, value) => {
//     this.setState(prevState => {
//       let isValid = true;
//       for (const validator of .loginForm[input].validators) {
//         isValid = isValid && validator(value);
//       }
//       const updatedForm = {
//         ...prevState.loginForm,
//         [input]: {
//           ...prevState.loginForm[input],
//           valid: isValid,
//           value: value
//         }
//       };
//       let formIsValid = true;
//       for (const inputName in updatedForm) {
//         formIsValid = formIsValid && updatedForm[inputName].valid;
//       }
//       return {
//         loginForm: updatedForm,
//         formIsValid: formIsValid
//       };
//     });
//   };

//   inputBlurHandler = input => {
//     this.setState(prevState => {
//       return {
//         loginForm: {
//           ...prevState.loginForm,
//           [input]: {
//             ...prevState.loginForm[input],
//             touched: true
//           }
//         }
//       };
//     });
//   };

//   render() {
//     return (
//       <Auth>
//         <form
//           onSubmit={e =>
//             this.props.onLogin(e, {
//               email: this.state.loginForm.email.value,
//               password: this.state.loginForm.password.value
//             })
//           }
//         >
//           <Input
//             id="email"
//             label="Your E-Mail"
//             type="email"
//             control="input"
//             onChange={this.inputChangeHandler}
//             onBlur={this.inputBlurHandler.bind(this, "email")}
//             value={this.state.loginForm["email"].value}
//             valid={this.state.loginForm["email"].valid}
//             touched={this.state.loginForm["email"].touched}
//           />
//           <Input
//             id="password"
//             label="Password"
//             type="password"
//             control="input"
//             onChange={this.inputChangeHandler}
//             onBlur={this.inputBlurHandler.bind(this, "password")}
//             value={this.state.loginForm["password"].value}
//             valid={this.state.loginForm["password"].valid}
//             touched={this.state.loginForm["password"].touched}
//           />
//           <Button design="raised" type="submit" loading={this.props.loading}>
//             Login
//           </Button>
//         </form>
//       </Auth>
//     );
//   }
// }

// export default Login;

import React, { useState } from "react";

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

const Login = props => {
  const [loginForm, setLoginForm] = useState({
    email: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, email]
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    }
  });
  // eslint-disable-next-line
  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangeHandler = (input, value) => {
    let isValid = true;
    for (const validator of loginForm[input].validators) {
      isValid = isValid && validator(value);
    }
    const updatedForm = {
      ...loginForm,
      [input]: {
        ...loginForm[input],
        valid: isValid,
        value: value
      }
    };
    let formIsValid = true;
    for (const inputName in updatedForm) {
      formIsValid = formIsValid && updatedForm[inputName].valid;
    }
    setLoginForm(updatedForm);
    setFormIsValid(formIsValid);
  };

  const inputBlurHandler = input => {
    setLoginForm({
      ...loginForm,
      [input]: {
        ...loginForm[input],
        touched: true
      }
    });
  };

  return (
    <Auth>
      <form
        onSubmit={e =>
          props.onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value
          })
        }
      >
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("email")}
          value={loginForm["email"].value}
          valid={loginForm["email"].valid}
          touched={loginForm["email"].touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("password")}
          value={loginForm["password"].value}
          valid={loginForm["password"].valid}
          touched={loginForm["password"].touched}
        />
        <Button design="raised" type="submit" loading={props.loading}>
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
