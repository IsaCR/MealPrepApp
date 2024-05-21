document.addEventListener('DOMContentLoaded', function() {
    const mealForm = document.getElementById('mealForm');
    const outputDiv = document.getElementById('output');
    
    mealForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const numPeople = document.getElementById('numPeople').value;
        const dietStyle = document.getElementById('dietStyle').value;
        const restrictions = document.getElementById('restrictions').value;
        const preferences = document.getElementById('preferences').value;
        const numBreakfast = document.getElementById('numBreakfast').value;
        const numLunch = document.getElementById('numLunch').value;
        const numDinner = document.getElementById('numDinner').value;
        const numSnack = document.getElementById('numSnack').value;

        const promptString = `Suggest ${numBreakfast} breakfast, 
                        ${numLunch} lunch(es), ${numDinner} dinner(s), ${numSnack} snack(s). 
                        Diet style: ${dietStyle}, Restrictions: ${restrictions}, Preferences: ${preferences}. 
                        Give the list of necessary ingredients including quantities for ${numPeople} people and 
                        a brief prep description for each recipe.
                        Use this format:

                        **recipe name
                        -
                        -
                        **Prep:**
                        1
                        2`;

        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: promptString
                }
            ]
        };
        
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer PERSONAL_AUTH_KEY'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            const content = data.choices[0].message.content;
            outputDiv.innerHTML = content.split('\n').map(line => {
                if (line.startsWith('**Prep:**'))  {
                    return `<h4>${line.replaceAll("*",'')}</h4>`;
                } else if (/^\d+\./.test(line)) {
                    return `<li>${line}</li>`;
                } else if (line.startsWith('**')) {
                    return `<h2>${line.replaceAll("*",'')}</h2>`;
                    
                } else {
                    return `<p>${line}</p>`;
                }
            }).join('');
        })
        .catch(error => {
            console.error('Error:', error);
        });

    });
});
