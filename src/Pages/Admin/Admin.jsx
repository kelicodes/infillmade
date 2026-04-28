// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./Admin.css";

// const AvatarDisplay = () => {
//   const [avatars, setAvatars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFiles, setSelectedFiles] = useState({}); // store file per avatar

//   useEffect(() => {
//     const fetchAvatars = async () => {
//       try {
//         const res = await axios.get("https://inf-ct8e.onrender.com/avatar/all");
//         setAvatars(res.data.allAvatars);
//       } catch (err) {
//         console.error("Failed to fetch avatars:", err);
//       }
//       setLoading(false);
//     };
//     fetchAvatars();
//   }, []);

//   const handleFileChange = (e, id) => {
//     setSelectedFiles({ ...selectedFiles, [id]: e.target.files[0] });
//   };

//   const handlePostAnime = async (id) => {
//     if (!selectedFiles[id]) return alert("Select an anime image first");

//     const formData = new FormData();
//     formData.append("animeImage", selectedFiles[id]);
//       formData.append("avatarId", id); // <-- send ID in body

//       console.log("ooooooo",formData)
//       for (let pair of formData.entries()) {
//   console.log(pair[0], pair[1]);
// }



//     try {
//       const res = await axios.post(
//         `https://thegoldfina.onrender.com/avatar/post-anime`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       // Update avatar locally
//       setAvatars((prev) =>
//         prev.map((av) => (av._id === id ? res.data.avatar : av))
//       );

//       console.log(formData,res)

//       alert("Anime version posted!");
//       // Clear the selected file
//       setSelectedFiles((prev) => ({ ...prev, [id]: null }));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to post anime version");
//     }
//           console.log(formData,res)

//   };

//   if (loading) return <p style={{ color: "var(--text-color)" }}>Loading avatars...</p>;
//   if (!avatars.length) return <p style={{ color: "var(--text-color)" }}>No avatars found.</p>;

//   return (
//     <div className="avatar-grid">
//       {avatars.map((avatar) => (
//         <div key={avatar._id} className="avatar-card">
//           <img
//             src={avatar.imageUrl || avatar.originalImage}
//             alt="Avatar"
//             className="avatar-image"
//           />
//           <div className="avatar-info">
//             <p><strong>Height:</strong> {avatar.height || "-"}</p>
//             <p><strong>Weight:</strong> {avatar.weight || "-"}</p>
//             <p><strong>Clothing Size:</strong> {avatar.clothingSize || "-"}</p>
//             <p><strong>Shoe Size:</strong> {avatar.shoeSize || "-"}</p>
//             <p><strong>Style:</strong> {avatar.stylePreference || "-"}</p>
//           </div>
//           <div className="anime-upload">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, avatar._id)}
//             />
//             <button onClick={() => handlePostAnime(avatar._id)}>Post Anime</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AvatarDisplay;
