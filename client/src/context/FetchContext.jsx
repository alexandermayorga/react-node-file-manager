import React, { createContext, useEffect } from "react";
import axios from 'axios';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {

  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  useEffect(()=>{
    const getCsrfToken = async () => {
      const { data } = await authAxios.get("/csrf-token");
      // console.log(data)
      authAxios.defaults.headers['X-CSRF-Token'] = data.csrfToken
    }
    getCsrfToken();
  }, [authAxios])

  function deleteItem(file, cb) {
      authAxios
        .post("/delete", { file })
        .then((res) => {
          if (cb) return cb(null, res);
          alert("Delete Operation was successful");
        })
        .catch((err) => {
          if (cb) return cb(err);
          alert(
            "Error! Delete Operation was not Completed. See Console for errors"
          );
          console.log("Delete Error");
          console.log(err.response);
        });
  }


  function downloadItem(file,cb) {
    authAxios
      .post('download',{id: file._id}, {
        responseType: "blob", // !important to download the file
      })
      .then((res) => {
        // console.log(res.data);
        /*
          https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
          https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
          */

        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${file.name}${file.isFolder ? ".zip" : ""}`
        );
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        if (cb) cb(null, res);
      })
      .catch((err) => {
        console.log(err);
        if (cb) cb(err);
      });
  }


  return (
    <Provider
      value={{
        authAxios,
        deleteItem,
        downloadItem
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
