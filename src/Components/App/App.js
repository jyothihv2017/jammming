import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      /*searchResults: this.props.searchResults,*/
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
     let tracks = this.state.playlistTracks;
     if (!tracks.includes(track)) {
       tracks.push(track);
       this.setState({playlistTracks: tracks});
     }
  }
  removeTrack(track) {
     let tracks = this.state.playlistTracks;
     tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

     this.setState({playlistTracks: tracks});
   }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }



  search(term) {

       let pTracks = this.state.playlistTracks;


    Spotify.search(term).then(searchResults => {
        if (pTracks.length ===0){
          this.setState({
            searchResults: searchResults
          })
        }
        else {
        let newSearchResults = [];
let j = -1;
      for(let i=0; i < searchResults.length; i++){
          j++;
          if (j < pTracks.length && pTracks[j].id !== searchResults[i].id) {
            i--;
            continue;
          }else if(j < pTracks.length && pTracks[j].id === searchResults[i].id){
            j = -1;
            continue;
          }else if(j >= pTracks.length){
            j = -1;
            newSearchResults.push(searchResults[i]);
            continue;
          }
      }

                this.setState({
                  searchResults: newSearchResults
                })
    }
  });

  }


  render() {
    return (
  <div>
      <h1> Ja < span className = "highlight" > mmm < /span>ing</h1>
   <div className = "App" >
      <SearchBar onSearch = {this.search} playTracks={this.state.playlistTracks} />
     <div className = "App-playlist" >
      <SearchResults searchResults = {this.state.searchResults}
      onAdd = {this.addTrack}/>
      <Playlist playlistName = {this.state.playlistName}
      playlistTracks = {this.state.playlistTracks} onRemove = {this.removeTrack}
      onNameChange = {this.updatePlaylistName} onSave = {this.savePlaylist} />
    </div>
  </div>
</div>
    );
  }


}

export default App;
