import * as z from "zod";

export const UserRegisterValidation = z.object({
    firstName: z
        .string("not a string")
        .min(4, "username min 2 length")
        .max(12, " username max 12 length"),
    lastName: z
        .string("not a string")
        .min(4, "username min 2 length")
        .max(12, " username max 12 length"),
    email: z.string("not a valid email"),
    password: z
        .string()
        .min(6, "password min 6 length")
        .max(12, "password max 12 length"),
});

export const UserLoginValidation = z.object({
    email: z
    .string({required_error:"invalid email"}),
    password: z
    .string({required_error:"invalid password"}),
    
});
