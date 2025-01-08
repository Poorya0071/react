import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { customers } from '@/db/schema'
import {z} from 'zod'

export const insertCustomerSchema = createInsertSchema(customers,{
    firstName: (schema) => schema.min(1, "First name is required"),
    lastName: (schema) => schema.min(1, "Last name is required"),
    address1: (schema) => schema.min(1, "Address is required"),
    city: (schema) => schema.min(1, "City is required"),
    state: (schema) => schema.length(2, "state must be 2 characters"),
    zip: (schema) => schema.regex(/^\d{5}(-\d{4})?$/, "Zip must be 5 digits"),
    country: (schema) => schema.min(1, "Country is required"),
    email: (schema) => schema.email("Valid Email address is required"),
    phone: (schema) => schema.regex(/^\d{3}-\d{3}-\d{4}$/, "Phone number must be in the format XXX-XXX-XXXX"),
})

export const selectCustomerSchema = createSelectSchema(customers)

export type insertCustomerSchemaType = typeof insertCustomerSchema._type

export type selectCustomerSchemaType = typeof selectCustomerSchema._type
