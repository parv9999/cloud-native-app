import axios from "axios";

const instance = axios.create({
  baseURL: "http://cloud-native-frontend-parv.s3-website.ap-south-1.amazonaws.com"
});

export default instance;
