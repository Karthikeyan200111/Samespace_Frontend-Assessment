import React, { useState, useRef, useEffect } from "react";
import playicon from "../Imagefiles/play.png";
import pause from "../Imagefiles/pause.png";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { RxSpeakerLoud } from "react-icons/rx";
import { LiaVolumeMuteSolid } from "react-icons/lia";
import { PiDotsThreeCircleFill } from "react-icons/pi";


const Player = ({ name, author, song, card, id ,accent}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State for mute/unmute
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newsong, setSong] = useState();
  const [newid, setNewId] = useState();
  const [newname, setName] = useState();
  const [newauthor, setAuthor] = useState();
  const [newcard, setCard] = useState();
  const [progress, setProgress] = useState(0);
  const [newaccent, setAccent] = useState(accent);

  useEffect(() => {
    setName(name);
    setAuthor(author);
    setCard(card);
    setSong(song);
    setNewId(id);
    setAccent(newaccent);
  }, [name, author, card, song, id,newaccent]);

  const handlePrevious = async () => {
    if (newid === 1) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const previousId = newid - 1;
      setNewId(previousId);
      const response = await fetch(
        `https://cms.samespace.com/items/songs/${previousId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSong(result.data.url);
      setName(result.data.name);
      setAuthor(result.data.artist);
      setAccent(result.data.accent);
      const newcover = `https://cms.samespace.com/assets/${result.data.cover}`;
      setCard(newcover);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    if (newid === 10) {
      return;
    }
    try {
      const nextId = newid + 1;
      setNewId(nextId);
      const response = await fetch(
        `https://cms.samespace.com/items/songs/${nextId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSong(result.data.url);
      setName(result.data.name);
      setAuthor(result.data.artist);
      setAccent(result.data.accent);
      const newcover = `https://cms.samespace.com/assets/${result.data.cover}`;
      setCard(newcover);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleProgress = () => {
    const audio = audioRef.current;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const width = event.target.clientWidth;
    const clickX = event.nativeEvent.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (newsong) {
      audio.src = newsong;
      audio.load();
      if (isPlaying) {
        audio.play().catch((error) => {
          setError(error.message);
        });
      }
    }
  }, [newsong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);

    if (audio) {
      audio.addEventListener("timeupdate", handleProgress);
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleProgress);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  console.log(error);

  return (
    <div className=" text-white flex  lg:w-1/3 md:w-1/2 w-full flex-col md:p-1 p-4 gap-3 rounded-lg  " style={{ backgroundColor: accent || 'black' }}>
      <div>
        <h1 className="md:text-2xl font-bold">{newname}</h1>
        <p className="text-gray-400">{newauthor}</p>
      </div>
      <div className="my-6">
        <img
          src={newcard}
          alt="album art"
          className="lg:h-80 lg:w-96 md:w-60 md:60 w-60 h-48 rounded-md mx-auto"
        />
      </div>
      <div className="w-full mx-auto text-center p-6 rounded-lg">
        {loading && <p>Loading...</p>}

        <audio ref={audioRef} />

        <div
          className="progress-bar w-full bg-gray-600 h-2 rounded mt-4"
          onClick={handleSeek}
        >
          <div
            className="progress bg-white  h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="controls flex items-center justify-between mt-4">
          <div>
            <PiDotsThreeCircleFill className="w-10 h-10 cursor-pointer" />
          </div>

          <div className="flex item-center  justify-center">
            <button className="mx-2 text-2xl" onClick={handlePrevious}>
              <FaBackward />
            </button>
            <button className="mx-2 text-2xl" onClick={togglePlayPause}>
              {isPlaying ? (
                <img
                  src={pause}
                  alt="pause"
                  className="bg-white h-10 w-10 p-2 rounded-full"
                />
              ) : (
                <img
                  src={playicon}
                  alt="play"
                  className="bg-white h-10 w-10 p-2 rounded-full"
                />
              )}
            </button>
            <button className="mx-2 text-2xl" onClick={handleNext}>
              <TbPlayerTrackNextFilled />
            </button>
          </div>

          <div>
            <button className="mx-2 text-2xl" onClick={toggleMute}>
              {isMuted ? <LiaVolumeMuteSolid /> : <RxSpeakerLoud />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
