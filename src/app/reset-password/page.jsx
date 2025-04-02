"use client";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/custom/branding/Logo";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoaderFullPage from "@/components/custom/LoaderFullPage";
import { resetPasswordViaLink, sendResetPasswordEmail } from "@/lib/features";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import useMediaQuery from "@/hooks/useMediaQuery";

const sendFormSchema = z.object({
  email: z.string().email(),
});

const resetFormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password should be greater than 5 characters" })
      .max(20, { message: "Password should be less than 21 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("uat");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [waiting, setWaiting] = useState(false);

  const sendFormController = useForm({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const resetFormController = useForm({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmitSend = async (data) => {
    try {
      setWaiting(true);
      const response = await sendResetPasswordEmail(data?.email);
      if (response?.success) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Unable to send reset password link");
    } finally {
      setWaiting(false);
      sendFormController.reset();
    }
  };

  const onSubmitReset = async (data) => {
    try {
      setWaiting(true);
      const response = await resetPasswordViaLink(token, data?.password);
      if (response?.success) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Unable to reset password");
    } finally {
      setWaiting(false);
      resetFormController.reset();
    }
  };

  return (
    <>
      <div className="min-h-screen min-w-full">
        <div className="w-full flex flex-col items-center gap-10 p-16">
          {/* header */}
          <div className="flex flex-col gap-4 text-xl">
            <div className="">Reset password for your</div>
            <div className="flex items-center gap-2">
              <Logo size="md" style="inline" />
              <div className="">account</div>
            </div>
          </div>
          {/* form */}
          {token ? (
            <Form {...resetFormController}>
              {waiting && <LoaderFullPage />}
              <form
                onSubmit={resetFormController.handleSubmit(onSubmitReset)}
                className="text-left flex flex-col gap-2 items-center justify-center"
              >
                <div className="flex flex-col gap-3 justify-center">
                  <FormField
                    control={resetFormController.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={
                            resetFormController.formState.errors.password
                              ? "text-red-600"
                              : ""
                          }
                        >
                          Enter your new password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetFormController.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={
                            resetFormController.formState.errors.confirmPassword
                              ? "text-red-600"
                              : ""
                          }
                        >
                          Retype your new password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm password"
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
                  Reset password
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...sendFormController}>
              {waiting && <LoaderFullPage />}
              <form
                onSubmit={sendFormController.handleSubmit(onSubmitSend)}
                className="text-left flex flex-col gap-2 items-center justify-center"
              >
                <div className="flex flex-col gap-3 justify-center">
                  <FormField
                    control={sendFormController.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={
                            sendFormController.formState.errors.email
                              ? "text-red-600"
                              : ""
                          }
                        >
                          Enter your registered email
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Email" {...field} />
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
                  Send reset link
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
      <ToastContainer
        position={isMobile ? "top-left" : "bottom-center"}
        autoClose={2500}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        draggable
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme="dark"
      />
    </>
  );
};

export default ResetPassword;
