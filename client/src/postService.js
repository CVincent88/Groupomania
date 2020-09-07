import axios from 'axios';

const URL = 'http://localhost:5000/api/v1/posts/'


 class postService {
    
    //get posts 

    static getPosts() {
        return new Promise((resolve, reject) =>{
            try{
                const res = axios.get(URL);
                const datas = res;
                resolve(
                    datas.then((post) => {
                        let allPosts = post.data;
                        let response = allPosts.map(post => ({
                            ...post
                        }))
                        return response
                    })
                );
            }catch(err){
                reject(err);
            }
        });
    }

}


export default postService;
