import axios from 'axios'

const POST_API_BASE_URL='http://localhost:9000/post'

class PostService{

    //PUT
    editPost(id, post){
        let URL = POST_API_BASE_URL + '/' + id 
        return axios.put(URL, post)
    }
    likePost(id){
        let URL = POST_API_BASE_URL+"/like/"+id
        return axios.put(URL)
    }
    uploadPostPhoto(id, file){
        let URL = POST_API_BASE_URL + '/' + id + '/upload'
        return axios.putForm(URL, file)
    }

    //POST
    createPost(post){
        let URL = POST_API_BASE_URL
        return axios.post(URL, post)
    }

    //GET
    getPostByUser(){
        let URL = POST_API_BASE_URL
        return axios.get(URL)
    }

    //DELETE
    deletePost(id){
        let URL = POST_API_BASE_URL+ '/' + id
        return axios.delete(URL) 
    }
}
export default new PostService()