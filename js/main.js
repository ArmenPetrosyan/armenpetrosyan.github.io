class MovieFinder {

  constructor() {
    this.results = [];
    this.isSorted = false;
    this.queryPrefix = `https://api.themoviedb.org/3/search/movie?api_key=98c44624a954b0a3f8844a5f82194c8f&query=`;
    this.init();
  }

  init() {
    // Getting nodes
    this.mainNode = document.querySelector('.main');
    this.headerNode = document.querySelector('.table__header');
    this.formNode = document.querySelector('.search-form');
    this.counterNode = document.querySelector('.counter');
    this.counterValueNode = document.querySelector('.counter__value');
    this.tableBodyNode = document.querySelector('.data-table tbody');
    this.titleNodes = document.querySelectorAll('.table__title');

    // Setting up event handlers
    this.formNode.addEventListener('submit', this.submitHandler.bind(this));
    this.headerNode.addEventListener('click', this.sortHandler.bind(this));
  }

  processData({results}) {
    this.counterNode.classList.remove('hidden');
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

  /**
   * Object sequence sorting function
   * @param sequence
   * @param field
   * @param [reverse]
   * @returns {Array.<T>}
   */
  sortSequenceByFieldName(sequence, field, reverse) {
    // Sort with custom comparator function
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

    this.tableBodyNode.appendChild(row);
  }

  clearTable() {
    this.tableBodyNode.innerHTML = '';
  }

  updateTable(dataSequence) {
    this.clearTable();
    this.counterValueNode.innerText = dataSequence.length;

    dataSequence.forEach(data => {
      this.addTableRow(data);
    });
  }

  sortTable(currentNode, isSorted) {
    if(!currentNode.classList.contains('table__title')) return false;

    const inProcess = currentNode.classList.contains('up') || currentNode.classList.contains('down');
    const key = currentNode.getAttribute('data-key');

    isSorted = (inProcess) ? isSorted : this.isSorted = false;

    const sortedSequence = this.sortSequenceByFieldName(this.results, key, isSorted);
    this.updateTable(sortedSequence);

    this.titleNodes.forEach(function(node){
      node.classList.remove('up','down');
    });

    currentNode.classList.add((isSorted) ? 'down' : 'up');
    this.isSorted = !this.isSorted;
  }

  /**
   * On form submit - fetch and process data
   * @param event
   * @returns {boolean}
   */
  submitHandler(event) {
    event.preventDefault();
    const value = encodeURI(event.srcElement[0].value);
    if(!value) return false;
    const query = `${this.queryPrefix}${value}`;

    this.mainNode.classList.add('main_loading');

    fetch(query).then(response => {
      this.mainNode.classList.remove('main_loading');
      return response.json();
    }).then(this.processData.bind(this))
      .catch(console.log);
  };

  /**
   * On column heading click - sort table data by current column
   * @param event
   */
  sortHandler(event) {
    this.sortTable(event.target, this.isSorted);
  }
}

new MovieFinder();