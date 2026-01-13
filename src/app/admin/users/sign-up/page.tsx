import Form from "./Form";

export default function SignUp() {
  return (
    <>
      <Form />
      <p className="text-center mt-2.5 text-sm">
        Already have an account?{" "}
        <a href="sign-in" className="link">
          Sign in
        </a>
      </p>
    </>
  );
}

