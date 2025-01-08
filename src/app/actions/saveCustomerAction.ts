"use server"

import {eq, sql} from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"
import { redirect } from "next/navigation"

import{ db } from "@/db"
import { customers } from "@/db/schema"
import { actionClient } from '@/lib/safe-action';
import { insertCustomerSchema, type insertCustomerSchemaType } from "@/zod-schema/customer"


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const saveCustomerAction = actionClient
    .metadata({actionName: "saveCustomerAction"})
    .schema(insertCustomerSchema,{
        handleValidationErrorsShape:async (ve)=>flattenValidationErrors(ve).fieldErrors,
    })
    .action(async({
        parsedInput:customer
    }: {
        parsedInput: insertCustomerSchemaType})=>{

            // redirect("/customers")

            const {isAuthenticated} =  getKindeServerSession()
            const isAuth= await isAuthenticated()
            if(!isAuth) redirect("/login")
            // throw Error("test error")
            // const data = await fetch('https://jsonplaceholder')
            // const query =sql.raw("Select * from HajPouria")
            // const data = await db.execute(query)


            
            if (customer.id === 0) {
                const result = await db.insert(customers).values({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    email: customer.email,
                    address1: customer.address1,
                    country: customer.country,
                    city: customer.city,
                    state: customer.state,
                    zip: customer.zip,
                    ...(customer.country?.trim() ? {country: customer.country} : {}),
                    phone: customer.phone,
                    active: customer.active
                }).returning({insertedId: customers.id})
                return {message: `Customer ID ${result[0].insertedId} created successfully`}
        }
        //existing customer
        const result = await db.update(customers).set({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            address1: customer.address1,
            address2: customer.address2?.trim() ?? null,
            country: customer.country,
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            phone: customer.phone,
            active: customer.active
        }).where(eq(customers.id, customer.id!)).returning({updatedId: customers.id})
        return {message: `Customer ID ${result[0].updatedId} updated successfully`}
    })