"use client";
import { FormProvider, useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FormHTMLAttributes, ReactNode } from "react";

interface FormProps<TSchema extends z.ZodTypeAny>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit: (values: z.infer<TSchema>) => void | Promise<void>;
  children: ReactNode;
}

export function Form<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
  ...formProps
}: FormProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <FormProvider {...methods}>
      <form
        data-component="form"
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        {...formProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}
