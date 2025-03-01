import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Logo from '../assets/images/logo-devlinks-large.svg';

const signupSchema = z
  .object({
    email: z.string().min(1, "Can't be empty").email("Please enter a valid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please check again"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignup: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      await axios.post(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          email: data.email,
          password: data.password,
          connection: "Username-Password-Authentication",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      navigate("/login");
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError("This email address is already used");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="mb-16">
        <img src={Logo} alt="Devlinks Logo" width={146} height={40} className="w-36" />
      </div>

      <div className="w-full max-w-[476px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#333333]">Create account</h1>
          <p className="text-[#737373]">Let's get you started sharing your links!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-6">
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
                    Create password
                  </FormLabel>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${form.formState.errors.password ? "text-[#FF3939]" : "text-[#737373]"}`}
                    />
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="At least 8 characters"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`block text-sm ${form.formState.errors.confirmPassword ? "text-[#FF3939]" : "text-[#333333]"}`}
                  >
                    Confirm password
                  </FormLabel>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${form.formState.errors.confirmPassword ? "text-[#FF3939]" : "text-[#737373]"}`}
                    />
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="At least 8 characters"
                          className={`h-12 pl-10 pr-32 ${form.formState.errors.confirmPassword ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.confirmPassword && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                          {form.formState.errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#737373]">Password must contain at least 8 characters</p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#633CFF] hover:bg-[#BEADFF] text-white font-medium"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating account..." : "Create new account"}
            </Button>
          </form>
        </Form>

        {error && (
          <div className="text-[#FF3939] text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-center text-[#737373]">
          Already have an account?{" "}
          <a href="/login" className="text-[#633CFF] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;