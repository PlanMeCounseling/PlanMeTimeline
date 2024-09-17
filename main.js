import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { contractExpand, displayCard, updateArrowPosition, generateTimeline, resetToDefaultTimeline } from './ui.js';

document.addEventListener('DOMContentLoaded', function() {
    const timelineContainer = document.querySelector('.timeline-container');
    const arrow = document.querySelector('.arrow');
    const card = document.getElementById('card');
    const cardTitle = document.getElementById('card-title');
    const cardContent = document.getElementById('card-content');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a[data-career]');
    const stageLinks = document.querySelectorAll('.dropdown-content a[data-section]');
    const dropdownButton = document.querySelector('.controls .dropdown:nth-child(1) .dropbtn');
    const stageButton = document.querySelector('.controls .dropdown:nth-child(2) .dropbtn');
    const toggleSwitch = document.getElementById('toggle-switch');

    let selectedCareer = null;
    let selectedStage = null;
    let isSpecialTimeline = false;

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

    function fetchFirebaseData(stage, career, isSpecific, callback) {
        const basePath = isSpecific ? 'specificActionItems' : 'actionItems';
        const dataPath = `${basePath}/${stage}/${career}`;
        const dataRef = ref(database, dataPath);
        console.log(`Fetching data from: ${dataPath}`); // Debugging statement
        onValue(dataRef, snapshot => {
            const data = snapshot.val();
            console.log(`Data received from Firebase:`, data); // Debugging statement
            callback(data || []);
        }, error => {
            console.error('Firebase data fetch failed:', error);
            alert('Failed to fetch data from Firebase. Please try again later.');
        });
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCareer = this.dataset.career;
            dropdownButton.firstChild.nodeValue = this.textContent + ' ';
            card.classList.remove('active');
            contractExpand(card);
        });
    });

    stageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const newStage = this.dataset.section;
            if (newStage !== selectedStage || stageButton.textContent.trim() === 'Select Stage') {
                selectedStage = newStage;
                stageButton.innerHTML = `${this.textContent} <span class="arrow-down"></span>`;
                card.classList.remove('active');

                fetchFirebaseData(newStage, selectedCareer, isSpecialTimeline, items => {
                    if (isSpecialTimeline) {
                        generateTimeline(items, selectedStage, selectedCareer, card, cardTitle, cardContent, arrow, timelineContainer);
                    } else {
                        resetToDefaultTimeline(timelineContainer, arrow, card, selectedCareer, newStage, stageButton, fetchFirebaseData);
                        const content = {
                            title: `General ${selectedCareer} Action Items for ${newStage.charAt(0).toUpperCase() + newStage.slice(1)}`,
                            items: items
                        };
                        displayCard(content, cardTitle, cardContent, card);
                    }
                });
                console.log(`Stage selected: ${selectedStage}`); // Debugging statement
            }
        });
    });

    toggleSwitch.addEventListener('change', function() {
        selectedCareer = null;
        selectedStage = null;
        isSpecialTimeline = this.checked;

        if (isSpecialTimeline) {
            if (selectedStage) {
                fetchFirebaseData(selectedStage, selectedCareer, isSpecialTimeline, items => {
                    generateTimeline(items, selectedStage, selectedCareer, card, cardTitle, cardContent, arrow, timelineContainer);
                });
            }
        } else {
            resetToDefaultTimeline(timelineContainer, arrow, card, selectedCareer, selectedStage, stageButton, fetchFirebaseData);
        }
        console.log(`Timeline toggled. Special mode: ${isSpecialTimeline}`); // Debugging statement
    });

    document.addEventListener('click', function(event) {
        if (!card.contains(event.target) && !event.target.matches('.segment')) {
            card.classList.remove('active');
        }
    });

    resetToDefaultTimeline(timelineContainer, arrow, card, selectedCareer, selectedStage, stageButton, fetchFirebaseData); // Initialize the timeline with the default segments

    updateArrowPosition(arrow);

    setTimeout(() => contractExpand(card), 0);
    console.log('Initialization complete.'); // Debugging statement
});
