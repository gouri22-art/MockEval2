const baseUrl = "https://beryl-ember-havarti.glitch.me/questions";

//index.html-login validation
if (location.pathname.includes('index.html')) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email == "empher@gmail.com" && password == "empher@123") {
            alert("Login Success, You are redirecting to quiz page");
            window.location.href = 'quiz.html';

        } else {
            document.getElementById('error-message').textContent = 'Invalid Email or Pasword';

        }
    });
}

//quiz.html- Add and Fetch questions
if (location.pathname.includes('quiz.html')) {
    const fetchQuestions = async () => {
        try {
            const res = await fetch(baseUrl);
            if (!res.ok) throw new Error('Failed to fetch questions');
            const questions = await res.json();
            renderQuestions(questions);
        } catch (error) {
            console.error(error.message);
            alert('Error fetching question.Please try again later.');
        }

    };

    const renderQuestions = (questions) => {
        const grid = document.getElementById('questions-grid');
        grid.innerHTML = ' ';
        if (!Array.isArray(questions) || questions.length == 0) {
            grid.innerHTML = '<p>No questions available.</p>';
            return;
        }
        questions.forEach((q) => {
            const card = document.createElement('div');
            card.className = `card ${q.reviewStatus ? 'reviewed' : ' '}`;

            // if (q.reviewStatus) card.classList.add('reviewed');
            card.innerHTML = `
            <h3> ${q.title}</h3>
            <p>A: ${q.optionA}</p>
            <p>B: ${q.optionB}</p>
            <p>C: ${q.optionC}</p>
            <p>D: ${q.optionD}</p>
            <p>Correct: ${q.correctOption}</p>
            <button class="review-btn" data-id="${q.id}">Review Questions</button>`;


            grid.appendChild(card);
        });


        document.querySelectorAll('.review-btn').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure to review the questions?')) {
                    const id = e.target.dataset.id;
                    await renderQuestions(id);
                    // await fetch('${baseUrl}${id}', {
                    //     method: 'PATCH',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ reviewStatus: true }),

                    // });
                    fetchQuestions();
                }
            })
        })
    }


    document.getElementById('add-question-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = {
            title: document.getElementById('question').value,
            optionA: document.getElementById('optionA').value,
            optionB: document.getElementById('optionB').value,
            optionC: document.getElementById('optionC').value,
            optionD: document.getElementById('optionD').value,
            correctOption: document.getElementById('correctOption').value,
            reviewStatus: false,

        };
        // await fetch(baseUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(question),

        // });
        // alert('Question Creaded');
        // fetchQuestions();
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question),

            });
            if (!response.ok) throw new Error('Failed to add Question');
            alert('Question Created');
            fetchQuestions();

        } catch (error) {
            console.log(error.message);
            alert('Error adding questions.Please try again later.');
        }
    });

    // fetchQuestions();
    const reviewedQuestions = async (id) => {
        try {
            const response = await fetch(`${baseUrl}${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewStatus: true }),
            });
            if (!response.ok) throw new Error('Failed to review question');
        } catch (error) {
            console.log(error.message);
            alert('Error reviewing questions.Please try again later.')
        }
    };
    fetchQuestions();
}

//question.html - Fetch reviewed Questions 
if (location.pathname.includes('questions.html')) {
    const fetchReviewedQuestions = async () => {
        // const res = await fetch(baseUrl);
        // const questions = await res.json();
        // const reviewedQuestions = questions.filter((q) => q.reviewStatus);
        // renderQuestions(reviewedQuestions);
        try {
            const response = await fetch(baseUrl);
            if (!response.ok) throw new Error('Failed to fetch questions');
            const questions = await response.json();
            const reviewedQuestions = questions.filter((q) =>{
            console.log(`questions:${q.title},Review status:${q.reviewStatus}`);
            return q.reviewStatus == true;
            });
            console.log("filtered questions:",renderQuestions)
            if(reviewedQuestions.length == 0){
                console.log('No review questions found.')
            }
            renderQuestions(reviewedQuestions);
        }catch (error) {
            console.log(error.message)
            alert('Error fetching questions.Please try again later.')
        }
    };
    const renderQuestions = (questions) => {
        const grid = document.getElementById('reviewed-questions-grid');
        grid.innerHTML = ' ';
        if(questions.length == 0){
            grid.innerHTML=' <p>No reviewed questions available.</p>';
            return;
        }
        questions.forEach((q) => {
            const card = document.createElement('div');
            card.classList.add('card', 'reviewed');
            card.innerHTML = `
            <h3> ${q.title}</h3>
            <p>A: ${q.optionA}</p>
            <p>B: ${q.optionB}</p>
            <p>C: ${q.optionC}</p>
            <p>D: ${q.optionD}</p>
            <p>Correct: ${q.correctOption}</p>
            <button class="review-btn" data-id="${q.id}">Review Questions</button>`;
            grid.appendChild(card)
        });
    }
    fetchReviewedQuestions()
}