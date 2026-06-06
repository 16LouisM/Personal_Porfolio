import app from "./firebase-config.js";

import {
  getStorage,
  ref,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const storage = getStorage(app);

try {

  const imageRef = ref(storage, "https://github.com/16LouisM/Personal_Porfolio/blob/main/assets/images/certificates/profile/profile.jpeg?raw=true");

  const url = await getDownloadURL(imageRef);

  console.log("✅ Storage Connected");
  console.log(url);

} catch(error) {

  console.error(error);

}