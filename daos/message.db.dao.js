import messageModel from "./models/message.model.js";

class MessageDbDAO{

    constructor(){}

    getMessages(){
        return messageModel.find();
    }

    async addMessage(messageToAdd){

        return messageModel.create(messageToAdd);
    }
}

export default MessageDbDAO;