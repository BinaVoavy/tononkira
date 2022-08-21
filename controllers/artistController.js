import { JSDOM } from "jsdom";
import got from "got";
import pretty from "pretty";

export const getAllArtist = async (req, res) => {
  try {
    let results = [];
    let responses = [];
    const { from, count } = req.body;
    const requestCount = parseInt((count - 1) / 20) + 1;
    for (let i = 0; i < requestCount; i++) {
      const response = got(
        `https://tononkira.serasera.org/tononkira/mpihira/results/${
          from + 20 * i
        }`
      );
      responses.push(response);
    }

    responses = await Promise.all(responses);
    responses.forEach((response) => {
      const dom = new JSDOM(response.body);
      const { document } = dom.window;
      document.querySelectorAll("tr").forEach((element, index) => {
        if (index > 1) {
          const song = {
            name: element.children[1].firstChild.innerHTML,
            info: `/artists${element.children[1].firstChild.href
              .split("")
              .splice(38)
              .join("")}`,
            songs: +element.children[2].firstChild.innerHTML,
          };
          results.push(song);
        }
      });
    });
    results = results.slice(0, count);
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
};

export const getArtistInfom = async (req, res) => {
  try {
    let { name } = req.params;
    name = name.replace(/[^a-zA-Z0-9 _\-]/g, "").replace(/[ _]/g, "-");

    const response = await got(
      `https://tononkira.serasera.org/mpihira/${name}`
    );
    const dom = new JSDOM(response.body);
    const { document } = dom.window;
    const info = document.querySelector(".mombamomba");
    if (!info) return res.status(404).send({});
    const images = [];
    document.querySelectorAll(".sary img").forEach((element) => {
      images.push(element.getAttribute("src"));
    });
    const result = {
      artist: document.querySelector("#main > h1:nth-child(1)").textContent,
      info: pretty(info.textContent),
      images,
    };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
};
