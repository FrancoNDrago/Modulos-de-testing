import { TicketFty } from "../daos/factory.js";

class TicketService{
    constructor(){
        this.persistanceEngine = new TicketFty();
    }

    getTicket(id){
        return this.persistanceEngine.getTicket(id);
    }

    addTicket(ticket){
        return this.persistanceEngine.addTicket(ticket);
    }
}

export default TicketService;