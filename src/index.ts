import "module-alias/register";
import dotenv from "dotenv";
import app from "@/app";

dotenv.config();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server runing to port ${port}`);
});
