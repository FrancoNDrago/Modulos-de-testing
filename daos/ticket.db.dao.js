import ticketModel from "./models/ticket.model.js";

class TicketDbDAO{

  constructor(){}

  getTicket(_id){
    return ticketModel.findOne({_id});
  }

  addTicket(ticket){
    return ticketModel.create(ticket);
  }

}

export default TicketDbDAO;