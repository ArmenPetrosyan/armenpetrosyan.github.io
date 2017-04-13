class MovieFinder {

  constructor() {
    this.results = [];
    this.isSorted = false;
    this.queryPrefix = `https://api.themoviedb.org/3/search/movie?api_key=98c44624a954b0a3f8844a5f82194c8f&query=`;
    this.init();
  }

  init() {
    this.form = document.querySelector('.search-form');
    this.header = document.querySelector('.table__header');
    this.counterElement = document.querySelector('.counter');
    this.counterValueElement = document.querySelector('.counter__value');
    this.main = document.querySelector('.main');
    this.tbody = document.querySelector('.data-table tbody');

    this.form.addEventListener('submit', this.submitHandler.bind(this));
    this.header.addEventListener('click', this.clickHandler.bind(this));
  }

  processData({results}) {
    this.counterElement.classList.remove('hidden');
    this.results = this.filterSequence(results);
    this.updateTable(this.results);
  }

  filterSequence(dataSequence) {
    return dataSequence.map(this.filterObject);
  }

  filterObject({id, title, original_language:language, popularity, vote_count:votes, vote_average:rating, release_date:releaseDate}) {
    return {
      id,
      title,
      language,
      popularity,
      votes,
      rating,
      releaseDate
    }
  }

  sortSequenceByFieldName(sequence, field, reverse) {
    const sorted = sequence.sort((left, right) => {

      let [leftVal, rightVal] = [left[field], right[field]];

      // for lexical comparison
      leftVal = (typeof leftVal === 'string') ? leftVal.toLowerCase() : leftVal;
      rightVal = (typeof rightVal === 'string') ? rightVal.toLowerCase() : rightVal;

      if (reverse) {
        return (leftVal < rightVal) ? 1 : (leftVal > rightVal) ? -1 : 0;
      }

      return  (leftVal > rightVal) ? 1 : ((leftVal < rightVal) ? -1 : 0);
    });

    return sorted;
  }

  addTableRow(rowData) {
    const row = document.createElement('tr');

    for(const key in rowData) {
      const td = document.createElement('td');
      td.innerText = rowData[key];
      row.appendChild(td);
    }

    this.tbody.appendChild(row);
  }

  clearTable() {
    this.tbody.innerHTML = '';
  }

  updateTable(dataSequence) {
    this.clearTable();
    this.counterValueElement.innerText = dataSequence.length;

    dataSequence.forEach(data => {
      this.addTableRow(data);
    });
  }

  sortTable(currentNode, isSorted) {
    if(!currentNode.classList.contains('table__title')) return false;

    const key = currentNode.getAttribute('data-key');
    const sorted = this.sortSequenceByFieldName(this.results,key,this.isSorted);
    this.updateTable(sorted);

    document.querySelectorAll('.table__title').forEach(function(node){
      node.classList.remove('up','down');
    });

    currentNode.classList.add((isSorted) ? 'down' : 'up');
    this.isSorted = !this.isSorted;
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

  clickHandler(event) {
    this.sortTable(event.target, this.isSorted);
  }
}

new MovieFinder();