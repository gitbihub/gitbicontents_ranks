const API_KEY = "c249b4eae363daa72bef1b3242ab28dc";
const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const top3List = document.getElementById("top3-list");
const movieList = document.getElementById("movie-list");
const voteList = document.getElementById("vote-list");
const top3Template = document.getElementById("top3-card-template");
const template = document.getElementById("movie-card-template");
const voteTemplate = document.getElementById("vote-item-template");

function setStatus(message, isError = false) {
  top3List.innerHTML = "";
  movieList.innerHTML = `<p class="status ${isError ? "error" : ""}">${message}</p>`;
}

function setPosterImage(posterElement, movie) {
  if (movie.poster_path) {
    posterElement.src = `${IMAGE_BASE}${movie.poster_path}`;
    posterElement.alt = `${movie.title} 포스터`;
    return;
  }

  posterElement.alt = `${movie.title} 포스터 없음`;
}

function formatMovieMeta(movie) {
  const releaseDate = movie.release_date || "정보 없음";
  const popularity = typeof movie.popularity === "number" ? movie.popularity.toFixed(1) : "정보 없음";
  return { releaseDate, popularity };
}

function createTop3Card(movie, rank) {
  const node = top3Template.content.cloneNode(true);
  const card = node.querySelector(".top3-card");
  const rankLabel = node.querySelector(".rank-label");
  const poster = node.querySelector(".poster");
  const title = node.querySelector(".movie-title");
  const meta = node.querySelector(".movie-meta");
  const movieMeta = formatMovieMeta(movie);

  card.classList.add(`top${rank}`);
  rankLabel.textContent = `${rank}`;
  title.textContent = movie.title;
  meta.textContent = `개봉일: ${movieMeta.releaseDate} | 인기지수: ${movieMeta.popularity}`;
  setPosterImage(poster, movie);

  return node;
}

function createMovieCard(movie, rank) {
  const node = template.content.cloneNode(true);
  const rankBadge = node.querySelector(".rank-badge");
  const poster = node.querySelector(".poster");
  const title = node.querySelector(".movie-title");
  const meta = node.querySelector(".movie-meta");
  const movieMeta = formatMovieMeta(movie);

  rankBadge.textContent = `${rank}위`;
  title.textContent = movie.title;
  meta.textContent = `개봉일: ${movieMeta.releaseDate}\n인기지수: ${movieMeta.popularity}`;
  setPosterImage(poster, movie);

  return node;
}

function createVoteItem(movie, rank) {
  const node = voteTemplate.content.cloneNode(true);
  const voteTitle = node.querySelector(".vote-title");
  const voteDesc = node.querySelector(".vote-desc");
  const voteAverage = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "정보 없음";
  const voteCount = typeof movie.vote_count === "number" ? movie.vote_count.toLocaleString() : "정보 없음";

  voteTitle.textContent = `${rank}위 ${movie.title}`;
  voteDesc.textContent = `vote_average ${voteAverage} | vote_count ${voteCount}`;
  return node;
}

async function loadTopRatedMovies() {
  setStatus("영화 데이터를 불러오는 중...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    const movies = data.results?.slice(0, 20) || [];

    if (!movies.length) {
      setStatus("표시할 영화가 없습니다.");
      return;
    }

    const top3Movies = movies.slice(0, 3);
    const otherMovies = movies.slice(3);

    top3List.innerHTML = "";
    movieList.innerHTML = "";
    voteList.innerHTML = "";

    top3Movies.forEach((movie, index) => {
      top3List.appendChild(createTop3Card(movie, index + 1));
    });

    otherMovies.forEach((movie, index) => {
      movieList.appendChild(createMovieCard(movie, index + 4));
    });

    movies.forEach((movie, index) => {
      voteList.appendChild(createVoteItem(movie, index + 1));
    });
  } catch (error) {
    console.error(error);
    setStatus("데이터를 가져오지 못했습니다. API KEY와 네트워크를 확인해주세요.", true);
  }
}

loadTopRatedMovies();
