import React, { Fragment, useEffect, useState, useCallback } from "react";
import openSocket from "socket.io-client";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

const Feed = props => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(
    direction => {
      if (direction) {
        setPostsLoading(true);
        setPosts([]);
      }
      let page = postPage;
      if (direction === "next") {
        page++;
        setPostPage(page);
      }
      if (direction === "previous") {
        page--;
        setPostPage(page);
      }
      fetch("http://localhost:8080/feed/posts?page=" + page, {
        headers: {
          Authorization: "Bearer " + props.token
        }
      })
        .then(res => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch posts.");
          }
          return res.json();
        })
        .then(resData => {
          setPosts(
            resData.posts.map(post => {
              return { ...post, imagePath: post.imageUrl };
            })
          );
          setTotalPosts(resData.totalItems);
          setPostsLoading(false);
        })
        .catch(catchError);
    },
    [postPage, props.token]
  );

  const addPost = useCallback(
    post => {
      const updatedPosts = [...posts];
      if (postPage === 1) {
        if (posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      setPosts(updatedPosts);
      setTotalPosts(totalPosts + 1);
    },
    // [postPage, totalPosts, posts]
    // eslint-disable-next-line
    [postPage, totalPosts]
  );

  const updatePost = useCallback(
    post => {
      const updatedPosts = [...posts];
      const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      setPosts(updatedPosts);
    },
    // [posts]
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    fetch("http://localhost:8080/user/status", {
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        return res.json();
      })
      .then(resData => {
        setStatus(resData.status);
      })
      .catch(catchError);

    loadPosts();
    //Socket.io
    const socket = openSocket("http://localhost:8080");
    socket.on("posts", data => {
      if (data.action === "create") {
        addPost(data.post);
      } else if (data.action === "update") {
        updatePost(data.post);
      } else if (data.action === "delete") {
        loadPosts();
      }
    });
  }, [loadPosts, props.token, addPost, updatePost]);

  const statusUpdateHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8080/user/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: status
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(catchError);
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = postId => {
    const loadedPost = { ...posts.find(p => p._id === postId) };
    setIsEditing(true);
    setEditPost(loadedPost);
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = postData => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("image", postData.image);
    let url = "http://localhost:8080/feed/post";
    let method = "POST";
    if (editPost) {
      url = "http://localhost:8080/feed/post/" + editPost._id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        // eslint-disable-next-line
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt
        };

        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsEditing(false);
        setEditPost(null);
        setEditLoading(false);
        setError(err);
      });
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value);
  };

  const deletePostHandler = postId => {
    setPostsLoading(true);
    fetch("http://localhost:8080/feed/post/" + postId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        loadPosts();
        // const updatedPosts = posts.filter(p => p._id !== postId);
        // setPosts(updatedPosts);
        // setPostsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setPostsLoading(false);
      });
  };

  const errorHandler = () => {
    setError(null);
  };

  const catchError = error => {
    setError(error);
  };

  return (
    <Fragment>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={loadPosts.bind(this, "previous")}
            onNext={loadPosts.bind(this, "next")}
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map(post => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={startEditPostHandler.bind(this, post._id)}
                onDelete={deletePostHandler.bind(this, post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </Fragment>
  );
};

export default Feed;
