"use client";
import { useState } from "react";
import Logo from "@/components/custom/Logo";
import LoginForm from "@/components/custom/LoginForm";
import SignupForm from "@/components/custom/SignupForm";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    value: "login",
    label: "Login",
    description: "Login with your Username or Email",
    content: <LoginForm />,
    footer: {
      text: "First time?",
      link: "Signup!",
    },
  },
  {
    value: "signup",
    label: "Signup",
    description: "Enter your credentials to signup",
    content: <SignupForm />,
    footer: {
      text: "Already registered?",
      link: "Login!",
    },
  },
];

const Register = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const [activeTab, setActiveTab] = useState("login");
  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col gap-5 items-center">
      <div className="mt-10 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-36 flex items-center justify-center gap-1">
        <p className="text-[22px] sm:text-4xl text-right text-nowrap">
          Welcome to
        </p>
        <Logo size={isMobile ? "md" : "lg"} style="inline" />
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="p-4 w-full sm:w-[600px] flex flex-col items-center"
      >
        <TabsList
          className={`grid grid-cols-2 ${
            isSmallScreen ? "w-full" : "w-[400px]"
          }`}
        >
          {tabs.map((tab, key) => (
            <TabsTrigger key={key} value={tab?.value}>
              {tab?.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, key) => (
          <TabsContent key={key} value={tab?.value} className="w-full">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tab?.label}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span>{tab?.description}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">{tab?.content}</CardContent>
              <CardFooter className="flex items-center justify-center">
                <div className="flex gap-1 text-[14px]">
                  <div>{tab?.footer?.text}</div>
                  <div
                    className="text-[#27a6ff] cursor-pointer hover:underline"
                    onClick={() =>
                      setActiveTab(tab?.value === "login" ? "signup" : "login")
                    }
                  >
                    {tab?.footer?.link}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default Register;