import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs';
import CreateNewFolder from './CreateNewFolder';
import UploadImage from './UploadImage';
import Loader from "./ui/Loader";
import DropZone from "./DropZone";
import ThumbnailList from "./Thumbnails";

import { FetchContext } from '../context/FetchContext';
import { useParams } from "react-router-dom";

function Shared() {
  

  return (
    <div>
      Shared Page - Coming Soon...
    </div>
  );
}

export default Shared;