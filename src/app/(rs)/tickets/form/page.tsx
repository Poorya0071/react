import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {Users, init as KindeInit} from "@kinde/management-api-js";

export async function generateMetadata({
    searchParams,
}:{
    searchParams: Promise<{[key: string]: string|undefined}>;
}){
    const {customerId, ticketId} = await searchParams; 
    if(!customerId && !ticketId) 
        return {
            title: "Missing Ticket ID or Customer ID"
        }
        if(customerId) return{
            title: `New Ticket for Customer #${customerId}`
    }   
    if(ticketId) return{
        title: `Edit Ticket #${ticketId}`
    }
        
}

export default async function TicketFormPage({
    searchParams,
}:{
    searchParams: Promise<{[key: string]: string|undefined}>;
}){
    try {
        const {customerId, ticketId} = await searchParams;
            if(!customerId && !ticketId) {
                return(
                    <>
                    <h2 className="text-2xl mb-2">Ticket ID or Customer ID is required to load a ticket form</h2>
                    <BackButton title="Go Back" />
                    </>
                )
            }
            const {getPermission, getUser} = getKindeServerSession()
            const [managerPermission, user] = await Promise.all([
                getPermission("manager"),
                getUser()
            ])

            const isManager = managerPermission?.isGranted

            if (customerId) {
                const customer = await getCustomer(parseInt(customerId))
                if(!customer) {
                    return(
                        <>
                        <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
                        <BackButton title="Go Back" />
                        </>
                    )
                }
                if(!customer.active) {
                    return(
                        <>
                        <h2 className="text-2xl mb-2">Customer ID #{customerId} is inactive</h2>
                        <BackButton title="Go Back" />
                        </>
                    )
            }

            if(isManager) {
                KindeInit()
                const {users} = await Users.getUsers()
                const techs = users ? users.map(user => ({id: user.email!, description: user.email!})) : []
                return <TicketForm customer={customer} techs={techs} isManager={isManager} />

            }else{
                return <TicketForm customer={customer} />
            }

        }

        if (ticketId) {
            const ticket = await getTicket(parseInt(ticketId))
            if(!ticket) {
                return(
                    <>
                    <h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found</h2>
                    <BackButton title="Go Back" />
                    </>
                )
            }
            const customer = await getCustomer(ticket.customerId)
            if(isManager) {
                KindeInit()
                const {users} = await Users.getUsers()
                const techs = users ? users.filter((user): user is {email: string} => typeof user.email === "string").map(user => ({id: user.email?.toLocaleLowerCase(), description: user.email?.toLocaleLowerCase()})) : []
                return <TicketForm customer={customer} ticket={ticket} techs={techs} isManager={isManager} />

            }else{
                const isEditable = user.email?.toLowerCase() === ticket.tech.toLowerCase()
                return <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
            }
        }
        
    }catch (e) {
     if(e instanceof Error) {  
        throw e
    }
    }
}