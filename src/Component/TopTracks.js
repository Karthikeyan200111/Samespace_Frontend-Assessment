import React, { useContext, useEffect, useState } from "react";
import Player from "./Player";
import back from "../Imagefiles/back.jpg";
import { AccentColorContext } from "../context/AccentColorProvider ";
import ScaleLoader from "react-spinners/ScaleLoader";


const TopTracks = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [name, setName] = useState('Please Select or Search the song Name');
  const [author, setAuthor] = useState('Please Select or Search the Artist Name');
  const [card, setCard] = useState(back);
  const [song, setSong] = useState('');
  const [id, setId] = useState('');
  const [duration, setDuration] = useState({});
  const [accent, setAccent] = useState('');
  const { accentColor, setAccentColor } = useContext(AccentColorContext); // Add state for accent color

  const handleClick = (song) => {
    setName(song.name);
    setAuthor(song.artist);
    const cover = `https://cms.samespace.com/assets/${song.cover}`;
    setCard(cover);
    setSong(song.url);
    setId(song.id);
    setSelectedSong(song.id); // Set selected song
    setAccent(song.accent);
    setAccentColor(song.accent); // Set accent color
  };

  const override = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // This makes the container take the full height of the viewport
    margin: "0 auto",
    borderColor: "red",
  };
  console.log(accent)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://cms.samespace.com/items/songs");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
        setFilteredData(result.data);
        const durations = {};
        await Promise.all(result.data.map(async (song) => {
          const audio = new Audio(song.url);
          await new Promise((resolve) => {
            audio.onloadedmetadata = () => {
              durations[song.id] = audio.duration;
              resolve();
            };
          });
        }));
        setDuration(durations);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredData(data);
      return;
    }

    const filteredItems = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredData(filteredItems);
  }, [search, data]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    if (loading) {
      return <ScaleLoader
      cssOverride={override}
      size={30} />
      }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-black w-full lg:h-[40.6rem] md:h-[35.7rem] lg:h-11/12 md:flex md:flex-row md:p-4 flex flex-col gap-10 lg:gap-40 md:gap-20" style={{ backgroundColor: accentColor || 'black' }}> {/* Apply accent color */}
      <div className="lg:ml-80 lg:p-4 w-80 flex flex-col md:ml-10 p-5 md:p-0">
        <input
          className="p-3 rounded-sm"
          type="text"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
          placeholder="Search Song, Artist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="flex flex-col items-start">
          {filteredData.map((song, index) => {
            if (song.top_track === true) {
              return (
                <div
                  className={`h-full w-full flex p-5 rounded-sm gap-4 hover:scale-105 transition-all text-white cursor-pointer ${selectedSong === song.id ? 'selected' : ''}`}
                  key={index}
                  onClick={() => handleClick(song)}
                  style={{ background: selectedSong === song.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent' }} // Apply accent color
                >
                  <div className="rounded-full">
                    <img
                      src={`https://cms.samespace.com/assets/${song.cover}`}
                      alt="songicon"
                      className="rounded-full w-10 h-10"
                    />
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="w-4/5">
                      <p>{song.name}</p>
                      <p>{song.artist}</p>
                    </div>
                    <div className="w-1/5">
                      <p>{duration[song.id] ? formatDuration(duration[song.id]) : 'Loading...'}</p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </ul>
      </div>
      <Player
        name={name}
        author={author}
        song={song}
        card={card}
        id={id}
        accent={accentColor} 
      />
    </div>
  );
};

export default TopTracks;
