import axios from "axios";

export function deleteItem(file, cb) {
    axios
        .post("/api/delete", { file })
        .then((res)=>{
            if (cb) return cb(null, res);
            alert('Delete Operation was successful')
        })
        .catch((err) => {
            if (cb) return cb(err);
            alert("Error! Delete Operation was not Completed. See Console for errors");
            console.log("Delete Error")
            console.log(err)
        });
}

export function downloadItem(file,cb) {
  // console.log(file);

  axios
    .get(`/api/download/${file._id}`, {
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
      if(cb) cb(null, res)

    })
    .catch((err) => {
        console.log(err)
        if (cb) cb(err);
    });
}




  // function downloadFile(file) {
  //   if (file.isDirectory) {

  //     axios.get('api/download-folder', {
  //       params: {
  //         filePath: encodeURI(file.filePath),
  //         fileName: encodeURI(file.fileName)
  //        },
  //       responseType: 'blob' // !important to download the file 
  //     })
  //       .then((res)=>{
  //         console.log(res.data)

  //         // 2. Create blob link to download
  //         const url = window.URL.createObjectURL(new Blob([res.data]));
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', file.fileName);
  //         // 3. Append to html page
  //         document.body.appendChild(link);
  //         // 4. Force download
  //         link.click();
  //         // 5. Clean up and remove the link
  //         link.parentNode.removeChild(link);


  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })

  //     return;
  //   }
    
  //   axios.get('api/download', {
  //     params: { filePath: encodeURI(file.filePath) },
  //     responseType: 'blob' // !important to download the file 
  //   })
  //     .then((res) => {

  //       /*
  //         https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e
  //         https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
  //       */

  //       // 2. Create blob link to download
  //       const url = window.URL.createObjectURL(new Blob([res.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', file.fileName);
  //       // 3. Append to html page
  //       document.body.appendChild(link);
  //       // 4. Force download
  //       link.click();
  //       // 5. Clean up and remove the link
  //       link.parentNode.removeChild(link);
        
  //     })
  //     .catch(err => console.log(err))
    
  // }