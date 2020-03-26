// import React, { Component, Fragment } from "react";

// import Backdrop from "../../Backdrop/Backdrop";
// import Modal from "../../Modal/Modal";
// import Input from "../../Form/Input/Input";
// import FilePicker from "../../Form/Input/FilePicker";
// import Image from "../../Image/Image";
// import { required, length } from "../../../util/validators";
// import { generateBase64FromImage } from "../../../util/image";

// const POST_FORM = {
//   title: {
//     value: "",
//     valid: false,
//     touched: false,
//     validators: [required, length({ min: 5 })]
//   },
//   image: {
//     value: "",
//     valid: false,
//     touched: false,
//     validators: [required]
//   },
//   content: {
//     value: "",
//     valid: false,
//     touched: false,
//     validators: [required, length({ min: 5 })]
//   }
// };

// class FeedEdit extends Component {
//   state = {
//     postForm: POST_FORM,
//     formIsValid: false,
//     imagePreview: null
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       this.props.editing &&
//       prevProps.editing !== this.props.editing &&
//       prevProps.selectedPost !== this.props.selectedPost
//     ) {
//       const postForm = {
//         title: {
//           ...prevState.postForm.title,
//           value: this.props.selectedPost.title,
//           valid: true
//         },
//         image: {
//           ...prevState.postForm.image,
//           value: this.props.selectedPost.imagePath,
//           valid: true
//         },
//         content: {
//           ...prevState.postForm.content,
//           value: this.props.selectedPost.content,
//           valid: true
//         }
//       };
//       this.setState({ postForm: postForm, formIsValid: true });
//     }
//   }

//   postInputChangeHandler = (input, value, files) => {
//     if (files) {
//       generateBase64FromImage(files[0])
//         .then(b64 => {
//           this.setState({ imagePreview: b64 });
//         })
//         .catch(e => {
//           this.setState({ imagePreview: null });
//         });
//     }
//     this.setState(prevState => {
//       let isValid = true;
//       for (const validator of prevState.postForm[input].validators) {
//         isValid = isValid && validator(value);
//       }
//       const updatedForm = {
//         ...prevState.postForm,
//         [input]: {
//           ...prevState.postForm[input],
//           valid: isValid,
//           value: files ? files[0] : value
//         }
//       };
//       let formIsValid = true;
//       for (const inputName in updatedForm) {
//         formIsValid = formIsValid && updatedForm[inputName].valid;
//       }
//       return {
//         postForm: updatedForm,
//         formIsValid: formIsValid
//       };
//     });
//   };

//   inputBlurHandler = input => {
//     this.setState(prevState => {
//       return {
//         postForm: {
//           ...prevState.postForm,
//           [input]: {
//             ...prevState.postForm[input],
//             touched: true
//           }
//         }
//       };
//     });
//   };

//   cancelPostChangeHandler = () => {
//     this.setState({
//       postForm: POST_FORM,
//       formIsValid: false
//     });
//     this.props.onCancelEdit();
//   };

//   acceptPostChangeHandler = () => {
//     const post = {
//       title: this.state.postForm.title.value,
//       image: this.state.postForm.image.value,
//       content: this.state.postForm.content.value
//     };
//     this.props.onFinishEdit(post);
//     this.setState({
//       postForm: POST_FORM,
//       formIsValid: false,
//       imagePreview: null
//     });
//   };

//   render() {
//     return this.props.editing ? (
//       <Fragment>
//         <Backdrop onClick={this.cancelPostChangeHandler} />
//         <Modal
//           title="New Post"
//           acceptEnabled={this.state.formIsValid}
//           onCancelModal={this.cancelPostChangeHandler}
//           onAcceptModal={this.acceptPostChangeHandler}
//           isLoading={this.props.loading}
//         >
//           <form>
//             <Input
//               id="title"
//               label="Title"
//               control="input"
//               onChange={this.postInputChangeHandler}
//               onBlur={this.inputBlurHandler.bind(this, "title")}
//               valid={this.state.postForm["title"].valid}
//               touched={this.state.postForm["title"].touched}
//               value={this.state.postForm["title"].value}
//             />
//             <FilePicker
//               id="image"
//               label="Image"
//               control="input"
//               onChange={this.postInputChangeHandler}
//               onBlur={this.inputBlurHandler.bind(this, "image")}
//               valid={this.state.postForm["image"].valid}
//               touched={this.state.postForm["image"].touched}
//             />
//             <div className="new-post__preview-image">
//               {!this.state.imagePreview && <p>Please choose an image.</p>}
//               {this.state.imagePreview && (
//                 <Image imageUrl={this.state.imagePreview} contain left />
//               )}
//             </div>
//             <Input
//               id="content"
//               label="Content"
//               control="textarea"
//               rows="5"
//               onChange={this.postInputChangeHandler}
//               onBlur={this.inputBlurHandler.bind(this, "content")}
//               valid={this.state.postForm["content"].valid}
//               touched={this.state.postForm["content"].touched}
//               value={this.state.postForm["content"].value}
//             />
//           </form>
//         </Modal>
//       </Fragment>
//     ) : null;
//   }
// }

// export default FeedEdit;

import React, { Fragment, useState, useEffect } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import FilePicker from "../../Form/Input/FilePicker";
import Image from "../../Image/Image";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required]
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  }
};

const FeedEdit = props => {
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (props.editing && props.selectedPost) {
      const postForm = {
        title: {
          ...POST_FORM.title,
          value: props.selectedPost.title,
          valid: true
        },
        image: {
          ...POST_FORM.image,
          value: props.selectedPost.imagePath,
          valid: true
        },
        content: {
          ...POST_FORM.content,
          value: props.selectedPost.content,
          valid: true
        }
      };
      setPostForm(postForm);
      setFormIsValid(true);
    }
  }, [props.editing, props.selectedPost]);

  const postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(b64);
        })
        .catch(e => {
          setImagePreview(null);
        });
    }

    let isValid = true;
    for (const validator of postForm[input].validators) {
      isValid = isValid && validator(value);
    }
    const updatedForm = {
      ...postForm,
      [input]: {
        ...postForm[input],
        valid: isValid,
        value: files ? files[0] : value
      }
    };
    let formIsValid = true;
    for (const inputName in updatedForm) {
      formIsValid = formIsValid && updatedForm[inputName].valid;
    }
    setPostForm(updatedForm);
    setFormIsValid(formIsValid);
  };

  const inputBlurHandler = input => {
    setPostForm({
      ...postForm,
      [input]: {
        ...postForm[input],
        touched: true
      }
    });
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    props.onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value
    };
    props.onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  return props.editing ? (
    <Fragment>
      <Backdrop onClick={() => cancelPostChangeHandler} />
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={props.loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("title")}
            valid={postForm["title"].valid}
            touched={postForm["title"].touched}
            value={postForm["title"].value}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("image")}
            valid={postForm["image"].valid}
            touched={postForm["image"].touched}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("content")}
            valid={postForm["content"].valid}
            touched={postForm["content"].touched}
            value={postForm["content"].value}
          />
        </form>
      </Modal>
    </Fragment>
  ) : null;
};

export default FeedEdit;
