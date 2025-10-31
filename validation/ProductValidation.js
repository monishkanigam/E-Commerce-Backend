import * as z from "zod";

// product schema zod
export const productSchema=z.object({
   name:z.string().min(3),

   price: z.string().transform(val => parseFloat(val)),

   category:z.string().min(2),

   description:z.string().min(5),

   image_url:z.string().url().optional(),
})