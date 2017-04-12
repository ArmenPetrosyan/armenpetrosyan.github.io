class MovieFinder {

  constructor() {
    this.results = [];
    this.queryPrefix = `https://api.themoviedb.org/3/search/movie?api_key=98c44624a954b0a3f8844a5f82194c8f&query=`;

    this.init();
  }

  init() {
    this.form = document.querySelector('.search-form');
    this.counterElement = document.querySelector('.counter');
    this.counterValueElement = document.querySelector('.counter__value');
    this.main = document.querySelector('.main');
    this.tbody = document.querySelector('.data-table tbody');

    this.form.addEventListener('submit', this.submitHandler.bind(this));
  }

  processData({results}) {
    this.counterElement.classList.remove('hidden');
    this.results = results;
    this.updateTable(this.results);
  }

  addTableRow(...rowData) {
    const row = document.createElement('tr');
    rowData.forEach(value => {
      const td = document.createElement('td');
      td.innerText = value;
      row.appendChild(td);
    });

    this.tbody.appendChild(row);
  }

  cleanTable() {
    this.tbody.innerHTML = '';
  }

  updateTable(dataSequence) {
    this.cleanTable();
    this.counterValueElement.innerText = dataSequence.length;

    dataSequence.forEach(
      ({id,
        title,
        original_language:language,
        popularity,
        vote_count:votes,
        vote_average:rating,
        release_date:releaseDate
      }) => {
        this.addTableRow(id, title, language, popularity,  votes, rating, releaseDate);
      }
    );
  }

  submitHandler(event) {
    event.preventDefault();
    const value = event.srcElement[0].value;
    const query = `${this.queryPrefix}${value}`;

    this.main.classList.add('main_loading');

    fetch(query).then(response => {
      this.main.classList.remove('main_loading');
      return response.json();
    }).then(this.processData.bind(this));
  };

}

new MovieFinder();