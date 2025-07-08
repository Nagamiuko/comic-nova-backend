import 'module-alias/register';

import app from "@/app"

const port = process.env.PORT || 6000
app.listen(port, () => {
   console.log(`server runing to port ${port}`);
})


