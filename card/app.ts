import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { distributeCard, validateAnswer } from "@/utils";

const port = process.env.PORT || 80;

type Resbody = string[][];

type Reqbody = {
  numberOfUser: string;
};

const postRequest: RequestHandler<null, Resbody, Reqbody> = async (
  req,
  res
) => {
  const { numberOfUser } = req.body;

  if (validateAnswer(numberOfUser)) {
    return res.status(400);
  }

  const distrbutedCards = distributeCard(parseInt(numberOfUser));

  res.setTimeout(1000, () => {
    res.status(200).json(distrbutedCards);
  });
};

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

// Initialize express server
const app = express();

// Configure app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// Configure routes

app.get("/", (_req, res) => {
  res.status(200).json({ message: "ok" });
});

app.post("/", postRequest);

app.listen(port, function () {
  console.log(`App started and listening on port ${port}`);
});
