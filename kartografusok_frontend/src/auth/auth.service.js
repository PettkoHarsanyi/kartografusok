import axios from "axios"

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
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).user : null;
}

const AuthService = {
    signUp,
    logIn,
    logOut,
    getCurrentUser
}

export default AuthService;