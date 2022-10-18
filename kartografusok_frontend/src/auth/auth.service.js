import axios from "axios"
import jwt_decode from "jwt-decode";
import authHeader from "./auth-header";

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
    // Ha van user a localStorageban (tehát van valaki bejelentkezve) akkor kérje el a JWT tokenból kiolvasható user-t.
    return localStorage.getItem("user") ? jwt_decode(JSON.parse(localStorage.getItem("user")).access_token).user : null;
}

const refreshAuthenticatedUser = (user) => {
    return axios
        .post("api/users/refreshtoken",{
            id: user.id
        },{
            headers: authHeader()
        })
        .then((response) =>{
            if(response.data.access_token){
                logOut();
                localStorage.setItem("user",JSON.stringify(response.data));
            }

            return response.data;
        });
}

const isAdmin = () => {
    const user = getCurrentUser();

    if(user){
        return (user.role === "ADMIN")
    }else{
        return false;
    }
}

const authService = {
    signUp,
    logIn,
    logOut,
    getCurrentUser,
    isAdmin,
    refreshAuthenticatedUser,
}

export default authService;