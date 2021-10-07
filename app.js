/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
    async function searchShows(query) {
        // TODO: Make an ajax request to the searchShows api.  Remove
        // hard coded data.
        const res = await axios.get('http://api.tvmaze.com/search/shows', {params:
        {q: query}});
         let shows = [];                                                          
            for(let ind=0; ind < res.data.length; ind++){
              let items = ({id, name,summary,image}) => ({id, name,summary,image});
              let show = items( res.data[ind].show );
                if(!show.image) show.image = "https://tinyurl.com/tv-missing";
              shows.push(show);
          
            }               
        return shows;
    }
      
      /** Populate shows list:
       *     - given list of shows, add shows to DOM
       */
      
      function populateShows(shows) {
        const $showsList = $("#shows-list");
        $showsList.empty();
      
        for (let show of shows) {                                    
          let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
               <div class="card" data-show-id="${show.id}">
               <img class = "card-img-top" src = ${show.image.medium}> 
                 <div class="card-body">
                   <h5 class="card-title">${show.name}</h5>
                   <p class="card-text">${show.summary}</p>
                   <button id="epi-btn">Episodes</button>
                 </div>
               </div>
             </div>
            `);
      
      
          $showsList.append($item);
        }
      }
     
      /** Handle search form submission:
       *    - hide episodes area
       *    - get list of matching shows and show in shows list
       */
      
      $("#search-form").on("submit", async function handleSearch (evt) {
        evt.preventDefault();
      
        let query = $("#search-query").val();
        if (!query) return;
                                                            
        $("#episodes-area").hide();
      
        let shows = await searchShows(query);
      
        populateShows(shows);
      });
      
      /** Given a show ID, return list of episodes:
       *      { id, name, season, number }
       */
      
      async function getEpisodes(id) {
        // TODO: get episodes from tvmaze
        //       you can get this by making GET request to
        const epis = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
        let episodes = [];
            for(let ind=0; ind < epis.data.length; ind++){
              let items = ({id, name,season,number}) => ({id, name,season,number});
              let episode = items( epis.data[ind] );
              episodes.push(episode);
            }
        return episodes;    
        // TODO: return array-of-episode-info, as described in docstring above
      }
      
      function populateEpisodes(episodes){
        const $episodesList = $("#episodes-list");
        $episodesList.empty();
      
        for (let epis of episodes) {
          let $newItem = $(`<li>${epis.name} (season ${epis.season}, number ${epis.number})</li>`);
            $episodesList.append($newItem);
        }
        $('#episodes-area').css('display', 'block');
      }
      
      // Button for episode search:
      $("#shows-list").on("click","#epi-btn", async function epiSearch (evt) {
        evt.preventDefault();
    
      let id = $(evt.target).closest(".Show").data('show-id');
        let episodes = await getEpisodes(id);
      
        populateEpisodes(episodes);
      });