function search() {
    const keyword = document.getElementById('keywordInput').value;
    if (keyword.trim() === '') {
      alert('Please enter a keyword');
      return;
    }
  
    fetch('data.csv') // Replace with the path to your CSV file
      .then(response => response.text())
      .then(csvData => {
        const data = parseCsvData(csvData); // Parse the CSV data
  
        const foundDataVideo = data.find(d => d.keyword === keyword && d.type === 'video');
        if (foundDataVideo) {
          const out = [{ name : "lg_id", value : foundDataVideo.learning_goal_id}, {name : "lb_id", value : foundDataVideo.learning_byte_id}];
          displayResults(out, 'video');
        } else {
          displayResults([], 'video');
        }
        const foundDataText = data.find(d => d.keyword === keyword && d.type === 'text');
        if (foundDataText) {
            const out = [{ name : "lg_id", value : foundDataVideo.learning_goal_id}, {name : "lb_id", value : foundDataVideo.learning_byte_id}];
            displayResults(out, 'text');
          } else {
            displayResults([], 'text');
          }
        const foundDataGraphic = data.find(d => d.keyword === keyword && d.type === 'graphic');
        if (foundDataGraphic) {
            const out = [{ name : "lg_id", value : foundDataVideo.learning_goal_id}, {name : "lb_id", value : foundDataVideo.learning_byte_id}];
            displayResults(out, 'graphic');
          } else {
            displayResults([], 'graphic');
          }
        const foundDataAssessment = data.find(d => d.keyword === keyword && d.type === 'assessment');
        if (foundDataAssessment) {
            const out = [{ name : "lg_id", value : foundDataVideo.learning_goal_id}, {name : "lb_id", value : foundDataVideo.learning_byte_id}];
            displayResults(out, 'assessment');
          } else {
            displayResults([], 'assessment');
          }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function extractNumbersFromString(str) {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  }

  function nextlb(lb) {
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
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
                } else {
                    console.log('First element.');
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
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
  }
    


  function displayResults(data, lb) {
    const resultsDiv = document.getElementById(lb);
    resultsDiv.innerHTML = '';
  
    if (data.length === 0) {
      resultsDiv.innerText = 'No results found';
    }
  
    console.log(data);
  
    const ul = document.createElement('ul');
    const numbers = [];
  
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.name}: ${item.value}`; // Display name and value
        ul.appendChild(li);
        numbers.push(parseInt(item.value));
      });
    
    resultsDiv.appendChild(ul);    
  }