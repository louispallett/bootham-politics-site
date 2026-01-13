import Form from "./Form";

export default function SignIn() {
  return (
    <>
      <Form />
      <p className="text-center mt-2.5 text-sm">
        Not registered?{" "}
        <a href="sign-up" className="link">
          Sign Up
        </a>
      </p>
    </>
  );
}

