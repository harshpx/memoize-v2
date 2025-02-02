"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import loginSchema from "@/validationSchemas/loginSchema";
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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const formController = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    const payload = {
      identifier: data.identifier,
      password: data.password,
    };
    const res = await signIn("credentials", {
      ...payload,
      redirect: false,
    });

    if (res.error) {
      toast.error("Login failed, Invalid credentials");
    } else {
      toast.success("Login successful",{autoClose: 1000});
    }
  };

  return (
    <Form {...formController}>
      <form
        onSubmit={formController.handleSubmit(onSubmit)}
        className="text-left flex flex-col gap-2 items-center"
      >
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
          <FormField
            control={formController.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    formController.formState.errors.identifier
                      ? "text-red-600"
                      : ""
                  }
                >
                  Username or Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username or Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
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
        </div>
        <Button
          type="submit"
          className="mt-4 w-1/2 sm:w-[150px] hover:bg-zinc-800 hover:text-white"
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
