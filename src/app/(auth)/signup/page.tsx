"use client";

import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

// Only these two roles exist in the select
type UserRole = "customer" | "owner";

type SignUpFormData = {
  name: string;
  email: string;
  image: string;
  password: string;
  role: UserRole;
};

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const router = useRouter();

  const handleGoogleSignin = async (): Promise<void> => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    console.log(data, "data");
  };

  const handleRegisterFunc: SubmitHandler<SignUpFormData> = async (data) => {
    console.log(data, "Formdata");

    const { name, email, password, image, role } = data;

    const { data: res, error } = await authClient.signUp.email({
      name,
      email,
      image,
      password,
      // role is a custom field; cast if better-auth's User type doesn't include it
      role: role as string,
      // autoSignIn: false,
      callbackURL: "/signin",
    });

    console.log("data:res", res, "Error", error);

    if (error) {
      alert(error.message);
      return;
    }

    if (res) {
      // await authClient.signOut();
      alert("Signup Successful");
      router.push("/signin");
    }
  };

  return (
    <div className="container mx-auto my-10">
      <div className="bg-slate-200  rounded-xl w-150 container mx-auto p-15 my-6 flex gap-4 flex-col justify-center items-center">
        <h2 className="font-bold text-2xl">Create Account</h2>

        <div className="container mx-auto w-full rounded">
          <form
            onSubmit={handleSubmit(handleRegisterFunc)}
            className="mx-10 mt-4 space-y-2 w-full rounded"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <input
                type="text"
                className="input border-2"
                placeholder="Enter Your Name"
                {...register("name", { required: "name is required" })}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input placeholder:text-gray-400  "
                placeholder="Enter Your Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Photo URL</legend>
              <input
                type="text"
                className="input placeholder:text-gray-400  "
                placeholder="Photo url"
                {...register("image", {
                  required: "Photo url is required",
                })}
              />
              {errors.image && (
                <p className="text-red-500">{errors.image.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input placeholder:text-gray-400   "
                placeholder="Enter your Password"
                {...register("password", {
                  required: "password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain at least one uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain at least one lowercase letter",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 font-bold">
                  {errors.password.message}
                </p>
              )}
              <p className="text-shadow-base-100">
                Must contain uppercase, lowercase, and at least 6 characters
              </p>
            </fieldset>

            <fieldset className="fieldset">
              <label className="font-medium">Role Selection</label>
              <select
                {...register("role", { required: "role is required" })}
                className="rounded-2xl border-2 font-bold mr-20 p-2 bg-white w-full"
              >
                <option value="customer">customer</option>
                <option value="owner">owner</option>
              </select>
              {errors.role && (
                <p className="text-red-500">{errors.role.message}</p>
              )}
            </fieldset>
            {/* social div */}
            <div className="flex flex-col justify-center items-center gap-2">
                  <Button type="submit" className="w-80 mt-2 font-bold bg-[#FFC000]">
              Sign up
            </Button>

            <div className="divider mr-8 text-sm text-gray-400">OR</div>

            <fieldset className="fiedset w-full">
              <input
                type="text"
                className="input font-bold  placeholder:text-gray-400 w-full text-center text-lg cursor-pointer"
                placeholder="Continue with Google"
                onClick={handleGoogleSignin}
                readOnly
              />
            </fieldset>

            </div>

            {/* <Button type="submit" className="w-80 mt-2 font-bold bg-[#FFC000]">
              Sign In
            </Button>

            <div className="divider mr-8 text-sm text-gray-400">OR</div>

            <fieldset className="fiedset">
              <input
                type="text"
                className="input font-bold placeholder:text-gray-400  text-center text-lg cursor-pointer"
                placeholder="Continue with Google"
                onClick={handleGoogleSignin}
                readOnly
              />
            </fieldset> */}

            <p className="text-sm">Already have an account</p>
            <span className="text-sm font-bold text-blue-700">
              <Link href="/signin"> sign in </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;