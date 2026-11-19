import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readApiErrors } from "../../api/readApiErrors";
import { useRegister } from "../../api/useRegister";
import { setAccessToken } from "../../auth/accessToken";
import { writeLoggedIn } from "../../auth/session";
import {
  collectErrors,
  validateEmail,
  validateName,
  validatePassword,
} from "../../auth/validateAccount";
import { ROUTES } from "../../routes/paths";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextField } from "../inputs/TextField/TextField";
import styles from "./AuthForm.module.css";
import { AlertCircleIcon } from "../../icons/AlertCircle";

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async () => {
    const nextErrors = collectErrors(
      validateName(name),
      validateEmail(email),
      validatePassword(password),
      password !== confirmPassword ? "Passwords do not match" : null,
    );
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    try {
      const session = await register.mutateAsync({
        name: name.trim(),
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
      <h2 className={styles.title}>Create account</h2>
      <p className={styles.switch}>
        Already have an account? <Link to={ROUTES.login}>Login</Link>
      </p>
      <div className={styles.fields}>
        <TextField
          name="name"
          autoComplete="name"
          placeholder="Name"
          value={name}
          onChange={setName}
        />
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
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
        <TextField
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setShowPassword((shown) => !shown)}
      >
        {showPassword ? "Hide password" : "Show password"}
      </button>
      {errors.length > 0 && (
        <div className={styles.errors} role="alert">
          {errors.map((error) => (
            <p key={error}>
              <AlertCircleIcon />
              {error}
            </p>
          ))}
        </div>
      )}
      <PrimaryButton disabled={register.isPending} onClick={submit}>
        {register.isPending && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        Register
      </PrimaryButton>
    </section>
  );
}
