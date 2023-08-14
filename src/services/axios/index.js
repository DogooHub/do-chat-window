import Cookies from "js-cookie";
import axios from "axios";
import {getOperationID} from "../utils";

export const BASE_PATH_API = process.env.REACT_APP_OPEN_IM_CHAT_API;
export const BASE_PATH = `${process.env.REACT_APP_MY_API_KEY}`;
export const BASE_URL_IMAGE = BASE_PATH.replace('/o', '');
export const getOpenImToken = () => {
    return Cookies.get('openImToken');
};

export const getLocalAccessToken = () => {
    return Cookies.get("accessToken");
}

const baseUrl = '/dogoo/account-rest/v2.0';

export const getAllAccounts = async (axios, filter, page, pageSize, search, sort) => {
    const response = await axios.get(baseUrl + '/accounts', {
        params: {
            filter,
            page,
            pageSize,
            search,
            sort,
        },
    });
    return response?.data || [];
};

export const uploadFile = ({file, fileType = 1}) => {
    const data = new FormData();

    data.set("file", file)
    data.set("fileType", `${fileType}`);
    data.set("operationID", getOperationID());

    return axios.post(`${BASE_PATH_API}/third/minio_upload`,
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: getOpenImToken()
            }
        })
}

export const getUsersOnline = (userIDList = []) => {
    return axios.post(`${BASE_PATH_API}/user/get_users_online_status`, {
        operationID: getOperationID(),
        userIDList
    }, {
        headers: {token: getOpenImToken()}
    })
}
