import { JSDOM } from "jsdom";
import got from "got";
import pretty from "pretty";

export const getAllSong = async (req, res) => {
  try {
    let results = [];
    let responses = [];
    const { from, count } = req.body;
    const requestCount = parseInt((count - 1) / 20) + 1;
    for (let i = 0; i < requestCount; i++) {
      const response = got(
        `https://tononkira.serasera.org/tononkira/hira/results/${from + 20 * i}`
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
            title: element.children[1].firstChild.innerHTML,
            lyricsUrl: `/song${element.children[1].firstChild.href
              .split("")
              .splice(35)
              .join("")}`,
            artist: element.children[2].firstChild.innerHTML,
            artistUrl: `/artist${element.children[2].firstChild.href
              .split("")
              .splice(38)
              .join("")}`,
          };
          results.push(song);
        }
      });
    });
    results = results.slice(0, count);
    res.send(results);
    console.log(results.length);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
};

export const getArtistSong = async (req, res) => {
  try {
    let { artist } = req.params;
    artist = artist.replace(/[^a-zA-Z0-9 _\-]/g, "").replace(/[ _\-]/g, "+");

    let results = [];
    let responses = [];
    const { from, count } = req.body;
    const requestCount = parseInt((count - 1) / 30) + 1;
    for (let i = 0; i < requestCount; i++) {
      const response = got(
        `https://tononkira.serasera.org/tononkira?` +
          `lohateny_like=on&lohateny=&anarana_like=on` +
          `&anarana=${artist}&hira=&per_page=0${from + 30 * i}`
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
            title: element.children[1].firstChild.innerHTML,
            lyricsUrl: `/song${element.children[1].firstChild.href
              .split("")
              .splice(35)
              .join("")}`,
            artist: element.children[2].firstChild.innerHTML,
            artistUrl: `/artist${element.children[2].firstChild.href
              .split("")
              .splice(38)
              .join("")}`,
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

export const getSong = async (req, res) => {
  try {
    let { artist, title } = req.params;
    artist = artist.replace(/[^a-zA-Z0-9 _\-]/g, "").replace(/[ _]/g, "-");
    title = title.replace(/[^a-zA-Z0-9 _\-]/g, "").replace(/[ _]/g, "-");

    const response = await got(
      `https://tononkira.serasera.org/hira/${artist}/${title}`
    );

    const dom = new JSDOM(response.body);
    const { document } = dom.window;
    const lyricsContainer = document.querySelector("div.col:nth-child(1)");
    if (!lyricsContainer) return res.status(404).send({});
    const result = {
      lyrics: pretty(lyricsContainer.textContent)
        .split("")
        .splice(16)
        .join("")
        .replace("\n\n\n\n\nHametraka hevitra", ""),
      artist: document.querySelector(".meta > a:nth-child(2)").textContent,
      artistUrl: `/artist${document
        .querySelector(".meta > a:nth-child(2)")
        .href.split("")
        .splice(38)
        .join("")}`,
      title: document.querySelector("#main > h1:nth-child(1)").textContent,
    };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
};

export const searchSong = async (req, res) => {
  try {
    let { title } = req.params;
    title = title.replace(/[^a-zA-Z0-9 _\-]/g, "");
    title = title.replace(/[ _\-]/g, "+");

    let results = [];
    let responses = [];
    const { from, count } = req.body;
    const requestCount = parseInt((count - 1) / 30) + 1;
    for (let i = 0; i < requestCount; i++) {
      const response = got(
        `https://tononkira.serasera.org/tononkira/?q=${title}&per_page=${
          from + 30 * i
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
            title: element.children[1].firstChild.innerHTML,
            lyricsUrl: `/songs${element.children[1].firstChild.href
              .split("")
              .splice(35)
              .join("")}`,
            artist: element.children[2].firstChild.innerHTML,
            artistUrl: `/artists${element.children[2].firstChild.href
              .split("")
              .splice(38)
              .join("")}`,
          };
          results.push(song);
        }
      });
    });
    results = results.slice(0, count);
    res.send(results);
    console.log(results.length);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
};
