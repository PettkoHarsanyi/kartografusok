import axios from "axios"
import jwt_decode from "jwt-decode";

const signUp = (name, userName, password) => {
    return axios
    .post("api/users", {
        name,
        userName,
        password
    })
    .then((response)=>{
        if(response.data.access_token){
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    })
}

const logIn = (userName, password) => {
    return axios
        .post("api/users/login",{
            userName,
            password
        })
        .then((response) =>{
            if(response.data.access_token){
                localStorage.setItem("user",JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logOut = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return localStorage.getItem("user") ? jwt_decode(JSON.parse(localStorage.getItem("user")).access_token).user : null;
}

const AuthService = {
    signUp,
    logIn,
    logOut,
    getCurrentUser
}

export default AuthService;