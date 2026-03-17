import { Router } from 'express';

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {

  try {

    return res.render("index")
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  } 
});


export default indexRouter;
