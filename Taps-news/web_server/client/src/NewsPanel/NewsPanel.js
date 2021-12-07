import "./NewsPanel.css";
import _ from "lodash";
import React from "react";
import Auth from "../Auth/Auth";
import NewsCard from "../NewsCard/NewsCard";

let isLoadMoreDone = true;

class NewsPanel extends React.Component {
  constructor() {
    super();
    this.state = { news: null, pageNum: 1, totalPages: 1, loadedAll: false };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    let scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;
    if (
      window.innerHeight + scrollY >= document.body.offsetHeight - 50 &&
      isLoadMoreDone
    ) {
      console.log("Loading more news");
      isLoadMoreDone = false;
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    if (this.state.loadedAll === true) {
      return;
    }
    let url = `http://localhost:3000/news/userId/${Auth.getEmail()}/pageNum/${
      this.state.pageNum
    }`;
    let request = new Request(encodeURI(url), {
      method: "GET",
      headers: {
        Authorization: "bearer " + Auth.getToken(),
      },
      cache: "no-store",
    });

    fetch(request)
      .then((res) => res.json())
      .then((news) => {
        if (!news || news.length === 0) {
          this.setState({ loadedAll: true });
        }
        this.setState(
          {
            news: this.state.news ? this.state.news.concat(news) : news,
            pageNum: this.state.pageNum + 1,
          },
          () => {
            isLoadMoreDone = true;
          }
        );
      });
  }

  renderNews() {
    console.log(this.state.news);
    const news_list = this.state.news.map((news, idx) => {
      return (
        <a className="list-group-item" key={idx} href="#" target="_blank">
          <NewsCard news={news} />
        </a>
      );
    });

    return (
      <div className="container-fluid">
        <div className="list-group">{news_list}</div>
      </div>
    );
  }

  render() {
    if (this.state.news) {
      return (
        <div>
          {this.renderNews()}
          <div class="loader"></div>
        </div>
      );
    } else {
      return <div class="loader"></div>;
    }
  }
}

export default NewsPanel;
