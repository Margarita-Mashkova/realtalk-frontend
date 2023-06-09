import axios from 'axios'

const CHAT_API_BASE_URL='http://localhost:9000/chat'

class ChatService{

    //PUT
    addMembersToChat(id, members){
        let URL = CHAT_API_BASE_URL+"/"+id+"/add-members"
        return axios.put(URL, members)
    }
    deleteMembersFromChat(id, members){
        let URL = CHAT_API_BASE_URL+"/"+id+"/delete-members"
        return axios.put(URL, members)
    }
    leaveChat(id){
        let URL = CHAT_API_BASE_URL+"/leave/"+id
        return axios.put(URL)
    }
    editChat(id, chat){
        let URL = CHAT_API_BASE_URL+"/edit-chat/"+id
        return axios.putForm(URL, chat)
    }

    //POST
    createChat(chat){
        let URL = CHAT_API_BASE_URL
        return axios.post(URL, chat)
    }

    //GET
    getChatsByUser(){
        let URL = CHAT_API_BASE_URL
        return axios.get(URL)
    }

    //GET
    getChatById(id){
        let URL = CHAT_API_BASE_URL+"/"+id
        return axios.get(URL)
    }

    //DELETE
    deleteChat(id){
        let URL = CHAT_API_BASE_URL+"/"+id
        return axios.delete(URL)
    }
}

export default new ChatService()