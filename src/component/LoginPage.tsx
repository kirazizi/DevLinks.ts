import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import Logo from '../assets/images/logo-devlinks-large.svg';

const loginSchema = z.object({
  email: z.string().min(1, "Can't be empty").email("Please enter a valid email"),
  password: z.string().min(1, "Please check again"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
        {
          username: data.email,
          password: data.password,
          grant_type: "password",
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      onLoginSuccess(response.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const onLoginSuccess = (data: { access_token: string }) => {
    login(data.access_token);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="mb-16">
        <img src={Logo} alt="Devlinks Logo" width={146} height={40} className="w-36" />
      </div>

      <div className="w-full max-w-[476px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#333333]">Login</h1>
          <p className="text-[#737373]">Add your details below to get back into the app</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`block text-sm ${form.formState.errors.email ? "text-[#FF3939]" : "text-[#333333]"}`}
                  >
                    Email address
                  </FormLabel>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${form.formState.errors.email ? "text-[#FF3939]" : "text-[#737373]"}`}
                    />
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="e.g. alex@email.com"
                          className={`h-12 pl-10 pr-24 ${form.formState.errors.email ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`block text-sm ${form.formState.errors.password ? "text-[#FF3939]" : "text-[#333333]"}`}
                  >
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${form.formState.errors.password ? "text-[#FF3939]" : "text-[#737373]"}`}
                    />
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className={`h-12 pl-10 pr-32 ${form.formState.errors.password ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.password && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                          {form.formState.errors.password.message}
                        </span>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 bg-[#633CFF] hover:bg-[#BEADFF] text-white font-medium">
              Login
            </Button>
          </form>
        </Form>

        {error && (
          <div className="text-[#FF3939] text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-center text-[#737373]">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#633CFF] hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;