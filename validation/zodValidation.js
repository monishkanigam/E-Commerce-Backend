import * as z from "zod";
// register schema zod ka
export const userRegister = z.object({
    firstName: z
        .string("not a string")
        .min(4, "min 4 char")
        .max(20, "max 20 char"),

    lastName: z
        .string("not a string")
        .min(4, "min 4 char")
        .max(20, "max 20 char"),

    email: z.string("not a valid email"),

    password: z
        .string()
        .min(6, "min 6 char")
        .max(20, "max 20 char"),

});

// login schema zod ka

export const userLogin = z.object({
    email: z.string({ required_error: "invalid email" }),
    password: z.string({ required_error: "invalid password" }),
});
