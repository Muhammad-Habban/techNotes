import React, { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
const Login = () => {
  // using refs to focus login input when page loads and focusing error when there is one
  const userRef = useRef();
  const errRef = useRef();
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  // PERSIST
  const [persist, setPersist] = usePersist();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPersistCheck = (e) => setPersist((prev) => !prev);
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);
  const onSubmitClicked = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err) {
        setErrMsg("No server Response");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.status === 403) {
        setErrMsg("Forbidden");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };
  const errClass = errMsg ? "errmsg" : "offscreen";
  if (isLoading) return <p>Loading...</p>;
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={onSubmitClicked}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={onUsernameChanged}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={onPasswordChanged}
            value={password}
            required
          />
          <button type="submit" className="form__submit-button">
            Sign In
          </button>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={onPersistCheck}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
