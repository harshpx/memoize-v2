"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import signupSchema from "@/validationSchemas/signupSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { useContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LoaderFullPage from "../LoaderFullPage";
import { toast } from "react-toastify";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  registerUser,
} from "@/lib/features";
import { AppContext } from "@/store/AppContext";
import { setCookie } from "@/lib/utils";

const SignupForm = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");

  const [inputEmail, setInputEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const [waiting, setWaiting] = useState(false);

  const debouncedUsername = useDebounce(inputUsername, 500);
  const debouncedEmail = useDebounce(inputEmail, 500);

  const { setUser, setAuthenticated } = useContext(AppContext);

  useEffect(() => {
    // available username check api
    (async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await checkUsernameAvailability(debouncedUsername);
          setUsernameMessage(response.message);
        } catch (error) {
          setUsernameMessage("Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    })();
  }, [debouncedUsername]);

  useEffect(() => {
    // available email check api
    (async () => {
      if (debouncedEmail) {
        setIsCheckingEmail(true);
        setEmailMessage("");
        try {
          const response = await checkEmailAvailability(debouncedEmail);
          setEmailMessage(response.message);
        } catch (error) {
          setEmailMessage("Error checking email");
        } finally {
          setIsCheckingEmail(false);
        }
      }
    })();
  }, [debouncedEmail]);

  const formController = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // signup api call (if no error)
  const onSubmit = async (data) => {
    if (usernameMessage && usernameMessage.includes("taken")) return;
    if (emailMessage && emailMessage.includes("taken")) return;
    if (formController.formState.errors.username) {
      setUsernameMessage(formController.formState.errors.username);
      return;
    }
    if (formController.formState.errors.email) {
      setEmailMessage(formController.formState.errors.email);
      return;
    }

    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      setWaiting(true);
      const onSignupResponse = await registerUser(payload);
      if (onSignupResponse.success) {
        formController.reset(); // reset form
        setUsernameMessage(""); // reset username message
        setEmailMessage(""); // reset email message
        setCookie("token", onSignupResponse?.token); // set token in cookie
        setUser(onSignupResponse?.user); // set user in context
        setAuthenticated(true); // set authenticated in context
        toast.success(onSignupResponse?.message, { autoClose: 1000 }); // show success message
      } else {
        toast.error(onSignupResponse?.message);
      }
    } catch (error) {
      toast.error("Unable to send signup request");
    } finally {
      setWaiting(false);
    }
  };

  return (
    <Form {...formController}>
      {waiting && <LoaderFullPage />}
      <form
        onSubmit={formController.handleSubmit(onSubmit)}
        className="text-left flex flex-col gap-2 items-center"
      >
        <div className="w-full flex flex-col gap-3 sm:grid sm:grid-cols-2">
          <FormField
            control={formController.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    formController.formState.errors.username
                      ? "text-red-600"
                      : ""
                  }
                >
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setInputUsername(e.target.value);
                      if (e.target.value) {
                        setUsernameMessage("");
                      }
                    }}
                  />
                </FormControl>
                {isCheckingUsername && (
                  <Loader2 className="w-4 aspect-square animate-spin" />
                )}
                {!isCheckingUsername && usernameMessage ? (
                  <p
                    className={`text-[0.8rem] font-[500] ${
                      usernameMessage.includes("available")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                ) : (
                  <FormMessage className="text-red-600" />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={formController.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    formController.formState.errors.email ? "text-red-600" : ""
                  }
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setInputEmail(e.target.value);
                      if (e.target.value) {
                        setEmailMessage("");
                      }
                    }}
                  />
                </FormControl>
                {isCheckingEmail && (
                  <Loader2 className="w-4 aspect-square animate-spin" />
                )}
                {!isCheckingEmail && emailMessage ? (
                  <p
                    className={`text-[0.8rem] font-[500] ${
                      emailMessage.includes("available")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {emailMessage}
                  </p>
                ) : (
                  <FormMessage className="text-red-600" />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={formController.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    formController.formState.errors.password
                      ? "text-red-600"
                      : ""
                  }
                >
                  Password
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={formController.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    formController.formState.errors.confirmPassword
                      ? "text-red-600"
                      : ""
                  }
                >
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-4 w-1/2 sm:w-[150px] hover:bg-zinc-800 hover:text-white"
        >
          Signup!
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
