// //delete user
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//       const user = await User.findByIdAndDelete(userId);
  
//       res.send("user deleted");
//     } catch (err) {
//       res.status(400).send("Error: " + err.message);
//     }
//   });
  
//   //patch or update  user
//   app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//       const ALLOWED_UPDATES = [
//         "gender",
//         "skills",
//         "about",
//         "password",
//         "lastName",
//       ];
//       const isUpdatesAllowed = Object.keys(data).every((k) => {
//         ALLOWED_UPDATES.includes(k);
//       });
//       if (isUpdatesAllowed) {
//         throw new Error("user update not allowed");
//       }
  
//       const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//         returnDocument: "before",
//         runValidators: true,
//       });
//       res.send("user updated");
//     } catch (err) {
//       res.status(400).send("Error: " + err.message);
//     }
//   });