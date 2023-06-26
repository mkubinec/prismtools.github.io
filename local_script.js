  const lbHistory = {};

  function search() {
  // Generate the table storing the relevant information and populate the initial state variable from user input

    const keyword = document.getElementById('keywordInput').value;
    if (keyword.trim() === '') {
      alert('Please enter a keyword');
      return;
    }
  
    fetch('data.csv')
      .then(response => response.text())
      .then(csvData => {
        const data = parseCsvData(csvData); // Parse the CSV data

        const lbs = ['video', 'text', 'graphic', 'assessment'];
        for (lb of lbs) {
          const foundData = data.find(d => d.keyword === keyword && d.type === lb);
          if (foundData) {
            const out = [{ name : "lg_id", value : foundData.learning_goal_id}, {name : "lb_id", value : foundData.learning_byte_id}];
            displayResults(out, lb);
            initializeHistory(out, lb);
          } else {
            displayResults([], lb);
            initializeHistory([], lb);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      console.log(lbHistory);
  }

  function nextlb(lb) {
  // advance forward in the naviagation list

  const numberElement = document.getElementById(lb);
  const numbersList = numberElement.querySelectorAll('li');
  const numbers = Array.from(numbersList).map(item => item.innerText);
  const currentLg = extractNumbersFromString(numbers[0])[0];
  const currentLb = extractNumbersFromString(numbers[1])[0];
    
  console.log(currentLg, currentLb)
  
  fetch('data.csv') // Replace with the path to your CSV file
    .then(response => response.text())
    .then(csvData => {
      const data = parseCsvData(csvData); // Parse the CSV data
  
      const foundData = data.find(d => parseInt(d.learning_goal_id) === currentLg && parseInt(d.learning_byte_id) === currentLb);
      console.log(foundData);
      if (foundData) {
        const order = foundData.learning_pathway_order;
        console.log('The current order is', order);

        const newData = data.find(d => d.type === lb && parseInt(d.learning_pathway_order) > order);
        if (newData) {
          const out = [{ name: "lg_id", value: newData.learning_goal_id }, { name: "lb_id", value: newData.learning_byte_id }];
          displayResults(out, lb);
          updateHistory(out, lb);
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }  

  function prevlb(lb) {
  const numberElement = document.getElementById(lb);
  const numbersList = numberElement.querySelectorAll('li');
  const numbers = Array.from(numbersList).map(item => item.innerText);
  const currentLg = extractNumbersFromString(numbers[0])[0];
  const currentLb = extractNumbersFromString(numbers[1])[0];

  // console.log('Next button clicked on video. Current learning byte:', numbers[1]);
  fetch('data.csv') // Replace with the path to your CSV file
    .then(response => response.text())
    .then(csvData => {
      const data = parseCsvData(csvData); // Parse the CSV data
          
      const foundData = data.find(d => parseInt(d.learning_goal_id) === currentLg && parseInt(d.learning_byte_id) === currentLb);
      if (foundData) {
        const order = foundData.learning_pathway_order;
        console.log('The current order is ', order);
        const filteredData = data.filter(d => parseInt(d.learning_pathway_order) < order && d.type == lb);
        if (filteredData.length > 0) {
          const newData = filteredData[filteredData.length - 1];
          const out = [{ name : "lg_id", value : newData.learning_goal_id}, {name : "lb_id", value : newData.learning_byte_id}];
          displayResults(out, lb);
          updateHistory(out, lb);
        } else {
          console.log('First element.');
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function nextlg(lb) {
    // advance forward in the learning pathway
  
    const numberElement = document.getElementById(lb);
    const numbersList = numberElement.querySelectorAll('li');
    const numbers = Array.from(numbersList).map(item => item.innerText);
    const currentLg = extractNumbersFromString(numbers[0])[0];
    const currentLb = extractNumbersFromString(numbers[1])[0];
      
    console.log(currentLg, currentLb)
    
    fetch('data.csv') // Replace with the path to your CSV file
      .then(response => response.text())
      .then(csvData => {
        const data = parseCsvData(csvData); // Parse the CSV data
    
        const foundData = data.find(d => parseInt(d.learning_goal_id) === currentLg && parseInt(d.learning_byte_id) === currentLb);
        console.log(foundData);
        if (foundData) {
          const order = foundData.learning_pathway_order;
          // console.log('The current order is', order);
  
          const newData = data.find(d => d.type === lb && parseInt(d.learning_pathway_order) > order && parseInt(d.learning_goal_id) != currentLg);
          if (newData) {
            const out = [{ name: "lg_id", value: newData.learning_goal_id }, { name: "lb_id", value: newData.learning_byte_id }];
            displayResults(out, lb);
            updateHistory(out, lb);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

  function prevlg(lb) {
      const numberElement = document.getElementById(lb);
      const numbersList = numberElement.querySelectorAll('li');
      const numbers = Array.from(numbersList).map(item => item.innerText);
      const currentLg = extractNumbersFromString(numbers[0])[0];
      const currentLb = extractNumbersFromString(numbers[1])[0];
    
      // console.log('Next button clicked on video. Current learning byte:', numbers[1]);
      fetch('data.csv') // Replace with the path to your CSV file
        .then(response => response.text())
        .then(csvData => {
          const data = parseCsvData(csvData); // Parse the CSV data
              
          const foundData = data.find(d => parseInt(d.learning_goal_id) === currentLg && parseInt(d.learning_byte_id) === currentLb);
          if (foundData) {
            const order = foundData.learning_pathway_order;
            // console.log('The current order is ', order);
            const filteredData = data.filter(d => parseInt(d.learning_pathway_order) < order && d.type == lb && d.learning_goal_id != currentLg);
            if (filteredData.length > 0) {
              const newLg = filteredData[filteredData.length - 1].learning_goal_id;
              console.log(filteredData);
              const newData = filteredData.find(d => parseInt(d.learning_goal_id) == newLg);
              console.log(newData);
              const out = [{ name : "lg_id", value : newData.learning_goal_id}, {name : "lb_id", value : newData.learning_byte_id}];
              displayResults(out, lb);
              updateHistory(out, lb);
            } else {
              console.log('First learning goal.');
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

  function synclb(lb) {
  const numberElement = document.getElementById(lb);
  const numbersList = numberElement.querySelectorAll('li');
  const numbers = Array.from(numbersList).map(item => item.innerText);
  const currentLg = extractNumbersFromString(numbers[0])[0];
  const currentLb = extractNumbersFromString(numbers[1])[0];

  fetch('data.csv') // Replace with the path to your CSV file
    .then(response => response.text())
    .then(csvData => {
      const data = parseCsvData(csvData); // Parse the CSV data
  
      const foundData = data.find(d => parseInt(d.learning_goal_id) === currentLg && parseInt(d.learning_byte_id) === currentLb);
      console.log(foundData);
      if (foundData) {
        const lbs = ['video', 'text', 'graphic', 'assessment'];
        for (ele of lbs) {
          if (ele != lb) {
            console.log(ele);
            const newData = data.find(d => parseInt(d.learning_goal_id) == foundData.learning_goal_id && d.type == ele);
            if (newData) {
              const out = [{ name : "lg_id", value : newData.learning_goal_id}, {name : "lb_id", value : newData.learning_byte_id}];
              displayResults(out, ele);
              updateHistory(out, ele);
            } else {
              const out = [];
              displayResults(out, ele);
              updateHistory(out, ele);
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  function initializeHistory(state, lb){
    if (state == []){
      lbHistory[lb] = {
        stack: [],
        currentIndex: -1
      }
    } else {
      lbHistory[lb] = {
        stack: [],
        currentIndex: 0
      }
      lbHistory[lb].stack.push(state);
    }
  }

  function updateHistory(state, lb) {
    const currentHistory = lbHistory[lb];
    currentHistory.stack = currentHistory.stack.slice(0,currentHistory.currentIndex + 1)
    currentHistory.stack.push(state)
    currentHistory.currentIndex++
  }

  function navigateBack(lb) {
    const currentHistory = lbHistory[lb];
    if (currentHistory.currentIndex > 0) {
      currentHistory.currentIndex--;
      const state = currentHistory.stack[currentHistory.currentIndex];
      displayResults(state, lb);
    }
  }
  
  function navigateForward(lb) {
    const currentHistory = lbHistory[lb];
    if (currentHistory.currentIndex < currentHistory.stack.length - 1) {
      currentHistory.currentIndex++;
      const state = currentHistory.stack[currentHistory.currentIndex];
      displayResults(state, lb);
    }
  }
  
  function saveBookmark() {
    const key = document.getElementById('addBookmark').value;
    if (key.trim() === '') {
      alert('Please enter a bookmark name');
      return;
    }

    console.log("Bookmark name:", key);

    const content = [];
    const lbs = ['video', 'text', 'graphic', 'assessment'];
    for (lb of lbs) {
      const numberElement = document.getElementById(lb);
      console.log(numberElement);
      if (numberElement.innerText != "No results found") {
        const numbersList = numberElement.querySelectorAll('li');
        const numbers = Array.from(numbersList).map(item => item.innerText);
        const currentLg = extractNumbersFromString(numbers[0])[0];
        const currentLb = extractNumbersFromString(numbers[1])[0];
        const state = [currentLg, currentLb];
  
        content.push([lb, state]);  
      } else {
        content.push([lb, numberElement.innerText])
      }
    }
    localStorage.setItem(key, content);
  }

  function reloadBookmark() {
    const key = document.getElementById('reloadBookmark').value;
    if (key.trim() === '') {
      alert('Please enter a bookmark name');
      return;
    }

    const saveStates = localStorage.getItem(key).split(',');
    console.log(saveStates);
    if (saveStates) {
      const lbs = ['video', 'text', 'graphic', 'assessment'];
      for (lb of lbs) {
        const index = saveStates.indexOf(lb);
        if (saveStates[index+1] != 'No results found') {
          const out = [{ name : "lg_id", value : saveStates[index+1]}, {name : "lb_id", value : saveStates[index+2]}];
          displayResults(out, lb);
          updateHistory(out, lb);  
        } else {
          displayResults([], lb);
          updateHistory([], lb);  
        }
      }
    }
  }

  function displayResults(state, lb) {
    // display the text
    const resultsDiv = document.getElementById(lb);
    resultsDiv.innerHTML = '';
  
    if (state.length === 0) {
      resultsDiv.innerText = 'No learning bytes found';
    }
  
    console.log(state);
  
    const ul = document.createElement('ul');
    const numbers = [];
  
    state.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.name}: ${item.value}`; // Display name and value
        ul.appendChild(li);

        if (item.name === 'lg_id'){
          fetch('pathway.csv')
          .then(response => response.text())
          .then(data => {
            const pathway = parseCsvData(data);
    
            // Use the csvData variable for further processing
            const goal = pathway.find(d => d.learning_goal_id == item.value);
            if (goal) {
              // console.log(goal.learning_goal);
              const text = document.createElement('text');
              text.innerText = goal.learning_goal;
              ul.appendChild(text);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });   
        }
        numbers.push(parseInt(item.value));
      });
    
    resultsDiv.appendChild(ul);    
  }

  function parseCsvData(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j];
      }
      data.push(obj);
    }
    
    return data;
  }

  function extractNumbersFromString(str) {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  }
