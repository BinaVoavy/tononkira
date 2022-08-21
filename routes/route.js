import { Router } from "express";
import {
  getAllArtist,
  getArtistInfom,
} from "../controllers/artistController.js";
import {
  getAllSong,
  getArtistSong,
  getSong,
  searchSong,
} from "../controllers/songController.js";

const route = Router();

route.get("/", (req, res) => {
  res.redirect("/songs");
});
route.get("/songs", getAllSong);
route.get("/songs/:artist", getArtistSong);
route.get("/songs/:artist/:title", getSong);
route.get("/search/:title", searchSong);
route.get("/artists/", getAllArtist);
route.get("/artists/:name", getArtistInfom);

export default route;
