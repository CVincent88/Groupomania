import axios from 'axios';

const URL = 'http://localhost:5000/api/v1/posts/'


 class postService {
    
    //get posts 

    static getPosts() {
        return new Promise((resolve, reject) =>{
            try{
                const res = axios.get(URL);
                const datas = res;
                // let allPosts = res.then((post) => {
                //     return post.data
                // });

                resolve(
                    datas.then((post) => {
                        let allPosts = post.data;
                        let response = allPosts.map(post => ({
                            ...post
                        }))
                        console.log(response)
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
