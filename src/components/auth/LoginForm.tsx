import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readApiErrors } from "../../api/readApiErrors";
import { useLogin } from "../../api/useLogin";
import { setAccessToken } from "../../auth/accessToken";
import { writeLoggedIn } from "../../auth/session";
import {
  collectErrors,
  validateEmail,
  validatePassword,
} from "../../auth/validateAccount";
import { ROUTES } from "../../routes/paths";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextField } from "../inputs/TextField/TextField";
import styles from "./AuthForm.module.css";
import { ErrorBox } from "../ErrorBox/ErrorBox";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async () => {
    const nextErrors = collectErrors(
      validateEmail(email),
      validatePassword(password),
    );
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    try {
      const session = await login.mutateAsync({
        email: email.trim(),
        password,
      });
      setAccessToken(session.accessToken);
      writeLoggedIn(true);
      navigate(ROUTES.homepage);
    } catch (error) {
      setErrors(readApiErrors(error));
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Log in</h2>
      <p className={styles.switch}>
        New user? <Link to={ROUTES.register}>Create account</Link>
      </p>
      <div className={styles.fields}>
        <TextField
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />
        <TextField
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setShowPassword((shown) => !shown)}
      >
        {showPassword ? "Hide password" : "Show password"}
      </button>
      <ErrorBox className={styles.errors} messages={errors} />
      <PrimaryButton disabled={login.isPending} onClick={submit}>
        {login.isPending && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        Log in
      </PrimaryButton>
    </section>
  );
}
