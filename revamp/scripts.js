document.addEventListener('DOMContentLoaded', function() {
    const segments = document.querySelectorAll('.segment');
    const arrow = document.querySelector('.arrow');
    const card = document.getElementById('card');
    const cardTitle = document.getElementById('card-title');
    const cardContent = document.getElementById('card-content');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const dropdownButton = document.querySelector('.dropbtn');
    const dropdownArrow = document.querySelector('.arrow-down');

    let selectedCareer = 'stem';
    let actionItems = {
        elementary: {
            stem: ['Consider enrolling in summer science camps/classes', 'Visit science museums to understand what piques your interest', 'Consider digital tools like Scratch Jr. to develop your skills'],
            humanities: ['Humanities Elementary Item 1', 'Humanities Elementary Item 2', 'Humanities Elementary Item 3'],
            sports: ['Try to play as many sports as possible to develop hand-eye coordination', 'Try to limit screentime, so that you can maximize your time between school and sports', 'Watch as much of professional sports as possible']
        },
        middle: {
            stem: ['Start preparing and participating in Math and Science Olympiads, such as MathCounts', 'Begin researching literature in your field of interest, and participate in science fairs such as ISEF', 'Create a blog or Youtube channel to display your interests in STEM'],
            humanities: ['Humanities Middle Item 1', 'Humanities Middle Item 2', 'Humanities Middle Item 3'],
            sports: ['Begin to narrow your focus down to one or two sports', 'Consider activities such as yoga to keep your body in shape', 'Begin competing and attempting to reach regional and national level tournaments to attract attention']
        },
        high: {
            stem: ['Take AP classes relating to your interests- AP Chem, AP Bio, AP Computer Science, etc.', 'Begin studying for the SAT end of the sophmore school uear, and plan to take it in August', 'Look for internship opportunities with professors in your field of interest, and consider using this research to build a project of your own'],
            humanities: ['Humanities High Item 1', 'Humanities High Item 2', 'Humanities High Item 3'],
            sports: ['Start frequenting the gym more often- consider training with a trainer to tailor your workouts to your sport', 'Focus as much as possible on one sport, and devote loads of time to it- talk to teachers to build understanding of your time commitments', 'Start posting your achievements on a seperate social media account, amd begin reaching out to college coaches with the help of a sports counselor']
        },
        college: {
            stem: ['Pursue research under a professor, and begin seeking out internships to put on your resume', 'Always be on the lookout for better college opportunities, and dont be afraid of transferring', 'Participate in hackathons, and STEM outreach programs to build your resume and skillset'],
            humanities: ['Humanities College Item 1', 'Humanities College Item 2', 'Humanities College Item 3'],
            sports: ['Sports College Item 1', 'Sports College Item 2', 'Sports College Item 3']
        }
    };

    function contractExpand() {
        segments.forEach(segment => {
            segment.classList.remove('expand');
            segment.classList.add('shrink');
        });
        setTimeout(() => {
            segments.forEach(segment => {
                segment.classList.remove('shrink');
                segment.classList.add('expand');
            });
        }, 500);
    }

    document.addEventListener('click', function(event) {
        if (!card.contains(event.target) && !event.target.matches('.segment')) {
            card.classList.remove('active');
        }
    });

    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCareer = this.dataset.career;
            dropdownButton.firstChild.nodeValue = this.textContent + ' ';
            card.classList.remove('active');
            contractExpand();
        });
    });

    segments.forEach(segment => {
        segment.addEventListener('click', function() {
            const section = this.dataset.section;
            const items = actionItems[section][selectedCareer];
            cardTitle.textContent = `Action Items for ${section.charAt(0).toUpperCase() + section.slice(1)} - ${selectedCareer.charAt(0).toUpperCase() + selectedCareer.slice(1)}`;
            cardContent.innerHTML = items.map(item => `<li>${item}</li>`).join('');
            card.classList.add('active');
        });
    });

   
    setTimeout(contractExpand, 500); 
});
