// Firebase Configuration (replace with your Firebase config details)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Encryption key (for simplicity, this is hardcoded, but in production, you should handle this securely)
  const encryptionKey = 'your-very-secret-key';
  
  // Function to encrypt data
  function encryptData(data) {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }
  
  // Function to decrypt data
  function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  
  // Function to add user data
  function addUserData() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const comments = document.getElementById('comments').value;
  
    const encryptedPassword = encryptData(password);  // Encrypt the password before storing
  
    db.collection('users').add({
      name: name,
      email: email,
      username: username,
      password: encryptedPassword,  // Store the encrypted password
      comments: comments
    })
    .then(() => {
      alert("Data added successfully!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  
  // Function to fetch and decrypt user data
  function fetchUserData() {
    db.collection('users').get()
      .then((querySnapshot) => {
        const userDataContainer = document.getElementById('userData');
        userDataContainer.innerHTML = '';  // Clear any previous results
  
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const decryptedPassword = decryptData(userData.password);  // Decrypt the password before displaying
  
          const userHTML = `
            <div>
              <h3>${userData.name}</h3>
              <p>Email: ${userData.email}</p>
              <p>Username: ${userData.username}</p>
              <p>Password: ${decryptedPassword}</p>
              <p>Comments: ${userData.comments}</p>
            </div>
          `;
          userDataContainer.innerHTML += userHTML;
        });
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }
  