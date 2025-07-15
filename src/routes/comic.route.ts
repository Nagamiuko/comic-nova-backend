import { likeComic, unlikeComic } from "@/controllers/comic/linkComic";
import {
  AuthenticationMiddleware,
  SecretKeyAuthentication,
} from "@/middleware/middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/comic/like",
  SecretKeyAuthentication,
  AuthenticationMiddleware,
  likeComic
);
router.post(
  "/comic/unlike",
  SecretKeyAuthentication,
  AuthenticationMiddleware,
  unlikeComic
);

export default router;
