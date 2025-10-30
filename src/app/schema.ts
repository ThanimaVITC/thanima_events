import { z } from "zod";
import { DEPARTMENTS, TSHIRT_DESIGN_VALUES, TSHIRT_SIZES } from "@/lib/constants";

export const merchOrderSchema = z.object({
  isMember: z.boolean(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  regNo: z
    .string()
    .regex(
      /^[1-9][0-9][A-Z]{3}[0-9]{4}$/,
      "Invalid registration number format (e.g., 24BYB1234)."
    ),
  email: z.string().email("Invalid email address."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      "Invalid phone number format."
    ),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: "Please select your department." }),
  }),
  tshirtDesign: z.enum(TSHIRT_DESIGN_VALUES as any, {
    errorMap: () => ({ message: "Please select a t-shirt design." }),
  }),
  size: z.enum(TSHIRT_SIZES, {
    errorMap: () => ({ message: "Please select a size." }),
  }),
});

export type MerchOrderData = z.infer<typeof merchOrderSchema>;

// Extended type for MongoDB documents (includes _id and other DB fields)
export type MerchOrderDocument = MerchOrderData & {
  _id: string;
  submittedAt: Date;
  paymentStatus: string;
};
