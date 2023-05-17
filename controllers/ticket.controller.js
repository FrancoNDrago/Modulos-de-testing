import TicketService from "../services/ticket.service.js";

class TicketController{
  constructor(){
    this.ticketService = new TicketService();
  }

  getTicket(id){
    return this.ticketService.getTicket(id);
  }

  generateTicket(ticket){
    return this.ticketService.addTicket(ticket);
  }

}

export default TicketController;