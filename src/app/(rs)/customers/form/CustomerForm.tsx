"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from "@/zod-schema/customer"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel"
import { StatesArray } from "@/constants/StatesArray"
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel"
import{useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs"
import {CheckboxWithLabel} from "@/components/inputs/CheckboxWithLabel"
import {useAction} from "next-safe-action/hooks"
import { saveCustomerAction } from "@/app/actions/saveCustomerAction"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
type Props = {
    customer?: selectCustomerSchemaType,
    isManager?: boolean | undefined
} 

export default function CustomerForm({ customer, isManager=false }: Props) {
    const {toast} = useToast()
    const searchParams = useSearchParams()
    const hasCustomerId = searchParams.has("customerId")

    const emptyValues: insertCustomerSchemaType = {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
        active: true
    }
    // const permObj = getPermissions()
    // const isAuthorized = !isLoading && permObj.permissions.some(perm => perm === "manager" || perm === "admin")

    const defaultValues: insertCustomerSchemaType = hasCustomerId ? {
        id: customer?.id || 0,
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        email: customer?.email || "",
        address1: customer?.address1 || "",
        address2: customer?.address2 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        zip: customer?.zip || "",
        country: customer?.country || "",
        phone: customer?.phone || "",
        active: customer?.active || true,
        
    } : emptyValues

    const form = useForm<insertCustomerSchemaType>({
        mode: "onBlur",
        resolver: zodResolver(insertCustomerSchema),
        defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues? defaultValues : emptyValues)
    }, [searchParams.get("customerId")])

    const {
        execute: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveCustomerAction,{
        onSuccess: ({data}) => {
            if(data?.message) {
                toast({
                    variant: "default",
                    title: "Success!",
                    description: data?.message
                })
            }
    },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Error!",
                description: 'Save failed'
            })

        }
    })

    async function submitForm(data: insertCustomerSchemaType) {
        // console.log(data)
        executeSave({...data, firstName:'',phone:''})
    }

    return (
        <div className="flex flex-col gap-1 sm:px8">
            <DisplayServerActionResponse result={saveResult}/>
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : "Form"}

                </h2>
            </div>
<Form {...form}>
    <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertCustomerSchemaType> fieldTitle="First Name" nameInSchema="firstName" />
            <InputWithLabel<insertCustomerSchemaType> fieldTitle="Last Name" nameInSchema="lastName" />
            <InputWithLabel<insertCustomerSchemaType> fieldTitle="Address 1" nameInSchema="address1" />
            <InputWithLabel<insertCustomerSchemaType> fieldTitle="Address 2" nameInSchema="address2" />
            <InputWithLabel<insertCustomerSchemaType> fieldTitle="City" nameInSchema="city" />
            <SelectWithLabel<insertCustomerSchemaType> fieldTitle="State" nameInSchema="state" data={StatesArray}/>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
        <InputWithLabel<insertCustomerSchemaType> fieldTitle="Zip Code" nameInSchema="zip" />
        <InputWithLabel<insertCustomerSchemaType> fieldTitle="Email" nameInSchema="email" />
        <InputWithLabel<insertCustomerSchemaType> fieldTitle="Country" nameInSchema="country" />
        <InputWithLabel<insertCustomerSchemaType> fieldTitle="Phone" nameInSchema="phone" />
        <TextAreaWithLabel<insertCustomerSchemaType> fieldTitle="Country" nameInSchema="country" className="h-40"/>
            {isManager && customer?.id ? (
        <CheckboxWithLabel<insertCustomerSchemaType> fieldTitle="Active" nameInSchema="active" message="Yes"/>
    ) : null}
            <div className="flex gap-2">
                <Button type="submit" className="w-3/4" variant="default" title="save" disabled={isSaving}>{isSaving ?(
                <>
                <LoaderCircle className="animate-spin" /> Saving
                </>
                ):"Save"}</Button>
                <Button type="button" variant="destructive" title="Reset" onClick={() => {form.reset(defaultValues)
                    resetSaveAction()
                }}>Reset</Button>

            </div>

        </div>

        </form>
        </Form>
            </div>
    )
}


