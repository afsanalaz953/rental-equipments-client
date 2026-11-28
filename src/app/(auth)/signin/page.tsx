"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

// import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";

type SignInFormData = {
  email: string;
  password: string;
 
};

const SigninPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
//   const [isForgotDialogOpen, setIsForgotDialogOpen] = useState<boolean>(false);
//   const [resetEmail, setResetEmail] = useState<string>("");
//   const [resetMessage, setResetMessage] = useState<string>("");

  const handleGoogleSignin = async (): Promise<void> => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    console.log(data, "data");
  };

  const handleLoginFunc: SubmitHandler<SignInFormData> = async (data) => {
    const { email, password } = data;
    console.log(data, "data");

    const { data: res, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "/",
      // redirect: false,
    });

    console.log(data, "data");
    console.log(res, error);

    if (error) {
      alert(error.message);
      return;
    }

    // if (res?.user?.isBlocked === true) {
    //   await authClient.signOut();
    //   setTimeout(() => {
    //     alert("Your account is blocked. Please contact support.");
    //     router.push("/login");
    //   }, 100);
    //   return;
    // }

    if (res) {
      router.push("/signin");
      alert("Signin Successful");
    }
  };

//   const handleSendResetLink = async (): Promise<void> => {
//     if (!resetEmail) {
//       setResetMessage("Email Address");
//       return;
//     }
    // try {
    //   const { data, error } = await authClient.forgetPassword({
    //     email: resetEmail,
    //     redirectTo: window.location.origin + "/reset-password",
    //   });
    //   if (error) {
    //     setResetMessage(error.message);
    //   } else {
    //     setResetMessage("Password reset link has been sent to your email");
    //     setTimeout(() => {
    //       setIsForgotDialogOpen(false);
    //       setResetMessage("");
    //       setResetEmail("");
    //     }, 3000);
    //   }
    // } catch (err) {
    //   setResetMessage("Try Again");
    // }
//   };

  return (
    <div className=" container mx-auto">
      <div className="bg-slate-200 rounded-xl w-150 container mx-auto p-20 my-4 flex gap-2 flex-col justify-center items-center">
        <h2 className="font-bold text-2xl">Sign In</h2>
        <p className="">Please signin to continue</p>

        <form
          onSubmit={handleSubmit(handleLoginFunc)}
          className="space-y-2  border-2 w-full"
        >
          <fieldset className="fiedset">
            <legend className="fieldset-legend font-bold">Email</legend>
            <input
              type="text"
              className="input border-2 w-full placeholder:text-gray-400"
              placeholder="Enter Your Email"
              {...register("email", { required: "email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </fieldset>

          <fieldset className="fieldset relative">
            <legend className="fieldset-legend font-black">Password</legend>
            <input
              type={isShowPassword ? "text" : "password"}
              className="input border-2 placeholder:text-gray-400"
              placeholder="Enter your Password"
              {...register("password", { required: "password is required" })}
            />
            <span
              className="absolute right-2 top-4 cursor-pointer"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              <FaRegEyeSlash />
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </fieldset>

          {/* <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsForgotDialogOpen(true)}
            >
              Forgot Password?
            </button>
          </div> */}

          <br />
          <Button type="submit" className="w-full bg-[#FFC000]">
            Sign In
          </Button>

          <div className="divider mt-2 text-sm text-gray-400">
            OR, Continue With
          </div>

          <fieldset className="fiedset">
            <input
              type="text"
              className="input font-bold w-full placeholder:text-gray-400 text-center text-lg cursor-pointer"
              placeholder="Google"
              onClick={handleGoogleSignin}
              readOnly
            />
          </fieldset>

          <p className="text-sm mt-4">Dont have an account?</p>
          <span className=" text-blue-600 font-bold">
            <Link href="/signup">Sign Up</Link>
          </span>
        </form>
      </div>

      {/* <ForgotPasswordModal
        isOpen={isForgotDialogOpen}
        onClose={() => setIsForgotDialogOpen(false)}
      /> */}
    </div>
  );
};

export default SigninPage;