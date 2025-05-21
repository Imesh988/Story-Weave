document.addEventListener('DOMContentLoaded', function () {
    //DOM element load 
    const storyGride = document.getElementById('stories-grid');
    const storyView = document.getElementById('story-view');
    const backButton = document.getElementById('back-button');
    const storyTittle = document.getElementById('story-title');
    const storyContent = document.getElementById('story-content');
    const newParagraphInput = document.getElementById('new-paragraph');
    const submitParagraphBtn = document.getElementById('submit-paragraph');
    const newStoryButton = document.getElementById('new-story-button');
    const newStoryModel = document.getElementById('new-story-modal');
    // . eken class name eken load krai clas name eken loadkrnkot queryAll ekan all agani
    const closeModelBtn = document.querySelector('.close-modal');
    const createStoryBtn = document.getElementById('create-story');
    const newStoryTittleStoryInput = document.getElementById('new-story-title');
    const newStoryFirstParagraphInput = document.getElementById('new-story-first-paragraph');

    //state // story ekaka click karoth (currentStoryid) mekta assing wela thiya gnn
    let currentStoryid = null;

    function loadStories() {
        // load all stories from firebase
        //hamaba wena data tika snapshort kiyn ekt loop kara gani
        database.ref('stories').on('value', (snapshort) => {
            storyGride.innerHTML = '';
            const stories = snapshort.val() || {}
            //object model ekkat convert karai
            Object.entries(stories).forEach(([id, story])=>{
                //last paragragp ek load kara gani
                const lastParagraph = story.paragraphs
                ? Object.values(story.paragraphs)[Object.values(story.paragraphs).length - 1]
                :{text: 'no paragraph yet'};

                const storyCard = document.createElement('div');
                storyCard.className = 'story-card';
                storyCard.innerHTML = `
                <div class="story-card-content">
                <h3>${story.title}</h3>
                <p>${lastParagraph.text}</p>
                </div>
                <div class="story-card-footer">
                <span>${story.paragraphs ? Object.keys
                    (story.paragraphs).length : 0} Paragraphs</span>
                    <button class="like-btn" data-story-id="${id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                `;

                storyGride.addEventListener('click', ()=> viewStory(id,story));
                storyGride.appendChild(storyCard);
                
            });
        })
    }

    function viewStory(id, story) {
        // view the single story
        currentStoryid = id;
        storyTittle.textContent = story.title;
        storyContent.innerHTML = '';

        if(story.paragraphs){
            Object.entries(story.paragraphs).forEach(([paragraphId, paragraph]) => {
                const paragraphE1 = document.createElement('div');
                paragraphE1.className = 'paragraph';
                paragraphE1.innerHTML = `
                <p>${paragraph.text}</p>
                <div class="paragraph-footer">
                    <button class="like-btn paragraph-like-btn" data-paragraph-id="${paragraphId}"
                    data-story-id="${id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <span class="paragraph-likes">${paragraph.likes || 0} Likes</span>
                </div>
                `;

                storyContent.appendChild(paragraphE1);
            });
        }

        document.querySelector('.stories-container').style.display = 'none';
        storyView.style.display = 'block';

        //set up like button
        document.querySelectorAll('paragraph-like-btn').forEach(btn =>{
            btn.addEventListener('click', (e)=>{
                //stopPropagation = awsha karan object tika penawi
                e.stopPropagation();

            });
        });
    }

    function likeStories(storyId){}

    function likeParagraph(storyId, paragraphId){}

    function createNewStory(title, firstParagraph) {
        // create a new story
        if (!title || !firstParagraph) {
            alert('please fill in all field');
            return;
        }

        if (firstParagraph.length < 50) {
            alert('first paragraph be at least 50 characters long');
            return;
        }

        //mulin push kela passe value eka set krannth puluwn nttn kelinm push krnnth puluwan
        const newStoryref = database.ref('stories').push();
        newStoryref.set({
            title: title,
            createAt: firebase.database.ServerValue.TIMESTAMP,
            paragraphs: {
                first: {
                    text: firstParagraph,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    like: 0
                }
            }

            
        }).then(()=>{
            newStoryModel.style.display = 'none';
            newStoryTittleStoryInput.value = '';
            newStoryFirstParagraphInput.value = '';
        })
    }

    // event listeners
    //function ekak nttn thami () pass karanne nttn function eke name eka pass karai
    createStoryBtn.addEventListener('click', ()=>{
        createNewStory(newStoryTittleStoryInput.value, newStoryFirstParagraphInput.value);
    });

    newStoryButton.addEventListener('click', ()=>{
        newStoryModel.style.display = 'flex';
    });

    closeModelBtn.addEventListener('click', ()=>{
        newStoryModel.style.display = 'none';
    });

    // patten click karath + click karala apu apu ui eka close wenna 
    // target = target wela thiyen eka
    window.addEventListener('click', (e) =>{
        if(e.target === newStoryModel){
            newStoryModel.style.display = 'none';
        }
    });

    loadStories();

});