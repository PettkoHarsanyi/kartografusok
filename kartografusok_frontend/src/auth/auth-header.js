export default function authHeader(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(user && user.access_token){
        const header = {Authorization : "Bearer " + user.access_token}
        return header;
    }else {
        return {}
    }
}