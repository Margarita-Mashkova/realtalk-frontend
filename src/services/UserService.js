import axios from 'axios'

const USER_API_BASE_URL='http://localhost:9000/'
class UserService{

    //PUT
    subscribe(id){
        let URL = USER_API_BASE_URL+'subscribe/'+id
        return axios.put(URL)
    
    }
    editProfile(user){
        let URL = USER_API_BASE_URL+'edit-profile'
        return axios.putForm(URL, user)
    }
    editPreferences(tags){
        let URL = USER_API_BASE_URL+'edit-preferences'
        return axios.put(URL, tags)
    }

    //POST
    login(user){
        let URL = USER_API_BASE_URL+'auth'
        return axios.post(URL, user)
    }
    register(user){
        let URL = USER_API_BASE_URL+'register'
        return axios.postForm(URL, user)
    }

    //GET
    me(){
        let URL = USER_API_BASE_URL+'me'
        return axios.get(URL)
    }    
    findUsers(query){
        let URL = USER_API_BASE_URL+'find?query='+query
        //return axios.get(URL, query)
        return axios.get(URL)
    }
    findUsersByPreferences(){
        let URL = USER_API_BASE_URL+'preferences-find'
        return axios.get(URL)
    }
    findAllUsers(){
        let URL = USER_API_BASE_URL+'users'
        return axios.get(URL)
    }
    getUserProfile(login){
        let URL = USER_API_BASE_URL+login
        return axios.get(URL)
    }
    findUserByLogin(login){
        let URL = USER_API_BASE_URL+'find-by-login?login='+login
        return axios.get(URL)
    }
    getUserPosts(login){
        let URL = USER_API_BASE_URL+'user-posts/'+login
        return axios.get(URL)
    }
}
export default new UserService()