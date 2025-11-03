import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
    {origin: 'https://reactfe.panoptical.org:5173'}
));
app.use(express.json());

app.use("/api/form", (req, res) => {
  let {name, email} = req.body;
  return res.status(200).json({success: true, message: "Form data received", data: {name, email}});    
});

app.get("/", (req, res) => {
  res.send("Hello from the Node.js backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
