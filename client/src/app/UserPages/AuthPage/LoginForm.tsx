import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import type { LoginForm } from "@appTypes/index";
import { useState, type SetStateAction } from "react";
import handleInputChange from "@hooks/useHandleInputChange";
import { setUserGlobalState } from "@globalState/userSlice";
import { handleError } from "@lib/error";
import type React from "react";
import { emitAlert } from "@lib/alerts";
import { useLoginMutation } from "@api/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store";
import GoogleIcon from "./GoogleIcon";
import { ButtonGroup } from "@components/ui/button-group";
import { Button } from "@components/ui/button";
import { Eye, EyeClosed } from "lucide-react";

type LoginFormProps = {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
};

export default function LoginForm({ loading, setLoading }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState<LoginForm>();
  const [isVisiblePassword, setIsVisibilePassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, setLoginForm);
  const [loginTrigger] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function checkInputs(): null | string {
    if (!loginForm) return "Please fill in the login form";
    if (!loginForm.email) return "Email is required for login";
    if (!loginForm.password) return "Password is required for login";
    return null;
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const inputs = checkInputs();
    if (inputs) {
      emitAlert(inputs, "info");
      return;
    }

    setLoading(true);
    try {
      const response = await loginTrigger(loginForm!).unwrap();

      dispatch(
        setUserGlobalState({
          user: response.user,
          isLoggedIn: response.isLoggedIn,
        }),
      );
      emitAlert(response.message ?? "Successfully logged in!", "info");
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
          value={loginForm?.email ?? ""}
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
            value={loginForm?.password ?? ""}
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

      <section className="flex items-center justify-end gap-4 text-sm">
        <button
          type="button"
          className="font-medium text-slate-800 transition hover:opacity-70 cursor-pointer"
        >
          Forgot password?
        </button>
      </section>

      <section className="flex justify-center items-center flex-col gap-4">
        <Button type="submit" size="lg2" className="cursor-pointer w-full">
          Login
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
