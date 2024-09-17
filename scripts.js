import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const timelineContainer = document.querySelector('.timeline');
    const card = document.getElementById('card');
    const cardTitle = document.getElementById('card-title');
    const cardContent = document.getElementById('card-content');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a[data-career]');
    const stageLinks = document.querySelectorAll('.dropdown-content a[data-section]');
    const dropdownButton = document.querySelector('.controls .dropdown:nth-child(1) .dropbtn');
    const stageButton = document.querySelector('.controls .dropdown:nth-child(2) .dropbtn');
    const toggleSwitch = document.getElementById('toggle-switch');
    const arrow = document.querySelector('.arrow');

    let selectedCareer = null;
    let selectedStage = null;
    let isSpecialTimeline = false;
    let activeSegment = null;

    const firebaseConfig = {
        apiKey: "AIzaSyCWZ-vZrDOo9GfIjauldmMJjuk_v9zD4Xg",
        authDomain: "planme-874a2.firebaseapp.com",
        databaseURL: "https://planme-874a2-default-rtdb.firebaseio.com/",
        projectId: "planme-874a2",
        storageBucket: "planme-874a2.appspot.com",
        messagingSenderId: "631247363358",
        appId: "1:631247363358:web:c8f217d92aa27cef95bd0f",
        measurementId: "G-C13CFLGMMC"
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    const timelineColors = {
        elementary: '#ffafaf',
        middle: '#a4d9a4',
        high: '#ffaa00',
        college: '#80bfff'
    };

    // Function to map "high" to "9-10" and "college" to "11-12" for display purposes
    function mapStageLabel(stage) {
        if (stage === 'high') return '9-10';
        if (stage === 'college') return '11-12';
        return stage.charAt(0).toUpperCase() + stage.slice(1); // Capitalizes "elementary" and "middle"
    }

    function setTimelineWidth() {
        const containerWidth = timelineContainer.parentElement.offsetWidth;
        timelineContainer.style.width = `${containerWidth}px`;
    }

    function fetchFirebaseData(stage, career, isSpecific, callback) {
        const basePath = isSpecific ? 'specificActionItems' : 'actionItems';
        const dataPath = `${basePath}/${stage}/${career}`;
        const dataRef = ref(database, dataPath);
        onValue(dataRef, snapshot => {
            const data = snapshot.val();
            callback(data || []);
        }, (error) => {
            console.error('Firebase data fetch failed:', error);
            alert('Failed to fetch data from Firebase. Please try again later.');
        });
    }

    function generateSegments(items) {
        timelineContainer.innerHTML = ''; // Clear existing segments

        const segmentWidth = `${Math.max(10, 100 / items.length)}%`; // Adjusts the segment width based on the number of items
        items.forEach((item, index) => {
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.dataset.index = index;
            segment.style.backgroundColor = timelineColors[selectedStage];
            segment.style.flex = `1 1 ${segmentWidth}`; // Ensures the segment takes up available space

            segment.addEventListener('click', function () {
                toggleCardVisibility(segment, index, items);
            });

            timelineContainer.appendChild(segment);
        });

        positionArrow(); // Adjust arrow position after generating segments
    }

    function generateDefaultSegments() {
        timelineContainer.innerHTML = ''; // Clear existing segments

        const stages = ['elementary', 'middle', 'high', 'college'];
        const segmentWidth = `${100 / stages.length}%`; // Ensures the segment takes up available space

        stages.forEach((stage, index) => {
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.dataset.section = stage;
            segment.style.backgroundColor = timelineColors[stage];
            segment.style.flex = `1 1 ${segmentWidth}`; // Each segment gets equal width

            // Set the label to the mapped stage name
            //segment.innerHTML = mapStageLabel(stage);

            segment.addEventListener('click', function () {
                selectStageFromSegment(stage, index);
            });

            timelineContainer.appendChild(segment);
        });

        positionArrow(); // Adjust arrow position after generating segments
    }

    function selectStageFromSegment(stage, index) {
        selectedStage = stage;
        stageButton.innerHTML = `${mapStageLabel(stage)} <span class="arrow-down"></span>`; // Display mapped stage
        card.classList.remove('active');
        activeSegment = null;
        fetchFirebaseData(selectedStage, selectedCareer, false, (items) => {
            displayCard(index, items); // Fetch and display all items for the General Timeline
        });
    }

    function displayCard(taskIndex, items) {
        if (isSpecialTimeline) {
            if (items && items.length > 0 && items[taskIndex]) {
                cardTitle.textContent = `Specific ${selectedCareer.charAt(0).toUpperCase() + selectedCareer.slice(1)} Action Items for ${mapStageLabel(selectedStage)}`;
                cardContent.innerHTML = `<li>${items[taskIndex]}</li>`;
            } else {
                cardTitle.textContent = 'No items found';
                cardContent.innerHTML = '';
            }
        } else {
            if (items && items.length > 0) {
                cardTitle.textContent = `Action Items for ${mapStageLabel(selectedStage)} - ${selectedCareer.charAt(0).toUpperCase() + selectedCareer.slice(1)}`;
                cardContent.innerHTML = items.map(item => `<li>${item}</li>`).join(''); // Show all items for the General Timeline
            } else {
                cardTitle.textContent = 'No items found';
                cardContent.innerHTML = '';
            }
        }
        card.classList.add('active');
    }

    function toggleCardVisibility(segment, taskIndex, items) {
        if (activeSegment === segment) {
            card.classList.remove('active');
            activeSegment = null;
        } else {
            activeSegment = segment;
            displayCard(taskIndex, items);
        }
    }

    function positionArrow() {
        const segments = document.querySelectorAll('.segment');
        const lastSegment = segments[segments.length - 1];
        const arrowOffset = 10; // Adjust based on arrow width
        arrow.style.left = `${lastSegment.offsetLeft + lastSegment.offsetWidth + arrowOffset}px`;
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const newCareer = this.dataset.career;
            if (newCareer !== selectedCareer || dropdownButton.textContent.trim() === 'Select Career') {
                selectedCareer = newCareer;
                dropdownButton.innerHTML = `${this.textContent} <span class="arrow-down"></span>`;
                card.classList.remove('active');
                activeSegment = null;
                if (isSpecialTimeline) {
                    fetchFirebaseData(selectedStage, selectedCareer, isSpecialTimeline, generateSegments);
                } else {
                    generateDefaultSegments();
                }
            }
        });
    });

    stageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const newStage = this.dataset.section;
            if (newStage !== selectedStage || stageButton.textContent.trim() === 'Select Stage') {
                selectedStage = newStage;
                stageButton.innerHTML = `${mapStageLabel(newStage)} <span class="arrow-down"></span>`; // Use mapped stage name
                card.classList.remove('active');
                activeSegment = null;

                if (isSpecialTimeline) {
                    fetchFirebaseData(selectedStage, selectedCareer, isSpecialTimeline, generateSegments);
                } else {
                    generateDefaultSegments();
                }
            }
        });
    });

    toggleSwitch.addEventListener('change', function() {
        isSpecialTimeline = this.checked;
        if (isSpecialTimeline) {
            if (selectedStage && selectedCareer) {
                fetchFirebaseData(selectedStage, selectedCareer, isSpecialTimeline, generateSegments);
            }
        } else {
            resetToInitialState();
        }
    });

    function resetToInitialState() {
        selectedCareer = null;
        selectedStage = null;
        card.classList.remove('active');
        activeSegment = null;
        toggleSwitch.checked = false;
        isSpecialTimeline = false;
        generateDefaultSegments(); // Generate the default segments after resetting
    }

    document.addEventListener('click', function(event) {
        if (!card.contains(event.target) && !event.target.matches('.segment')) {
            card.classList.remove('active');
            activeSegment = null;
        }
    });

    window.addEventListener('resize', function () {
        setTimelineWidth(); // Adjust the timeline width on window resize
        positionArrow(); // Adjust the arrow position on window resize
    });

    setTimelineWidth(); // Set initial width
    generateDefaultSegments(); // Initially generate the default segments
});
