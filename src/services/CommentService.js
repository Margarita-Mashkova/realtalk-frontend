import axios from 'axios'

const COMMENT_API_BASE_URL='http://localhost:9000/comment'

class CommentService{

    //PUT
    editComment(id, comment){
        let URL = COMMENT_API_BASE_URL+"/"+id
        return axios.put(URL, comment)
    }
    likeComment(id){
        let URL = COMMENT_API_BASE_URL+"/like/"+id
        return axios.put(URL)
    }

    //POST
    createComment(comment){
        let URL = COMMENT_API_BASE_URL
        return axios.post(URL, comment)
    }

    //DELETE
    deleteComment(id){
        let URL = COMMENT_API_BASE_URL+"/"+id
        return axios.delete(URL) 
    }
}
export default new CommentService()