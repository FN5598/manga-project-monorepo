import { handleError } from "@lib/error";
import { type SetStateAction, useState } from "react";
import React from "react";
import { emitAlert } from "@lib/alerts";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@api/authApi";
import handleInputChange from "@hooks/useHandleInputChange";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { ButtonGroup } from "@components/ui/button-group";
import { Button } from "@components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import GoogleIcon from "./GoogleIcon";

type SignUpFormProps = {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
};

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

type PasswordVerification = {
  password?: string;
  isMatch?: boolean;
};

export default function SignUpForm({ loading, setLoading }: SignUpFormProps) {
  const [signUpForm, setSignUpForm] = useState<SignUpForm>();
  const [passwordVerification, setPasswordVerification] =
    useState<PasswordVerification>();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, setSignUpForm);
  const [signUpTrigger] = useSignUpMutation();
  const [isVisiblePassword, setIsVisibilePassword] = useState(false);

  function verifyPassword(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    console.log("value", value);
    const isMatch = signUpForm?.password === value;

    setPasswordVerification({ isMatch, password: value });
  }

  function checkInputs(): null | string {
    if (!signUpForm) return "Email, Password, Username is reuired for sign up";
    if (!signUpForm.email) return "Email is required for sign up";
    if (!signUpForm.username) return "Username is required for sign up!";
    if (!signUpForm.password) return "Password is required for sign up";
    return null;
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const inputs = checkInputs();
    if (inputs) {
      emitAlert(inputs, "info");
      return;
    }

    try {
      setLoading(true);
      const response = await signUpTrigger(signUpForm!).unwrap();

      emitAlert(response.message ?? "Successfully Signed up", "info");
      navigate("/discover");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="space-y-5"
      aria-disabled={loading}
    >
      <section className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          value={signUpForm?.email ?? ""}
          onChange={handleChange}
          className="p-4 bg-white"
        />
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="email">Username</Label>
        <Input
          type="text"
          name="username"
          value={signUpForm?.username ?? ""}
          onChange={handleChange}
          className="p-4 bg-white"
        />
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <ButtonGroup className="w-full">
          <Input
            type={isVisiblePassword ? "text" : "password"}
            name="password"
            value={signUpForm?.password ?? ""}
            onChange={handleChange}
            className="p-4 bg-white"
          />
          <Button
            variant="secondary"
            className="cursor-pointer"
            type="button"
            onClick={() => setIsVisibilePassword((prev) => !prev)}
          >
            {isVisiblePassword ? <EyeClosed /> : <Eye />}
          </Button>
        </ButtonGroup>
      </section>

      <section className="flex flex-col gap-2">
        <Label htmlFor="password-verification">Verify Password</Label>
        <Input
          type="password"
          name="password-verification"
          value={passwordVerification?.password ?? ""}
          onChange={verifyPassword}
          className={`p-4 bg-white ${passwordVerification?.isMatch ? "" : "border-red-500"}`}
        />
      </section>

      <section className="flex justify-center items-center flex-col gap-4">
        <Button type="submit" size="lg2" className="cursor-pointer w-full">
          Sign Up
        </Button>

        <Button
          size="lg2"
          type="button"
          className="cursor-pointer w-full"
          variant="outline"
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </section>
    </form>
  );
}
