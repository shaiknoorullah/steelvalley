// "use client";
// import React, { useState } from "react";
// import { Label } from "./Label";
// import { Input } from "./Input";
// import { cn } from "@/lib/utils";
// import {
//   IconBrandGithub,
//   IconBrandGoogle,
//   IconBrandOnlyfans,
// } from "@tabler/icons-react";
// import axios from "axios";

// interface FormData {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   message: string;
// }

// export function SignupForm() {
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     message: "",
//   });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/submitform", formData);
//       console.log("Form submitted successfully", response.data);
//     } catch (error) {
//       console.error("Error submitting form", error);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   return (
//     <div
//       className="max-w-[480px] w-full rounded-md p-3 md:p-6 lg:p-8 shadow-input border-[1px] border-gray-900"
//       style={{
//         background:
//           "linear-gradient(157.27deg, rgba(65, 65, 65, 0.3) -39.05%, rgba(36, 36, 36, 0) 135.1%)",
//         border: "1px",
//         borderColor:
//           "radial-gradient(174.8% 174.8% at 135.3% 155.27%, rgba(0, 0, 0, 0.6) 0%, rgba(83, 83, 83, 0.6) 100%)",
//       }}
//     >
//       <form
//         className="py-5 px-5 flex flex-col gap-1 z-50"
//         onSubmit={handleSubmit}
//       >
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//           <LabelInputContainer>
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               placeholder="Shaik Noorullah"
//               id="fullName"
//               type="text"
//               onChange={handleChange}
//             />
//           </LabelInputContainer>
//         </div>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="email">Email Address</Label>
//           <Input
//             placeholder="noorullah@websleak.com"
//             id="email"
//             type="email"
//             onChange={handleChange}
//           />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="phoneNumber">Phone Number</Label>
//           <Input
//             placeholder="+91 7674079300"
//             id="phoneNumber"
//             type="number"
//             onChange={handleChange}
//           />
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="message">Message</Label>
//           <textarea
//             placeholder=""
//             id="message"
//             className={cn(
//               `flex z-50 min-h-24 w-full border-[1px] border-x-[#ECECEC29] border-y-[#ECECEC26] bg-gray-50 dark:bg-zinc-800 text-white dark:text-white shadow-input px-3 py-2 text-sm file:border-0
//               file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
//               focus-visible:outline-none focus-visible:ring-[2px] focus:rounded-none focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-600
//               disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
//               group-hover/input:shadow-none transition duration-400 placeholder:italic placeholder:text-[11px]
//               focus:border-gray-800 input-with-gradient-border rounded-none`
//             )}
//             onChange={handleChange}
//           />
//         </LabelInputContainer>
//         <button
//           className="text-[max(0.6rem,min(0.7vw,14px))] font-medium text-[#DFDFDF] input-with-gradient-border"
//           type="submit"
//         >
//           Send Message
//           <BottomGradient />
//         </button>
//       </form>
//     </div>
//   );
// }

// export const BottomGradient: React.FC = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   );
// };

// interface LabelInputContainerProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
//   children,
//   className,
// }) => {
//   return (
//     <div className={cn("flex flex-col space-y-2 w-full", className)}>
//       {children}
//     </div>
//   );
// };

// 2
// Import necessary dependencies

// import React from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { cn } from "@/lib/utils";
// import { Label } from "./Label";
// import { Input } from "./Input";

// interface FormData {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   message: string;
// }

// export function SignupForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = async (formData: FormData) => {
//     try {
//       const response = await axios.post("/api/submitform", formData);
//       console.log("Form submitted successfully", response.data);
//     } catch (error) {
//       console.error("Error submitting form", error);
//     }
//   };

//   return (
//     <div
//       className="max-w-[480px] w-full rounded-md p-3 md:p-6 lg:p-8 shadow-input border-[1px] border-gray-900"
//       style={{
//         background:
//           "linear-gradient(157.27deg, rgba(65, 65, 65, 0.3) -39.05%, rgba(36, 36, 36, 0) 135.1%)",
//         border: "1px",
//         borderColor:
//           "radial-gradient(174.8% 174.8% at 135.3% 155.27%, rgba(0, 0, 0, 0.6) 0%, rgba(83, 83, 83, 0.6) 100%)",
//       }}
//     >
//       <form
//         className="py-5 px-5 flex flex-col gap-1 z-50"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//           <LabelInputContainer>
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               placeholder="Shaik Noorullah"
//               id="fullName"
//               type="text"
//               {...register("fullName", {
//                 required: "Full Name is required",
//               })}
//             />
//             {errors.fullName && (
//               <span className="text-red-500 text-sm">
//                 {errors.fullName.message}
//               </span>
//             )}
//           </LabelInputContainer>
//         </div>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="email">Email Address</Label>
//           <Input
//             placeholder="noorullah@websleak.com"
//             id="email"
//             type="email"
//             {...register("email", {
//               required: "Email is required",
//               pattern: {
//                 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                 message: "Invalid email address",
//               },
//             })}
//           />
//           {errors.email && (
//             <span className="text-red-500 text-sm">{errors.email.message}</span>
//           )}
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="phoneNumber">Phone Number</Label>
//           <Input
//             placeholder="+91 7674079300"
//             id="phoneNumber"
//             type="text"
//             {...register("phoneNumber", {
//               required: "Phone Number is required",
//             })}
//           />
//           {errors.phoneNumber && (
//             <span className="text-red-500 text-sm">
//               {errors.phoneNumber.message}
//             </span>
//           )}
//         </LabelInputContainer>
//         <LabelInputContainer className="mb-4">
//           <Label htmlFor="message">Message</Label>
//           <textarea
//             placeholder=""
//             id="message"
//             className={cn(
//               `flex z-50 min-h-24 w-full border-[1px] border-x-[#ECECEC29] border-y-[#ECECEC26] bg-gray-50 dark:bg-zinc-800 text-white dark:text-white shadow-input px-3 py-2 text-sm file:border-0
//               file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
//               focus-visible:outline-none focus-visible:ring-[2px] focus:rounded-none focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-600
//               disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
//               group-hover/input:shadow-none transition duration-400 placeholder:italic placeholder:text-[11px]
//               focus:border-gray-800 input-with-gradient-border rounded-none`
//             )}
//             {...register("message", {
//               required: "Message is required",
//             })}
//           />
//           {errors.message && (
//             <span className="text-red-500 text-sm">
//               {errors.message.message}
//             </span>
//           )}
//         </LabelInputContainer>
//         <button
//           className="text-[max(0.6rem,min(0.7vw,14px))] font-medium text-[#DFDFDF] input-with-gradient-border"
//           type="submit"
//         >
//           Send Message
//           <BottomGradient />
//         </button>
//       </form>
//     </div>
//   );
// }

// export const BottomGradient: React.FC = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   );
// };

// interface LabelInputContainerProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
//   children,
//   className,
// }) => {
//   return (
//     <div className={cn("flex flex-col space-y-2 w-full", className)}>
//       {children}
//     </div>
//   );
// };

// export default SignupForm;

// 333 tost
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Label } from "./Label";
import { Input } from "./Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await axios.post("/api/submitform", formData);
      console.log("Form submitted successfully", response.data);
      toast.success("Form submitted successfully");
      reset(); // Reset the form
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error submitting form");
    }
  };

  return (
    <div
      className="max-w-[480px] w-full rounded-md p-3 md:p-6 lg:p-8 shadow-input border-[1px] border-gray-900"
      style={{
        background:
          "linear-gradient(157.27deg, rgba(65, 65, 65, 0.3) -39.05%, rgba(36, 36, 36, 0) 135.1%)",
        border: "1px",
        borderColor:
          "radial-gradient(174.8% 174.8% at 135.3% 155.27%, rgba(0, 0, 0, 0.6) 0%, rgba(83, 83, 83, 0.6) 100%)",
      }}
    >
      <form
        className="py-5 px-5 flex flex-col gap-1 z-50"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              placeholder="Shaik Noorullah"
              id="fullName"
              type="text"
              {...register("fullName", {
                required: "Full Name is required",
              })}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            placeholder="noorullah@websleak.com"
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            placeholder="+91 7674079300"
            id="phoneNumber"
            type="text"
            {...register("phoneNumber", {
              required: "Phone Number is required",
            })}
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">Message</Label>
          <textarea
            placeholder=""
            id="message"
            className={cn(
              `flex z-50 min-h-24 w-full border-[1px] border-x-[#ECECEC29] border-y-[#ECECEC26] bg-gray-50 dark:bg-zinc-800 text-white dark:text-white shadow-input px-3 py-2 text-sm file:border-0 
              file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
              focus-visible:outline-none focus-visible:ring-[2px] focus:rounded-none focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-600
              disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
              group-hover/input:shadow-none transition duration-400 placeholder:italic placeholder:text-[11px]
              focus:border-gray-800 input-with-gradient-border rounded-none`
            )}
            {...register("message", {
              required: "Message is required",
            })}
          />
          {errors.message && (
            <span className="text-red-500 text-sm">
              {errors.message.message}
            </span>
          )}
        </LabelInputContainer>
        <button
          className="text-[max(0.6rem,min(0.7vw,14px))] font-medium text-[#DFDFDF] input-with-gradient-border"
          type="submit"
        >
          Send Message
          <BottomGradient />
        </button>
      </form>
      <ToastContainer
        className="bg-black"
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
}

export const BottomGradient: React.FC = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default SignupForm;
